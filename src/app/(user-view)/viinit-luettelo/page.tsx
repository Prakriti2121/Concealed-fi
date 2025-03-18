import { getAllProducts } from "@/lib/actions/product.actions";

import Image from "next/image";
import Link from "next/link";
import React from "react";

const page = async () => {
  const allWines = await getAllProducts();

  return (
    <div>
      <h1 className="text-6xl font-black ">All Wines Page</h1>

      {allWines && (
        <div className="grid grid-cols-4 mt-8 gap-8">
          {allWines?.map((wine) => {
            //   const imageUrl = new URL(wine.largeImage);
            // remove the first forward slash
            // let imageUrl;
            // if (wine.largeImage) {
            //   wine.largeImage.slice(1);
            // }
            return (
              <div
                key={wine.id}
                className="border px-4 py-8 rounded-xl shadow-xs"
              >
                <Link href={`/viinit-luettelo/${wine.id}`}>
                  <Image
                    // src={`/${imageUrl}`}
                    src={wine?.largeImage}
                    width={200}
                    height={200}
                    alt="Wine"
                  />
                </Link>
                {/* <Image src={imageUrl} width={200} height={200} alt="Wine" /> */}
                <h2 className="text-2xl font-black">{wine.title}</h2>
                <p className="text-xl ">Price : $ {wine.price}</p>
                <p>{wine.productCode}</p>
                <p>{wine.updatedAt.toISOString()}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default page;
