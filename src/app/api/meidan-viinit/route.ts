import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const page = await prisma.page.findUnique({
      where: { id: 12 },
    });

    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    return NextResponse.json({
      title: page.title,
      content: page.content,
      featuredImage: page.featuredImage,
      canonicalUrl: page.canonicalUrl,
    });
  } catch (error) {
    console.error("Error fetching Our Wines page:", error);
    return NextResponse.json({ error: "Error fetching page" }, { status: 500 });
  }
}
