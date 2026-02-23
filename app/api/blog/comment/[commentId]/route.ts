import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/middleware/roleVerification";
import prisma from "@/lib/prisma";

//delete comment under 5 hours
export async function DELETE(req: NextRequest, { params }: { params: { commentId: string } }) {
 try {
      const { commentId } = params;
      const { userId } = await req.json();
      if(!userId){
        return NextResponse.json(
          { error: "User ID is required" },
          { status: 400 },
        );
      }
      const existingComment = await prisma.blogComment.findUnique({
        where: {
          id: Number(commentId),
          userId: Number(userId),
        },
      });
      if (!existingComment) {
        return NextResponse.json(
          { error: "Comment not found" },
          { status: 404 },
        );
      }
      if (existingComment.createdAt < new Date(Date.now() - 5 * 60 * 60 * 1000)) {
        return NextResponse.json(
          { error: "Comments can only be deleted within 5 hours of posting" },
          { status: 403 },
        );
      }
      const deletedComment = await prisma.blogComment.delete({
        where: {
          id: Number(commentId),
          userId: Number(userId),
        },
      });
      return NextResponse.json({
        success: true,
        message: "Comment deleted successfully",
        data: deletedComment,
      });
 } catch (error: any) {
    console.error("Error deleting comment:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete comment",
        error: error.message,
      },
      { status: 500 },
    );
 }
}
