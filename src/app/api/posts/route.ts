import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NEXT_AUTH_CONFIG } from "@/lib/auth";

const prisma = new PrismaClient();

// Force dynamic responses and disable caching:
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const session = await getServerSession(NEXT_AUTH_CONFIG);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Fetch posts with tags and categories
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        tags: true,
        categories: true,
      },
    });

    // For each post, count only approved comments
    const postsWithApprovedCount = await Promise.all(
      posts.map(async (post) => {
        const approvedCount = await prisma.comment.count({
          where: { postId: post.id, approved: true },
        });
        return { ...post, _count: { comments: approvedCount } };
      })
    );

    return NextResponse.json(postsWithApprovedCount);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Error fetching posts" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(NEXT_AUTH_CONFIG);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();

    // Process tags from the form data (using tag names)
    const tagsData = Array.isArray(body.tags)
      ? body.tags.map((tag: string) => ({
          where: { name: tag },
          create: { name: tag },
        }))
      : [];

    // Process categories from the form data (using category IDs)
    const categoriesData =
      Array.isArray(body.categories) && body.categories.length > 0
        ? body.categories.map((categoryId: number) => ({ id: categoryId }))
        : [];

    const post = await prisma.post.create({
      data: {
        title: body.title,
        slug: body.slug || body.title.toLowerCase().replace(/ /g, "-"),
        seoTitle: body.seoTitle,
        metaDesc: body.metaDesc,
        content: body.content,
        featuredImage: body.featuredImage || null,
        author: body.author || "Unknown",
        published: body.published ?? false,
        updatedAt: new Date(),
        tags: { connectOrCreate: tagsData },
        categories: { connect: categoriesData },
      },
      include: {
        tags: true,
        categories: true,
      },
    });
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json({ error: "Error creating post" }, { status: 500 });
  }
}
