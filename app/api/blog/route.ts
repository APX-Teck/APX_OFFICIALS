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
        { error: "Unable to identify authenticated user" },
        { status: 401 },
      );
    }

    const formData = await req.formData();
    const file = formData.get("thumbnail") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "Thumbnail image file is required" },
        { status: 400 },
      );
    }
    const objToValidate = {
      title: formData.get("title"),
      slug: formData.get("slug"),
      content: formData.get("content"),
      status: formData.get("status"),
      authorId: Number(formData.get("authorId")),
      thumbnail: "http://temp-url.com/pass-validation",
    };

    const validation = blogValidation.safeParse(objToValidate);

    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const { title, slug, content, status, authorId } = validation.data;

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
          error: dbError.message || "Failed to create blog post in database",
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
        { success: false, error: "Failed to upload thumbnail to ImageKit" },
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
        },
      });
    } catch (updateError: any) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to update blog post with thumbnail URL",
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
    return NextResponse.json({
      success: false,
      error: error.message || "Failed to create blog",
    });
  }
}
