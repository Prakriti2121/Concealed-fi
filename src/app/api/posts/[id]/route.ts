import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NEXT_AUTH_CONFIG } from "@/lib/auth";

const prisma = new PrismaClient();

// GET a Single Post by ID
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Await the params promise to extract the id
  const { id } = await params;
  const session = await getServerSession(NEXT_AUTH_CONFIG);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const postId = Number.parseInt(id, 10);
  if (isNaN(postId)) {
    return NextResponse.json({ error: "Invalid post ID" }, { status: 400 });
  }

  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: { tags: true, categories: true },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json({ error: "Error fetching post" }, { status: 500 });
  }
}

// UPDATE a Post
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(NEXT_AUTH_CONFIG);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const postId = Number.parseInt(id, 10);
  if (isNaN(postId)) {
    return NextResponse.json({ error: "Invalid post ID" }, { status: 400 });
  }

  try {
    const body = await req.json();

    const tagsData = Array.isArray(body.tags)
      ? body.tags.map((tag: string) => ({
          where: { name: tag },
          create: { name: tag },
        }))
      : [];

    const categoriesData = Array.isArray(body.categories)
      ? body.categories.map((category: number) => ({ id: category }))
      : [];

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        title: body.title,
        slug: body.slug || body.title.toLowerCase().replace(/ /g, "-"),
        seoTitle: body.seoTitle,
        metaDesc: body.metaDesc,
        canonicalUrl: body.canonicalUrl,
        content: body.content,
        featuredImage: body.featuredImage || null,
        author: body.author || "Unknown",
        published: body.published ?? false,
        isUncategorized: body.isUncategorized ?? false,
        tags: {
          set: [], // First, remove all existing tags
          connectOrCreate: tagsData, // Then, add the new tags
        },
        categories: {
          set: categoriesData, // This will replace all existing categories with the new ones
        },
      },
      include: { tags: true, categories: true },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    );
  }
}

// DELETE a Post
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(NEXT_AUTH_CONFIG);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const postId = Number.parseInt(id, 10);
  if (isNaN(postId)) {
    return NextResponse.json({ error: "Invalid post ID" }, { status: 400 });
  }

  try {
    await prisma.post.delete({ where: { id: postId } });
    return NextResponse.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}
