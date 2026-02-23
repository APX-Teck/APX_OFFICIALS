import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/middleware/roleVerification";
import prisma from "@/lib/prisma";

//write comment on post
export async function POST(req: NextRequest) {
 try {
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
     const { postId, comment } = await req.json();
     if (!postId || !comment) {
       return NextResponse.json(
         { error: "Missing required fields" },
         { status: 400 },
       );
     }
     const newComment = await prisma.blogComment.create({
       data: {
         comment,
         postId,
         userId: user!.id,
       },
     });
     return NextResponse.json({
       success: true,
       message: "Comment added successfully",
       data: newComment,
     });
 } catch (error: any) {
    console.error("Error writing comment:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to write comment",
        error: error.message,
      },
      { status: 500 },
    );
 }
}

//read all comments on post
export async function GET(req: NextRequest) {
 try {
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
     const { postId } = await req.json();
     if (!postId) {
       return NextResponse.json(
         { error: "Missing required fields" },
         { status: 400 },
       );
     }
     const comments = await prisma.blogComment.findMany({
       where: {
         postId,
       },
     });
     return NextResponse.json({
       success: true,
       message: "Comments fetched successfully",
       data: comments,
     });
 } catch (error: any) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch comments",
        error: error.message,
      },
      { status: 500 },
    );
 }
}