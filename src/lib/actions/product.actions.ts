"use server";

import { PrismaClient } from "@prisma/client";

export async function getAllProducts() {
  const prisma = new PrismaClient();

  const products = await prisma.product.findMany();
  return products;
}

export async function getWineById(id: number) {
  const prisma = new PrismaClient();

  const product = await prisma.product.findUnique({
    where: { id },
  });

  return product;
}

export async function deleteProductById(id: number) {
  const prisma = new PrismaClient();

  const product = await prisma.product.delete({
    where: { id },
  });

  return product;
}
