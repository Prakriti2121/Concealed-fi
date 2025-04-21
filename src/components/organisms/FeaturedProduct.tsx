"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Autoplay, Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";

// swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";

interface Product {
  id: number;
  title: string;
  price: number;
  largeImage: string;
  slug: string;
}

const FeaturedProduct = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/featured-products");
        if (!response.ok) throw new Error("Failed to fetch products");
        const data: Product[] = await response.json();
        setProducts(data);
      } catch (err: any) {
        console.error("Error fetching products:", err);
        setError(err.message || "Failed to load products");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <div className="text-5xl font-black mb-8">
          Kunnianhimoinen viinin maahantuoja
        </div>
        <div className="text-xl">Loading wines...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <div className="text-5xl font-black mb-8">
          Kunnianhimoinen viinin maahantuoja
        </div>
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <div className="text-5xl font-black mb-8">
          Kunnianhimoinen viinin maahantuoja
        </div>
        <div className="text-xl">
          Viineitä ei ole tällä hetkellä saatavilla.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="md:mt-40">
        <motion.div
          className="text-5xl text-center font-black"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 0.5 }}
        >
          Kunnianhimoinen viinin maahantuoja
        </motion.div>
        <div className="flex justify-center text-center">
          <motion.div
            className="text-2xl border-b border-black inline-block mt-6"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 0.5 }}
          >
            Laatu on tärkeämpää kuin määrä
          </motion.div>
        </div>
      </div>

      <div
        className="relative py-12"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Swiper
          effect="coverflow"
          grabCursor
          centeredSlides
          slidesPerView={3}
          loop={products.length > 3}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 100,
            modifier: 2,
            slideShadows: false,
          }}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          modules={[EffectCoverflow, Autoplay, Navigation]}
          className="wine-swiper"
        >
          {products.map((product) => (
            <SwiperSlide key={product.id}>
              {({ isActive }) => (
                <div className="flex flex-col items-center">
                  <div
                    className={`transform transition-all duration-500 ${
                      isActive ? "scale-100" : "scale-75 opacity-50"
                    }`}
                  >
                    <div className="relative group">
                      {/* link directly, no <a> child */}
                      <Link
                        href={`/viinit-luettelo/${product.slug}`}
                        className="flex justify-center"
                      >
                        <Image
                          src={
                            product.largeImage ||
                            "/placeholder.svg?height=400&width=300"
                          }
                          alt={product.title}
                          width={300}
                          height={400}
                          className={`object-contain h-96 transition-transform duration-500 ${
                            isActive ? "group-hover:scale-105" : ""
                          }`}
                        />
                      </Link>
                    </div>
                  </div>
                  <div
                    className={`mt-4 transform transition-all duration-500 text-center w-full ${
                      isActive
                        ? "translate-y-0 opacity-100"
                        : "-translate-y-4 opacity-0"
                    }`}
                  >
                    <h3 className="text-2xl font-light">{product.title}</h3>
                    <p className="text-lg mt-2">€{product.price.toFixed(2)}</p>
                  </div>
                </div>
              )}
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation Buttons */}
        <button
          className={`swiper-button-prev absolute left-0 top-1/2 -translate-y-1/2 transition-all duration-300 ${
            isHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
          }`}
        >
          <ChevronLeft className="w-12 h-12" />
        </button>
        <button
          className={`swiper-button-next absolute right-0 top-1/2 -translate-y-1/2 transition-all duration-300 ${
            isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
          }`}
        >
          <ChevronRight className="w-12 h-12" />
        </button>
      </div>

      <div className="flex justify-center mt-6">
        <Link
          href="/viinit-luettelo"
          className="text-xl text-center inline-block bg-black text-white px-6 py-2 rounded-3xl hover:bg-white hover:text-black hover:border border-black hover:scale-90 transition-all duration-300 ease-in-out"
        >
          Näytä kaikki viinit
        </Link>
      </div>

      <style jsx global>{`
        .swiper-button-next,
        .swiper-button-prev {
          color: black;
        }
        .wine-swiper {
          padding: 2rem 0;
        }
        .swiper-slide {
          transition: all 0.3s ease;
          display: flex;
          justify-content: center;
        }
        .swiper-slide-active {
          z-index: 1;
        }
      `}</style>
    </div>
  );
};

export default FeaturedProduct;
