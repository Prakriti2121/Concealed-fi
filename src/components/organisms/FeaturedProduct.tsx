"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Swiper, SwiperSlide } from "swiper/react"
import { EffectCoverflow, Autoplay, Navigation } from "swiper/modules"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { motion } from "motion/react"

// Import Swiper styles
import "swiper/css"
import "swiper/css/effect-coverflow"
import "swiper/css/navigation"
import Image from "next/image"

// Define the Product type based on your Prisma schema
interface Product {
  id: number
  title: string
  price: number
  largeImage: string
}

const FeaturedProduct = () => {
  const [isHovered, setIsHovered] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/featured-products")

        if (!response.ok) {
          throw new Error("Failed to fetch products")
        }

        const data = await response.json()
        setProducts(data)
      } catch (err) {
        console.error("Error fetching products:", err)
        setError("Failed to load products")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Show loading state
  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <div className="text-5xl font-black mb-8">Ambitious Wine Importer</div>
        <div className="text-xl">Loading wines...</div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <div className="text-5xl font-black mb-8">Ambitious Wine Importer</div>
        <div className="text-xl text-red-500">{error}</div>
      </div>
    )
  }

  // Show empty state if no products at all
  if (products.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <div className="text-5xl font-black mb-8">Ambitious Wine Importer</div>
        <div className="text-xl">No wines available at the moment.</div>
      </div>
    )
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
          Ambitious Wine Importer
        </motion.div>

        <div className="flex justify-center text-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.5 }}
              transition={{ duration: 0.5 }}
              className="text-2xl border-b border-black inline-block text-center mt-6"
            >
              Quality Is More Important Than Quantity
            </motion.div>
          </div>
        </div>
      </div>
      <div className="relative py-12" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
        <Swiper
          effect="coverflow"
          grabCursor={true}
          centeredSlides={true}
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
                      <div className="flex justify-center">
                        <Image
                          src={product.largeImage || "/placeholder.svg?height=400&width=300"}
                          alt={product.title}
                          className={`w-auto h-96 object-contain transition-transform duration-500 ${
                            isActive ? "group-hover:scale-105" : ""
                          }`}
                          width={300}
                          height={400}
                        />
                      </div>
                    </div>
                  </div>
                  <div
                    className={`mt-4 transform transition-all duration-500 ${
                      isActive ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
                    } text-center w-full`}
                  >
                    <h3 className="text-2xl font-light">{product.title}</h3>
                    <p className="text-lg mt-2">${product.price.toFixed(2)}</p>
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

      <div className="flex justify-center mt-8">
        <Link
          href="/viinit-luettelo"
          className="text-xl text-center inline-block bg-black text-white px-6 py-2 rounded-3xl hover:bg-white hover:text-black hover:border border-black hover:scale-90 transition-all duration-300 ease-in-out"
        >
          View All Wines
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
  )
}

export default FeaturedProduct
