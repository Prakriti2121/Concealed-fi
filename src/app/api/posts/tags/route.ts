import { type NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET: Fetch all tags from the database
export async function GET() {
  try {
    const tags = await prisma.tag.findMany();
    return NextResponse.json(tags, { status: 200 });
  } catch (error) {
    console.error("Error fetching tags:", error);
    return NextResponse.json(
      { error: "Failed to fetch tags" },
      { status: 500 }
    );
  }
}

// POST: Create a new tag in the database
export async function POST(req: NextRequest) {
  try {
    const { name } = await req.json();
    if (!name) {
      return NextResponse.json(
        { error: "Tag name is required" },
        { status: 400 }
      );
    }

    const newTag = await prisma.tag.create({
      data: { name },
    });

    return NextResponse.json(newTag, { status: 201 });
  } catch (error) {
    console.error("Error adding tag:", error);
    return NextResponse.json({ error: "Failed to add tag" }, { status: 500 });
  }
}

// DELETE: Remove a tag from the database by id
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json(
        { error: "Tag id is required" },
        { status: 400 }
      );
    }

    await prisma.tag.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Tag deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting tag:", error);
    return NextResponse.json(
      { error: "Failed to delete tag" },
      { status: 500 }
    );
  }
}
