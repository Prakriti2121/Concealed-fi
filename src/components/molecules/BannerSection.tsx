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
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Track scroll for parallax effect
  const handleScroll = useCallback(() => {
    setScrollY(window.scrollY);
  }, []);
  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Fetch banners and featured products once on mount
  useEffect(() => {
    async function fetchData() {
      try {
        const bannerResponse = await fetch("/api/banners");
        if (bannerResponse.ok) {
          const banners: BannerItem[] = await bannerResponse.json();
          setBannerItems(banners);
        } else {
          console.error("Failed to fetch banners");
        }

        const productResponse = await fetch("/api/products");
        if (productResponse.ok) {
          const products: FeaturedProduct[] = await productResponse.json();
          setFeaturedProducts(products);
        } else {
          console.error("Failed to fetch featured products");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  // Auto‑slide interval (only when banners exist)
  const startAutoSlide = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (bannerItems.length === 0) return;

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % bannerItems.length);
    }, 5000);
  }, [bannerItems.length]);

  useEffect(() => {
    startAutoSlide();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startAutoSlide]);

  // Manual controls
  const handlePrevious = useCallback(() => {
    setCurrentIndex(
      (prev) => (prev - 1 + bannerItems.length) % bannerItems.length
    );
    startAutoSlide();
  }, [bannerItems.length, startAutoSlide]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % bannerItems.length);
    startAutoSlide();
  }, [bannerItems.length, startAutoSlide]);

  // Loading & empty states
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

  // Current items
  const currentBanner = bannerItems[currentIndex];
  const currentProduct = featuredProducts[currentIndex];

  return (
    <div className="relative w-full h-[40vh] sm:h-[35vh] md:h-[30vh] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence initial={false}>
          <motion.div
            key={currentBanner.id}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div
              className="absolute inset-0 transition-transform duration-300 ease-out"
              style={{ transform: `translateY(${scrollY * 0.2}px)` }}
            >
              <Image
                src={currentBanner.image ?? "/placeholder.svg"}
                alt={currentBanner.title ?? ""}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Featured Products Slider */}
      <div className="absolute z-20 top-1/2 left-0 right-0 transform -translate-y-1/2 flex items-center justify-center">
        <div className="relative w-full max-w-3xl px-4 flex items-center justify-center">
          <AnimatePresence initial={false}>
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              <div className="bg-black/40 backdrop-blur-sm p-3 sm:p-4 rounded-lg shadow-lg flex flex-row items-center justify-between">
                {/* Product Image */}
                <div className="w-1/3 flex justify-center items-center">
                  <div className="relative h-[80px] sm:h-[120px] md:h-[180px]">
                    <Image
                      src={currentProduct.largeImage ?? "/placeholder.svg"}
                      alt={currentProduct.title ?? ""}
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
                {/* Product Details */}
                <div className="w-2/3 pl-2 sm:pl-4">
                  <h2 className="text-sm sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2 text-white line-clamp-1 sm:line-clamp-2">
                    {currentProduct.title}
                  </h2>
                  <p className="text-xs sm:text-sm mb-2 sm:mb-3 text-white/90 line-clamp-1 sm:line-clamp-2 hidden xs:block">
                    {currentProduct.description}
                  </p>
                  <div className="flex flex-row items-center gap-2 sm:gap-4">
                    <p className="text-sm sm:text-xl font-bold text-white">
                      €{currentProduct.price}
                    </p>
                    <Link
                      href={currentProduct.link ?? "#"}
                      className="inline-block bg-white text-black px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-base rounded-lg hover:bg-opacity-90 transition-colors duration-300 font-medium"
                    >
                      Osta nyt
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Slider Controls */}
          <button
            onClick={handlePrevious}
            className="absolute -left-2 md:-left-6 top-1/2 transform -translate-y-1/2 p-1 sm:p-2 bg-black/60 text-white rounded-full hover:bg-black/80 transition-colors duration-300"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
          <button
            onClick={handleNext}
            className="absolute -right-2 md:-right-6 top-1/2 transform -translate-y-1/2 p-1 sm:p-2 bg-black/60 text-white rounded-full hover:bg-black/80 transition-colors duration-300"
            aria-label="Next slide"
          >
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>
      </div>

      {/* Text Overlay */}
      <div className="relative z-10 h-full container mx-auto px-4 flex flex-col items-center justify-center">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={currentBanner.id}
            className="text-center text-white max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-2 sm:mb-4 md:mb-6 leading-tight drop-shadow-md">
              {currentBanner.title}
            </h1>
            <p className="text-sm xs:text-base sm:text-lg md:text-xl text-white/90 mb-4 sm:mb-6 md:mb-8 leading-relaxed drop-shadow-sm hidden xs:block">
              {currentBanner.description}
            </p>
            <Link
              href={currentBanner.link ?? "#"}
              className="inline-block bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-3 sm:px-4 md:px-6 py-1 sm:py-2 md:py-3 text-xs sm:text-sm md:text-base rounded-lg transition-all duration-300 border border-white/30"
            >
              Learn More
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-1 sm:bottom-2 left-0 right-0 z-20 flex justify-center space-x-2 sm:space-x-3">
        {bannerItems.map((_, index) => (
          <button
            key={index}
            className={`h-1 sm:h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "bg-white w-4 sm:w-8"
                : "bg-white/40 w-1 sm:w-2 hover:bg-white/60"
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
