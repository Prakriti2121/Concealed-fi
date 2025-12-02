import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const skip = parseInt(url.searchParams.get("skip") || "0", 10);
    const take = parseInt(url.searchParams.get("take") || "5", 10);

    const products = await prisma.product.findMany({
      skip,
      take,
      orderBy: {
        createdAt: "desc", // newest first
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Error fetching products" },
      { status: 500 }
    );
  }
}
