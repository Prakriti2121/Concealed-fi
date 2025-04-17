import { getWineBySlug } from "@/lib/actions/product.actions";
import Image from "next/image";
import React from "react";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function Page({ params }: PageProps) {
  // ★ await the params promise
  const { slug } = await params;

  const product = await getWineBySlug(slug);
  if (!product) {
    return <div>Product not found!</div>;
  }

  return (
    <div>
      <h1>Wine Details</h1>
      <div className="px-4 py-8">
        <Image
          src={product.largeImage || ""}
          alt={product.title || "Wine image"}
          width={200}
          height={200}
        />
        <h2 className="text-2xl font-black">{product.title}</h2>
        <p className="text-xl">Price: €{product.price}</p>
        <p>Code: {product.productCode}</p>
        <ul>
          <span className="text-xl font-bold my-4">Taste:</span>
          {Array.isArray(product.taste) &&
            product.taste.map((taste) => (
              <li key={String(taste)}>- {String(taste)}</li>
            ))}
        </ul>
        <p>Updated at: {new Date(product.updatedAt).toLocaleString()}</p>
        <div className="text-4xl font-bold my-6">Product Description</div>
        <div
          dangerouslySetInnerHTML={{
            __html: product.producerDescription || "",
          }}
        />
      </div>
    </div>
  );
}
