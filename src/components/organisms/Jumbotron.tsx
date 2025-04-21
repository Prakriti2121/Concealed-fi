"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { motion } from "motion/react";

interface Product {
  id: number;
  title: string;
  price: number;
  largeImage: string;
  taste?: string;
  slug: string;
}

const Jumbotron = () => {
  const router = useRouter();
  const [latestProduct, setLatestProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLatestProduct = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/featured-products");
        if (!res.ok) throw new Error("Failed to fetch product");
        const products: Product[] = await res.json();
        if (products.length) setLatestProduct(products[0]);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Error fetching product");
      } finally {
        setTimeout(() => setIsLoading(false), 800);
      }
    };
    fetchLatestProduct();
  }, []);

  const handleReadMore = () => {
    if (latestProduct) {
      router.push(`/viinit-luettelo/${latestProduct.slug}`);
    }
  };

  return (
    <div className="container mx-auto flex items-center min-h-screen px-4 sm:px-6 py-12 sm:py-16 md:py-0 overflow-hidden">
      {isLoading ? (
        <div className="w-full flex flex-col items-center justify-center">
          <p className="text-xl md:text-2xl font-medium">Loading...</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 items-center gap-4 sm:gap-6 lg:gap-8 w-full">
          <div className="z-10 order-2 md:order-1 space-y-4 sm:space-y-6">
            {error ? (
              <p className="text-xl text-red-500">Error: {error}</p>
            ) : latestProduct ? (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.5 }}
                  transition={{ duration: 0.5 }}
                  className="text-3xl sm:text-4xl lg:text-6xl font-black"
                >
                  {latestProduct.title}
                </motion.div>
                <motion.p
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.5 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="my-4 sm:my-6 md:my-8 text-sm sm:text-base"
                >
                  {latestProduct.taste}
                </motion.p>
                <Button
                  onClick={handleReadMore}
                  className="relative overflow-hidden bg-[#09090B] text-lg sm:text-xl px-3 sm:px-4 py-2 h-full text-white border border-transparent group transition-all duration-300 ease-in-out hover:border-black"
                >
                  <span className="relative z-10 transition-all duration-300 ease-in-out group-hover:text-black">
                    Lue lisää
                  </span>
                  <span className="absolute left-0 top-0 w-0 h-full bg-white transition-all duration-500 ease-in-out group-hover:w-full"></span>
                </Button>
              </>
            ) : (
              // Fallback static content
              <>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.5 }}
                  transition={{ duration: 0.5 }}
                  className="text-3xl sm:text-4xl lg:text-6xl font-black"
                >
                  Bertrand Machard de Gramont Nuits-saint-Georges Les Terrasses
                  des Vallerots 2014
                </motion.div>
                <motion.p
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.5 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="my-4 sm:my-6 md:my-8 text-sm sm:text-base"
                >
                  Berried and fresh reds are light or medium-bodied wines
                  infused with the flavours and activity of fresh berries. You
                  can discern lippik cranberry, raspberry and cherry notes in
                  these wines. Crisp freshness makes them ideal for a variety of
                  foods.
                </motion.p>
                <Button
                  onClick={() => router.push("/viinit-luettelo/default-slug")}
                  className="relative overflow-hidden bg-[#09090B] text-lg sm:text-xl px-3 sm:px-4 py-2 h-full text-white border border-transparent group transition-all duration-300 ease-in-out hover:border-black"
                >
                  <span className="relative z-10 transition-all duration-300 ease-in-out group-hover:text-black">
                    Lue lisää
                  </span>
                  <span className="absolute left-0 top-0 w-0 h-full bg-white transition-all duration-500 ease-in-out group-hover:w-full"></span>
                </Button>
              </>
            )}
          </div>
          <div className="-z-10 order-1 md:order-2 flex justify-center items-center">
            <div className="rotate-[30deg] transform-gpu">
              {!isLoading &&
                (latestProduct ? (
                  <Image
                    src={latestProduct.largeImage || "/placeholder.svg"}
                    width={250}
                    height={250}
                    alt={latestProduct.title}
                    className="animate-floating cursor-pointer w-28 h-auto sm:w-40 md:w-44 lg:w-56 xl:w-64"
                  />
                ) : (
                  <Image
                    src="/images/wine-header.webp"
                    width={500}
                    height={500}
                    alt="Header Wine"
                    className="animate-floating cursor-pointer w-28 h-auto sm:w-40 md:w-44 lg:w-56 xl:w-64"
                  />
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Jumbotron;
