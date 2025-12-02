import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const comments = await prisma.comment.findMany({
      include: {
        post: {
          select: {
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Error fetching comments" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { postId, author, content } = await request.json();

    if (!postId || !content) {
      return NextResponse.json(
        { error: "postId and content are required" },
        { status: 400 }
      );
    }

    const comment = await prisma.comment.create({
      data: {
        postId,
        author: author || "Anonymous",
        content,
        approved: false, // explicitly set approved to false on creation
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Error creating comment" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Comment ID is required" },
        { status: 400 }
      );
    }

    await prisma.comment.delete({
      where: { id: Number.parseInt(id) },
    });

    return NextResponse.json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json(
      { error: "Error deleting comment" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const { approved } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Comment ID is required" },
        { status: 400 }
      );
    }

    const updatedComment = await prisma.comment.update({
      where: { id: Number.parseInt(id) },
      data: { approved },
    });

    return NextResponse.json(updatedComment);
  } catch (error) {
    console.error("Error updating comment:", error);
    return NextResponse.json(
      { error: "Error updating comment" },
      { status: 500 }
    );
  }
}
