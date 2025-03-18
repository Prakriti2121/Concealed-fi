"use client";
import { Product } from "@/types/types";
import Link from "next/link";
import React from "react";
import { MdModeEdit } from "react-icons/md";
import { FaDeleteLeft } from "react-icons/fa6";
import { deleteProductById } from "@/lib/actions/product.actions";
import toast from "react-hot-toast";

interface ProductTableProps {
  products: Product[];
}

// Table Head component
const TableHead = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => <th className={`px-6 py-3 ${className}`}>{children}</th>;

// Table Row component
const TableRow = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <tr className={`border-b border-gray-200 bg-white ${className}`}>
    {children}
  </tr>
);

// Table Header component for the table head section
const TableHeader = ({
  children,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
    {children}
  </thead>
);
// async

export const AllWinesTable = ({ products }: ProductTableProps) => {
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg ">
      <table className="w-[100%] text-sm text-left text-black ">
        <TableHeader className="font-black">
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Product Code</TableHead>
            <TableHead>Updated At</TableHead>
            <TableHead className="ml-6">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <tbody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <td className="px-6 py-4 font-medium text-black  whitespace-nowrap">
                {product.id}
              </td>
              <td className="px-6 py-4 font-medium">
                <Link
                  href={`/viinit-luettelo/${product.id}`}
                  className="hover:underline"
                >
                  {product.title}
                </Link>
              </td>
              <td className="px-6 py-4">{product.price}</td>
              <td className="px-6 py-4">{product.productCode}</td>
              <td className="px-6 py-4">{product.updatedAt}</td>
              <td className="px-6 py-4 text-right flex justify-between items-center">
                <Link href={"#"} className="text-blue-600 text-xl">
                  <MdModeEdit />
                </Link>
                <Link
                  onClick={async () => {
                    toast.success("Product deleted successfully");
                    await deleteProductById(product.id);
                  }}
                  href={"#"}
                  className="text-red-600 text-xl"
                >
                  <FaDeleteLeft />
                </Link>
              </td>
            </TableRow>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// export default AllWinesTable;
