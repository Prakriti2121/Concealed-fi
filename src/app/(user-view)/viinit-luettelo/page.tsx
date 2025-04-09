import { getAllProducts } from "@/lib/actions/product.actions";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const page = async () => {
  const allWines = await getAllProducts();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-4xl font-black mb-8">All Wines</h1>

      {allWines && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allWines?.map((wine) => {
            return (
              <div
                key={wine.id}
                className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-1/3 flex justify-center items-center p-4 bg-white">
                    <Link href={`/viinit-luettelo/${wine.id}`}>
                      <div className="relative h-48 w-32">
                        <Image
                          src={wine?.largeImage}
                          alt={wine.title || "Wine"}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-contain"
                        />
                      </div>
                    </Link>
                  </div>
                  <div className="w-full md:w-2/3 p-4 flex flex-col justify-between">
                    <div>
                      <Link
                        href={`/viinit-luettelo/${wine.id}`}
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
                          <span className="text-green-900">
                            <Link href={wine.buyLink}>Etsi lähin myymälä</Link>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default page;
