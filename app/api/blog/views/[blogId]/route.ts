import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/middleware/roleVerification";
import { blogValidation } from "@/lib/validation/blog.validation";
import UploadService from "@/lib/service/imagekit/upload";

//increment the view count
export async function PATCH(
  req: NextRequest,
  { params }: { params: { blogId: string } },
) {
  try {
    const blogId = Number(params.blogId);

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
  { params }: { params: { blogId: string } },
) {
  try {
    const { error, user } = await verifyToken(["SUPER_ADMIN", "EDITOR"])(req);
    if (error) {
      return error;
    }

    const formData = await req.formData();
    const file = formData.get("thumbnail") as File | null;
    const blogId = Number(params.blogId);

    if (isNaN(blogId)) {
      return NextResponse.json({ error: "Invalid blog ID" }, { status: 400 });
    }

    // Create an object to validate with Zod
    // Provide a dummy URL for thumbnail temporarily to pass the validation
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

    // Increased timeout to 15s to allow for the image upload to ImageKit
    const finalBlog = await prisma.$transaction(
      async (tx) => {
        const newBlog = await tx.blogPost.update({
          where: { id: Number(blogId) },
          data: {
            title,
            slug,
            content,
            status,
            authorId,
          },
        });

        if (file) {
          const buffer = Buffer.from(await file.arrayBuffer());
          const fileExtension = file.name.split(".").pop() || "jpg";
          const safeTitle = title.replace(/[^a-zA-Z0-9]/g, "-");
          const fileName = `${newBlog.id}-${safeTitle}.${fileExtension}`;

          const uploadResult = await UploadService.uploadDocument(
            buffer,
            fileName,
            "/APX/POSTS",
          );

          const updatedBlog = await tx.blogPost.update({
            where: { id: newBlog.id },
            data: {
              thumbnail: uploadResult.url,
            },
          });

          return updatedBlog;
        }

        return newBlog;
      },
      { timeout: 15000 },
    );

    return NextResponse.json({
      success: true,
      message: "Blog updated successfully",
      data: finalBlog,
    });
  } catch (error: any) {
    console.error("Error updating blog:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update blog",
        error: error.message,
      },
      { status: 500 },
    );
  }
}

//delete blog
export async function DELETE(
  req: NextRequest,
  { params }: { params: { blogId: string } },
) {
  try {
    const { error, user } = await verifyToken(["SUPER_ADMIN"])(req);
    if (error) {
      return error;
    }

    const blogId = Number(params.blogId);

    if (isNaN(blogId)) {
      return NextResponse.json({ error: "Invalid blog ID" }, { status: 400 });
    }

    const existingBlog = await prisma.blogPost.findUnique({
      where: { id: blogId },
    });

    if (!existingBlog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    const blog = await prisma.blogPost.delete({
      where: { id: blogId },
    });

    return NextResponse.json({
      success: true,
      message: "Blog deleted successfully",
      data: blog,
    });
  } catch (error: any) {
    console.error("Error deleting blog:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete blog",
        error: error.message,
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
