import { getAllProducts } from "@/lib/actions/product.actions";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import React from "react";

interface PageProps {
  searchParams: {
    page?: string;
  };
}

interface SeoData {
  title: string;
  seoTitle: string;
  metaDesc: string;
  canonicalUrl: string;
}

export async function generateMetadata(): Promise<Metadata> {
  // Build your absolute base URL
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "") ||
    "http://localhost:3000";

  // Fetch your page’s SEO data
  const res = await fetch(`${baseUrl}/api/viinit`, {
    cache: "no-cache",
  });

  if (!res.ok) {
    // fallback values
    return {
      title: "All Wines",
      description: "Browse our full catalog of wines.",
    };
  }

  const data: SeoData = await res.json();

  return {
    title: data.seoTitle || data.title,
    description: data.metaDesc || "Browse our full catalog of wines.",
    alternates: {
      canonical: data.canonicalUrl || baseUrl,
    },
  };
}

const PRODUCTS_PER_PAGE = 9;

export default async function Page({ searchParams }: PageProps) {
  // parse & clamp page number
  const raw = parseInt(searchParams.page ?? "1", 10);
  const currentPage = isNaN(raw) || raw < 1 ? 1 : raw;

  // fetch products
  const allWines = await getAllProducts();
  const totalPages = Math.ceil(allWines.length / PRODUCTS_PER_PAGE);
  const safePage = Math.min(currentPage, totalPages);
  const start = (safePage - 1) * PRODUCTS_PER_PAGE;
  const displayed = allWines.slice(start, start + PRODUCTS_PER_PAGE);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-4xl font-black mb-8">All Wines</h1>

      {displayed.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayed.map((wine) => (
            <div
              key={wine.id}
              className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col md:flex-row">
                {/* Image */}
                <div className="w-full md:w-1/3 flex justify-center items-center p-4 bg-white">
                  <Link href={`/viinit-luettelo/${wine.slug}`}>
                    <div className="relative h-48 w-32 cursor-pointer">
                      <Image
                        src={wine.largeImage}
                        alt={wine.title || "Wine"}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-contain"
                      />
                    </div>
                  </Link>
                </div>

                {/* Details */}
                <div className="w-full md:w-2/3 p-4 flex flex-col justify-between">
                  <div>
                    <Link
                      href={`/viinit-luettelo/${wine.slug}`}
                      className="block hover:text-gray-600"
                    >
                      <h2 className="text-xl font-bold leading-tight mb-2">
                        {wine.title}
                      </h2>
                    </Link>
                    <p className="text-sm text-gray-600 mb-1">
                      Code: {wine.productCode}
                    </p>
                  </div>

                  <div className="mt-4">
                    <div className="text-2xl font-bold text-gray-900 mb-2">
                      {wine.price} €
                    </div>

                    <div className="flex flex-col space-y-2">
                      <button className="bg-[#333333] text-white py-2 px-4 rounded font-medium hover:bg-black transition-colors">
                        Lue lisää
                      </button>

                      <div className="text-sm">
                        Saatavana Alkon myymälöiden •{" "}
                        <Link
                          href={wine.buyLink}
                          className="text-green-900 hover:underline"
                        >
                          Etsi lähin myymälä
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No wines found.</p>
      )}

      {/* Pagination */}
      <div className="flex justify-center items-center space-x-4 mt-8">
        {safePage > 1 && (
          <Link
            href={`?page=${safePage - 1}`}
            className="px-3 py-1 border rounded hover:bg-gray-100"
          >
            Previous
          </Link>
        )}
        <span>
          Page {safePage} of {totalPages}
        </span>
        {safePage < totalPages && (
          <Link
            href={`?page=${safePage + 1}`}
            className="px-3 py-1 border rounded hover:bg-gray-100"
          >
            Next
          </Link>
        )}
      </div>
    </div>
  );
}
