"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Define interfaces for the Banner and Featured Product
interface BannerItem {
  id: number;
  title: string;
  description: string;
  link: string;
  image: string;
}

interface FeaturedProduct {
  id: number;
  title: string;
  description: string;
  price: number;
  largeImage: string;
  link: string | undefined;
}

export default function BannerSection() {
  const [scrollY, setScrollY] = useState(0);
  const [bannerItems, setBannerItems] = useState<BannerItem[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<FeaturedProduct[]>(
    []
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleScroll = useCallback(() => setScrollY(window.scrollY), []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Fetch banners and featured products
  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch banners as usual
        const bannerResponse = await fetch("/api/banners");
        if (!bannerResponse.ok) {
          console.error("Failed to fetch banners");
          return;
        }
        const banners = await bannerResponse.json();
        setBannerItems(banners);

        // Fetch featured products from our /api/products endpoint
        // which returns only products where featured === true
        const productResponse = await fetch("/api/products");
        if (!productResponse.ok) {
          console.error("Failed to fetch featured products");
          return;
        }
        const products = await productResponse.json();
        setFeaturedProducts(products);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const startAutoSlide = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % bannerItems.length);
    }, 5000);
  }, [bannerItems.length]);

  useEffect(() => {
    startAutoSlide();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [startAutoSlide]);

  const handlePrevious = useCallback(() => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + bannerItems.length) % bannerItems.length
    );
    startAutoSlide();
  }, [bannerItems.length, startAutoSlide]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % bannerItems.length);
    startAutoSlide();
  }, [bannerItems.length, startAutoSlide]);

  if (isLoading) {
    return (
      <div className="w-full h-52 flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (bannerItems.length === 0 || featuredProducts.length === 0) {
    return (
      <div className="w-full h-52 flex items-center justify-center">
        No banners or featured products available
      </div>
    );
  }

  return (
    <div className="relative w-full h-[30vh] overflow-hidden">
      {/* Background Images and Featured Products Sync */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence initial={false}>
          <motion.div
            key={bannerItems[currentIndex].id}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div
              className="absolute inset-0 transition-transform duration-300 ease-out"
              style={{
                transform: `translateY(${scrollY * 0.2}px)`,
              }}
            >
              <Image
                src={bannerItems[currentIndex].image || "/placeholder.svg"}
                alt={bannerItems[currentIndex].title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Featured Products with Banner */}
      <div className="absolute z-20 top-1/2 left-0 right-0 transform -translate-y-1/2 flex items-center justify-center">
        <div className="relative w-full max-w-3xl px-4 flex items-center justify-center">
          {/* Featured Products Container with Banner */}
          <AnimatePresence initial={false}>
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              <div className="bg-black/40 backdrop-blur-sm p-4 rounded-lg shadow-lg flex flex-row items-center justify-between">
                {/* Product Image - Left Side */}
                <div className="w-1/3 flex justify-center items-center">
                  <div className="relative h-[120px] md:h-[180px]">
                    <Image
                      src={
                        featuredProducts[currentIndex]?.largeImage ||
                        "/placeholder.svg"
                      }
                      alt={featuredProducts[currentIndex]?.title}
                      width={80}
                      height={180}
                      style={{
                        objectFit: "contain",
                        height: "100%",
                        width: "auto",
                      }}
                      className="max-h-full"
                    />
                  </div>
                </div>

                {/* Product Details - Right Side */}
                <div className="w-2/3 pl-4">
                  <h2 className="text-xl md:text-2xl font-bold mb-2 text-white">
                    {featuredProducts[currentIndex]?.title}
                  </h2>
                  <p className="text-sm mb-3 text-white/90 line-clamp-2">
                    {featuredProducts[currentIndex]?.description}
                  </p>
                  <div className="flex flex-row items-center gap-4">
                    <p className="text-xl font-bold text-white">
                      €{featuredProducts[currentIndex]?.price}
                    </p>
                    <Link
                      href={featuredProducts[currentIndex]?.link || "#"}
                      className="inline-block bg-white text-black px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors duration-300 font-medium"
                    >
                      Buy Now
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controls for Slider */}
          <button
            onClick={handlePrevious}
            className="absolute -left-4 md:-left-6 top-1/2 transform -translate-y-1/2 p-2 bg-black/60 text-white rounded-full hover:bg-black/80 transition-colors duration-300"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={handleNext}
            className="absolute -right-4 md:-right-6 top-1/2 transform -translate-y-1/2 p-2 bg-black/60 text-white rounded-full hover:bg-black/80 transition-colors duration-300"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 h-full container mx-auto px-4 flex flex-col items-center justify-center">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={bannerItems[currentIndex].id}
            className="text-center text-white max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight drop-shadow-md">
              {bannerItems[currentIndex].title}
            </h1>

            <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed drop-shadow-sm">
              {bannerItems[currentIndex].description}
            </p>

            <Link
              href={bannerItems[currentIndex].link || "#"}
              className="inline-block bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-6 py-3 rounded-lg transition-all duration-300 border border-white/30"
            >
              Learn More
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slider Indicators */}
      <div className="absolute bottom-2 left-0 right-0 z-20 flex justify-center space-x-3">
        {bannerItems.map((_, index) => (
          <button
            key={index}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "bg-white w-8"
                : "bg-white/40 w-2 hover:bg-white/60"
            }`}
            onClick={() => {
              setCurrentIndex(index);
              startAutoSlide();
            }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
