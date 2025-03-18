/* eslint-disable @typescript-eslint/no-explicit-any */
import { getWineById } from "@/lib/actions/product.actions";
import Image from "next/image";

import React from "react";

export default async function page({ params }: { params: any }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  const product = await getWineById(Number(id));
  return (
    <div>
      <h1>hello</h1>
      <div className=" px-4 py-8">
        <Image
          src={product?.largeImage || ""}
          alt={product?.title || "Wine image"}
          width={200}
          height={200}
        />
        <h2 className="text-2xl font-black">{product?.title}</h2>
        <p className="text-xl ">Price : $ {product?.price}</p>
        <p>{product?.productCode}</p>
        <ul>
          <span className="text-xl font-bold my-4">Taste:</span>
          {Array.isArray(product?.taste) &&
            product.taste.map((taste) => {
              return <li key={String(taste)}>- {String(taste)}</li>;
            })}{" "}
        </ul>
        <p>{product?.updatedAt?.toString()}</p>

        <div className="text-4xl font-bold my-6">
          Product Description Content
        </div>
        <div
          dangerouslySetInnerHTML={{
            __html: product?.producerDescription || "",
          }}
        />
      </div>
    </div>
  );
}
