"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const heroSlides = [
  {
    title: "Summer Sale 2025",
    subtitle: "Up to 70% off on selected items",
    description: "Discover amazing deals on electronics, fashion, and home essentials",
    image: "https://www.pandoraagency.co/wp-content/uploads/2025/06/Summer-Sales-2025.jpg",
    cta: "Shop Now",
    color: "from-blue-600 to-purple-600",
  },
  {
    title: "New Arrivals",
    subtitle: "Latest tech gadgets just landed",
    description: "Be the first to experience cutting-edge technology",
    image: "https://media.istockphoto.com/id/1366262019/vector/vector-illustration-new-arrival-sticker-tag-or-banner-with-megaphone.jpg?s=612x612&w=0&k=20&c=43JBcUsV2OjmsWWNvuJd-wUT3IOgY-r-p0TY6yiPOqg=",
    cta: "Explore",
    color: "from-green-600 to-teal-600",
  },
  {
    title: "Fashion Forward",
    subtitle: "Trending styles for every season",
    description: "Express yourself with our curated fashion collection",
    image: "https://lh4.googleusercontent.com/proxy/9YwZ70Xb7avsHoLUBJkNif3Ygl1070gK48C6XTvNCLPYJVUnxtyq5NEauh3h_N5fjXcu2d87Ox3eFEBZONzhXQKaBU6VC9BckRH_SjYNJBLnM0KhOPqqHKSuGXnRrFJT2x_77BQ",
    cta: "Browse Collection",
    color: "from-pink-600 to-rose-600",
  },
]

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  }

  return (
    <section className="relative h-[500px] md:h-[600px] overflow-hidden">
      {heroSlides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-transform duration-700 ease-in-out ${
            index === currentSlide ? "translate-x-0" : index < currentSlide ? "-translate-x-full" : "translate-x-full"
          }`}
        >
          <div className={`h-full bg-gradient-to-r ${slide.color} flex items-center`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="text-white space-y-6">
                  <div className="space-y-4">
                    <h2 className="text-5xl md:text-7xl font-bold leading-tight">{slide.title}</h2>
                    <p className="text-xl md:text-2xl opacity-90 font-medium">{slide.subtitle}</p>
                    <p className="text-lg opacity-80 max-w-md">{slide.description}</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      size="lg"
                      className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
                    >
                      {slide.cta}
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 bg-transparent"
                    >
                      Learn More
                    </Button>
                  </div>
                </div>
                <div className="hidden lg:block">
                  <img
                    src={slide.image || "/placeholder.svg"}
                    alt={slide.title}
                    className="w-full h-96 object-cover rounded-2xl shadow-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Carousel Controls */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm transition-all"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm transition-all"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${index === currentSlide ? "bg-white" : "bg-white/50"}`}
          />
        ))}
      </div>
    </section>
  )
}
