import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NEXT_AUTH_CONFIG } from "@/lib/auth";

const prisma = new PrismaClient();

// GET a single product by ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const session = await getServerSession(NEXT_AUTH_CONFIG);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const productId = Number(id);
  if (isNaN(productId)) {
    return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
  }
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Error fetching product" },
      { status: 500 }
    );
  }
}

// UPDATE a product
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const session = await getServerSession(NEXT_AUTH_CONFIG);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const productId = Number(id);
  if (isNaN(productId)) {
    return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
  }
  try {
    // Parse the incoming form data (multipart/form-data)
    const formData = await req.formData();
    const data: any = {};

    for (const [key, value] of formData.entries()) {
      if (["price", "bottleVolume", "alcohol"].includes(key)) {
        data[key] = Number(value);
      } else if (key === "taste") {
        // If taste is an empty string, set it as an empty array
        const strValue = value as string;
        if (strValue.trim() === "") {
          data[key] = [];
        } else {
          try {
            data[key] = JSON.parse(strValue);
          } catch {
            data[key] = strValue;
          }
        }
      } else {
        data[key] = value;
      }
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data,
    });

    // Use nullish coalescing to guarantee an object is returned
    return NextResponse.json(updatedProduct ?? {});
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}
