import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Fetch the first 6 products without any filtering
    const products = await prisma.product.findMany({
      take: 6, // Limit to 6 products
      orderBy: {
        createdAt: "desc", // Show newest first
      },
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Error fetching products" }, { status: 500 })
  }
}
