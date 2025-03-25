import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Look up the page by its slug; adjust if you use an id instead.
    const page = await prisma.page.findUnique({
      where: { slug: "viini-artikkelit" },
    });

    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    return NextResponse.json({
      title: page.title,
      seoTitle: page.seoTitle,
      metaDesc: page.metaDesc,
      canonicalUrl: page.canonicalUrl,
    });
  } catch (error) {
    console.error("Error fetching page:", error);
    return NextResponse.json({ error: "Error fetching page" }, { status: 500 });
  }
}
