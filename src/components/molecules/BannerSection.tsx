"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface BannerItem {
  id: number;
  title: string;
  description: string;
  link: string;
  image: string;
}

export default function BannerSection() {
  const [scrollY, setScrollY] = useState(0);
  const [bannerItems, setBannerItems] = useState<BannerItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleScroll = useCallback(() => setScrollY(window.scrollY), []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    async function fetchBanners() {
      try {
        const response = await fetch("/api/banners");
        if (!response.ok) {
          console.error("Failed to fetch banners");
          return;
        }
        const data = await response.json();
        setBannerItems(data);
      } catch (error) {
        console.error("Error fetching banners:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchBanners();
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

  if (bannerItems.length === 0) {
    return (
      <div className="w-full h-52 flex items-center justify-center">
        No banners available
      </div>
    );
  }

  return (
    <div className="relative w-full h-[40vh] overflow-hidden">
      {/* Background Images Slider */}
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
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              {bannerItems[currentIndex].title}
            </h1>

            <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
              {bannerItems[currentIndex].description}
            </p>

            <Link
              href={bannerItems[currentIndex].link}
              className="inline-block"
            ></Link>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Controls */}
      <div className="absolute z-20 inset-y-0 left-0 right-0 flex items-center justify-between px-4">
        <button
          onClick={handlePrevious}
          className="opacity-0 hover:opacity-70 transition-opacity duration-300 bg-black/20 p-3 rounded-full backdrop-blur-sm"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-6 w-6 text-white" />
        </button>
        <button
          onClick={handleNext}
          className="opacity-0 hover:opacity-70 transition-opacity duration-300 bg-black/20 p-3 rounded-full backdrop-blur-sm"
          aria-label="Next slide"
        >
          <ChevronRight className="h-6 w-6 text-white" />
        </button>
      </div>

      {/* Slider Indicators */}
      <div className="absolute bottom-20 left-0 right-0 z-20 flex justify-center space-x-2">
        {bannerItems.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex ? "bg-white w-4" : "bg-white/50"
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
