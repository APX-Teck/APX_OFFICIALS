import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { blogValidation } from "@/lib/validation/blog.validation";
import { imagekit } from "@/lib/service/imagekit/upload";
import { verifyToken } from "@/lib/middleware/roleVerification";

//create blog
export async function POST(req: NextRequest) {
  try {
    const { error, user } = await verifyToken(["SUPER_ADMIN", "EDITOR"])(req);
    if (error) {
      return error;
    }
    if (!user || !user.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Unable to identify authenticated user",
          error: "Unauthorized",
        },
        { status: 401 },
      );
    }

    const formData = await req.formData();

    const file = formData.get("thumbnail") as File | null;

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          message: "Thumbnail image file is required",
          error: "Missing file",
        },
        { status: 400 },
      );
    }

    let slugValue = formData.get("slug")?.toString() || "No Link Found";

    if (!slugValue || slugValue.trim() === "") {
      slugValue = "No Link Found"
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
    }

    const parsedData = {
      title:formData.get("title")?.toString() || "",
      slug: slugValue,
      content: formData.get("content")?.toString() || "",
      status: formData.get("status")?.toString() || "DRAFT",
    };

    const validation = blogValidation
      .omit({ thumbnail: true, authorId: true })
      .safeParse(parsedData);

    const authorId = user.id;

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation Failed",
          error: validation.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { title, slug, content, status } = validation.data;

    // 1. Create the blog post in the database first (without thumbnail)
    let newBlog;
    try {
      newBlog = await prisma.blogPost.create({
        data: {
          title,
          slug,
          content,
          status,
          authorId,
        },
      });
    } catch (dbError: any) {
      return NextResponse.json(
        {
          success: false,
          message: "Database error",
          error: dbError,
        },
        { status: 500 },
      );
    }

    // 2. Perform the external ImageKit upload operation
    let uploadResult;
    try {
      const buffer = Buffer.from(await file.arrayBuffer());
      const fileExtension = file.name.split(".").pop() || "jpg";
      const safeTitle = title.replace(/[^a-zA-Z0-9]/g, "-");
      const fileName = `${newBlog.id}-${safeTitle}.${fileExtension}`;

      uploadResult = await imagekit.upload({
        file: buffer,
        fileName: fileName,
        useUniqueFileName: false,
        folder: "/APX/POSTS",
      });
    } catch (uploadError: any) {
      // Rollback: delete the recently created blog post to prevent orphaned records
      await prisma.blogPost
        .delete({ where: { id: newBlog.id } })
        .catch(console.error);

      return NextResponse.json(
        {
          success: false,
          message: "Failed to upload thumbnail to ImageKit",
          error: uploadError,
        },
        { status: 500 },
      );
    }

    // 3. Update the blog post with the generated ImageKit URL
    let finalBlog;
    try {
      finalBlog = await prisma.blogPost.update({
        where: { id: newBlog.id },
        data: {
          thumbnail: uploadResult.url,
          fieldId: uploadResult.fileId,
        },
      });
    } catch (updateError: any) {
      // Rollback: delete the blog post if the update fails to prevent a blog without a thumbnail
      await prisma.blogPost
        .delete({ where: { id: newBlog.id } })
        .catch(console.error);

      return NextResponse.json(
        {
          success: false,
          message: "Failed to update blog post with thumbnail URL",
          error: updateError,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Blog created successfully",
      data: finalBlog,
    });
  } catch (error: any) {
    console.error("Error creating blog:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error,
      },
      { status: 500 },
    );
  }
}

//filter blogs using pagination
export async function GET(req: NextRequest) {
  try {
    // const { error, user } = await verifyToken(["SUPER_ADMIN", "EDITOR"])(req);
    // if (error) return error;

    const searchParams = req.nextUrl.searchParams;
``
    const title = searchParams.get("title")?.trim();
    const content = searchParams.get("content")?.trim();
    const status = searchParams.get("status")?.trim();

    const page = Math.max(parseInt(searchParams.get("page") || "1"), 1);
    const limit = Math.min(
      Math.max(parseInt(searchParams.get("limit") || "10"), 1),
      100,
    );
    const offset = (page - 1) * limit;

    const where: any = {};

    if (title) {
      where.title = {
        contains: title,
        mode: "insensitive",
      };
    }

    if (content) {
      where.content = {
        contains: content,
        mode: "insensitive",
      };
    }

    if (status) {
      where.status = status;
    }

    const [blogs, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.blogPost.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      message: "Blogs fetched successfully",
      data: {
        blogs,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    );
  }
}
