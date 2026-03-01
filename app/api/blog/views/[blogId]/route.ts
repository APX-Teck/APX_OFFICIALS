import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/middleware/roleVerification";
import { blogValidation } from "@/lib/validation/blog.validation";
import UploadService from "@/lib/service/imagekit/upload";
import { Prisma } from "@prisma/client";

//increment the view count
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ blogId: string }> },
) {
  try {
    const id = await params;
    const blogId = Number(id.blogId);

    if (isNaN(blogId)) {
      return NextResponse.json({ error: "Invalid blog ID" }, { status: 400 });
    }

    const existingBlog = await prisma.blogPost.findUnique({
      where: { id: blogId },
    });

    if (!existingBlog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    const blog = await prisma.blogPost.update({
      where: { id: blogId },
      data: {
        views: { increment: 1 },
      },
    });
    return NextResponse.json({
      success: true,
      message: "Enjoy the blog",
      data: blog,
    });
  } catch (error: any) {
    console.error("Error incrementing view:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to enjoy the blog",
        error: error.message,
      },
      { status: 500 },
    );
  }
}

//update the blog
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ blogId: string }> },
) {
  try {
    const { error, user } = await verifyToken(["SUPER_ADMIN", "EDITOR"])(req);
    if (error) return error;

    if (!user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const id = await params;
    const blogId = Number(id.blogId);

    if (Number.isNaN(blogId)) {
      return NextResponse.json(
        { success: false, message: "Invalid blog ID" },
        { status: 400 },
      );
    }

    const existingBlog = await prisma.blogPost.findUnique({
      where: { id: blogId },
    });

    if (!existingBlog) {
      return NextResponse.json(
        { success: false, message: "Blog not found" },
        { status: 404 },
      );
    }

    const formData = await req.formData();
    const file = formData.get("thumbnail") as File | null;

    let slugValue = formData.get("slug")?.toString() || existingBlog.slug;

    if (!slugValue || slugValue.trim() === "") {
      slugValue =
        formData
          .get("title")
          ?.toString()
          ?.toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "") || existingBlog.slug;
    }

    const parsedData = {
      title: formData.get("title")?.toString() || existingBlog.title,
      slug: slugValue,
      content: formData.get("content")?.toString() || existingBlog.content,
      status: formData.get("status")?.toString() || existingBlog.status,
    };

    const validation = blogValidation
      .omit({ thumbnail: true, authorId: true })
      .safeParse(parsedData);

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

    // Check slug uniqueness (if changed)
    if (slug !== existingBlog.slug) {
      const slugExists = await prisma.blogPost.findUnique({
        where: { slug },
      });

      if (slugExists) {
        return NextResponse.json(
          { success: false, message: "Slug already exists" },
          { status: 400 },
        );
      }
    }

    let thumbnailUrl = existingBlog.thumbnail;
    let fileId = existingBlog.fieldId;

    // If new thumbnail uploaded
    if (file) {
      try {
        const buffer = Buffer.from(await file.arrayBuffer());
        const fileExtension = file.name.split(".").pop() || "jpg";
        const safeTitle = title.replace(/[^a-zA-Z0-9]/g, "-");
        const fileName = `${existingBlog.id}-${safeTitle}.${fileExtension}`;

        // Optional: delete old image
        if (existingBlog.fieldId) {
          await UploadService.deleteImage(existingBlog.fieldId).catch(() => {});
        }

        const uploadResult = await UploadService.uploadDocument(
          buffer,
          fileName,
          "/APX/POSTS",
        );

        thumbnailUrl = uploadResult.url;
        fileId = uploadResult.fileId;
      } catch (uploadError) {
        return NextResponse.json(
          {
            success: false,
            message: "Failed to upload new thumbnail",
          },
          { status: 500 },
        );
      }
    }

    const updatedBlog = await prisma.blogPost.update({
      where: { id: blogId },
      data: {
        title,
        slug,
        content,
        status,
        thumbnail: thumbnailUrl,
        fieldId: fileId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Blog updated successfully",
      data: updatedBlog,
    });
  } catch (error) {
    console.error("Error updating blog:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { success: false, message: "Duplicate slug" },
          { status: 400 },
        );
      }
    }

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

//delete blog
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ blogId: string }> },
) {
  try {
    const { error } = await verifyToken(["SUPER_ADMIN"])(req);
    if (error) return error;
    const id = await params;
    const blogId = Number(id.blogId);

    if (!blogId || isNaN(blogId)) {
      return NextResponse.json(
        { success: false, message: "Invalid blog ID" },
        { status: 400 },
      );
    }
    const existingBlog = await prisma.blogPost.findUnique({
      where: { id: blogId },
      select: { fieldId: true },
    });

    if (!existingBlog) {
      return NextResponse.json(
        { success: false, message: "Blog not found" },
        { status: 404 },
      );
    }

    if (existingBlog.fieldId) {
      await UploadService.deleteImage(existingBlog.fieldId);
    }

    // Direct delete (Prisma throws error if not found)
    const deletedBlog = await prisma.blogPost.delete({
      where: { id: blogId },
    });

    return NextResponse.json({
      success: true,
      message: "Blog deleted successfully",
      data: deletedBlog,
    });
  } catch (error) {
    console.error("Error deleting blog:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete blog",
      },
      { status: 500 },
    );
  }
}

//toogle like the blog
export async function POST(
  req: NextRequest,
  { params }: { params: { blogId: string } },
) {
  try {
    const blogId = Number(params.blogId);

    if (isNaN(blogId)) {
      return NextResponse.json({ error: "Invalid blog ID" }, { status: 400 });
    }

    const { error, user } = await verifyToken([
      "SUPER_ADMIN",
      "ADMIN",
      "SALES",
      "CLIENT",
      "USER",
      "EDITOR",
    ])(req);
    if (error) {
      return error;
    }

    const existingLike = await prisma.blogLike.findUnique({
      where: {
        postId_userId: {
          postId: blogId,
          userId: user!.id,
        },
      },
    });

    if (existingLike) {
      await prisma.blogLike.delete({
        where: {
          postId_userId: {
            postId: blogId,
            userId: user!.id,
          },
        },
      });

      return NextResponse.json({ liked: false });
    } else {
      await prisma.blogLike.create({
        data: {
          postId: blogId,
          userId: user!.id,
        },
      });

      return NextResponse.json({ liked: true });
    }
  } catch (error) {
    console.error("Like toggle error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
