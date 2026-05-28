"use client"

import { useState, useEffect } from "react"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import HeroCarousel from "@/components/ui/HeroCarousel"
import ProductCard from "@/components/ui/ProductCard"
import RecentlyViewed from "@/components/ui/RecentlyViewed"
import ProductComparison from "@/components/ui/ProductComparison"
import FloatingChat from "@/components/ui/FloatingChat"
import NotificationSystem from "@/components/ui/NotificationSystem"
import { Truck, Shield, Award } from 'lucide-react'
import ShoppingCart from "@/components/ui/ShoppingCart"
import CheckoutModal from "@/components/ui/CheckoutModal"

const heroSlides = [
  {
    title: "Summer Sale 2025",
    subtitle: "Up to 70% off on selected items",
    description: "Discover amazing deals on electronics, fashion, and home essentials",
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=600&fit=crop",
    cta: "Shop Now",
    color: "from-blue-600 to-purple-600",
  },
  {
    title: "New Arrivals",
    subtitle: "Latest tech gadgets just landed",
    description: "Be the first to experience cutting-edge technology",
    image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&h=600&fit=crop",
    cta: "Explore",
    color: "from-green-600 to-teal-600",
  },
  {
    title: "Fashion Forward",
    subtitle: "Trending styles for every season",
    description: "Express yourself with our curated fashion collection",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop",
    cta: "Browse Collection",
    color: "from-pink-600 to-rose-600",
  },
]

export default function ModernEcommerce() {
  const [cart, setCart] = useState([])
  const [wishlist, setWishlist] = useState([])
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [isShoppingCartOpen, setIsShoppingCartOpen] = useState(false)
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [allProducts, setAllProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Auto-slide hero carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    // Load cart from localStorage with error handling
    const loadCartData = () => {
      try {
        const savedCart = localStorage.getItem("cartItems")
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart)
          setCart(Array.isArray(parsedCart) ? parsedCart : [])
        }
      } catch (error) {
        console.error("Error loading cart:", error)
        setCart([])
        localStorage.removeItem("cartItems")
      }
    }

    // Load wishlist from localStorage
    const loadWishlistData = () => {
      try {
        const savedWishlist = localStorage.getItem("wishlist")
        if (savedWishlist) {
          const parsedWishlist = JSON.parse(savedWishlist)
          setWishlist(Array.isArray(parsedWishlist) ? parsedWishlist : [])
        }
      } catch (error) {
        console.error("Error loading wishlist:", error)
        setWishlist([])
        localStorage.removeItem("wishlist")
      }
    }

    loadCartData()
    loadWishlistData()

    // Use mock data with real images for featured products
    const mockProducts = [
      {
        id: 1,
        name: "iPhone 15 Pro Max",
        price: 1299,
        originalPrice: 1499,
        image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=300&fit=crop",
        rating: 4.8,
        reviews: 2456,
        category: "smartphones",
        description: "The most advanced iPhone ever with titanium design, A17 Pro chip, and revolutionary camera system.",
        inStock: true,
        featured: true,
        tags: ["New", "Popular"],
        brand: "Apple",
      },
      {
        id: 101,
        name: "Premium Cotton Hoodie",
        price: 89,
        originalPrice: 129,
        image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300&h=300&fit=crop",
        rating: 4.5,
        reviews: 892,
        category: "hoodies",
        description: "Ultra-soft premium cotton hoodie with modern fit and sustainable materials.",
        inStock: true,
        featured: true,
        tags: ["Sustainable", "Comfort"],
        brand: "EcoWear",
      },
      {
        id: 201,
        name: "The Psychology of Programming",
        price: 45,
        originalPrice: 55,
        image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=300&fit=crop",
        rating: 4.6,
        reviews: 324,
        category: "programming",
        description: "A comprehensive guide to understanding the mental processes involved in programming.",
        inStock: true,
        featured: true,
        tags: ["Programming", "Psychology"],
        author: "Gerald M. Weinberg",
      },
      {
        id: 301,
        name: "Elegant Evening Dress",
        price: 189,
        originalPrice: 249,
        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300&h=300&fit=crop",
        rating: 4.7,
        reviews: 456,
        category: "dresses",
        description: "Sophisticated evening dress perfect for special occasions.",
        inStock: true,
        featured: true,
        tags: ["Elegant", "Evening"],
        brand: "Elegance",
      },
      {
        id: 5,
        name: "Sony WH-1000XM5",
        price: 399,
        originalPrice: 449,
        image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&h=300&fit=crop",
        rating: 4.8,
        reviews: 892,
        category: "audio",
        description: "Industry-leading noise canceling headphones with premium sound.",
        inStock: true,
        featured: true,
        tags: ["Noise Canceling", "Premium"],
        brand: "Sony",
      },
      {
        id: 103,
        name: "Athletic Running Shoes",
        price: 129,
        originalPrice: 179,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop",
        rating: 4.7,
        reviews: 1234,
        category: "shoes",
        description: "High-performance running shoes with advanced cushioning technology.",
        inStock: true,
        featured: true,
        tags: ["Athletic", "Comfort"],
        brand: "SportMax",
      },
    ]

    setAllProducts(mockProducts)
    setFeaturedProducts(mockProducts.filter((product) => product.featured))
    setIsLoading(false)
  }, [])

  // Save cart to localStorage whenever it changes (with debounce)
  useEffect(() => {
    if (!isLoading) {
      const timeoutId = setTimeout(() => {
        try {
          localStorage.setItem("cartItems", JSON.stringify(cart))
        } catch (error) {
          console.error("Error saving cart:", error)
        }
      }, 100)

      return () => clearTimeout(timeoutId)
    }
  }, [cart, isLoading])

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        return prev.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      }
      return [...prev, { ...product, quantity: 1 }]
    })

    // Show notification
    if (window.showNotification) {
      window.showNotification({
        type: "success",
        title: "Added to Cart",
        message: `${product.name} has been added to your cart`,
      })
    }
  }

  const toggleWishlist = (productId) => {
    setWishlist((prev) => {
      const newWishlist = prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]

      localStorage.setItem("wishlist", JSON.stringify(newWishlist))
      return newWishlist
    })
  }

  const updateCartQuantity = (id, quantity) => {
    if (quantity === 0) {
      setCart((prev) => prev.filter((item) => item.id !== id))
    } else {
      setCart((prev) => prev.map((item) => (item.id === id ? { ...item, quantity } : item)))
    }
  }

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id))
  }

  const handleCheckout = () => {
    setIsShoppingCartOpen(false)
    setIsCheckoutModalOpen(true)
  }

  const handleOrderComplete = () => {
    setCart([])
    localStorage.removeItem("cartItems")
    setIsCheckoutModalOpen(false)

    // Show notification
    if (window.showNotification) {
      window.showNotification({
        type: "success",
        title: "Order Completed",
        message: "Thank you for your purchase!",
      })
    }
  }

  const handleQuickView = (product) => {
    // Add to recently viewed
    const recentProducts = JSON.parse(localStorage.getItem("recentlyViewed") || "[]")
    const existing = recentProducts.filter((p) => p.id !== product.id)
    const updated = [product, ...existing].slice(0, 10)
    localStorage.setItem("recentlyViewed", JSON.stringify(updated))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading EliteShop...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header
        cartItemsCount={cart.reduce((total, item) => total + (item.quantity || 1), 0)}
        wishlistCount={wishlist.length}
        onCartOpen={() => setIsShoppingCartOpen(true)}
        products={allProducts}
        onAddToCart={addToCart}
      />

      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Features Section */}
      <section className="py-12 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50 transition-colors">
                <Truck className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Free Shipping</h3>
              <p className="text-gray-600 dark:text-gray-400">Free delivery on orders over $50</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 dark:group-hover:bg-green-800/50 transition-colors">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Secure Payment</h3>
              <p className="text-gray-600 dark:text-gray-400">100% secure payment processing</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 dark:group-hover:bg-purple-800/50 transition-colors">
                <Award className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Quality Guarantee</h3>
              <p className="text-gray-600 dark:text-gray-400">30-day money back guarantee</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recently Viewed */}
      <section className="py-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RecentlyViewed onAddToCart={addToCart} onToggleWishlist={toggleWishlist} wishlist={wishlist} />
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">Featured Products</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Discover our handpicked selection of premium products
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
                onToggleWishlist={toggleWishlist}
                onQuickView={handleQuickView}
                isInWishlist={wishlist.includes(product.id)}
              />
            ))}
          </div>
        </div>
      </section>

      <Footer />

      {/* Floating Components */}
      <FloatingChat />
      <ProductComparison products={allProducts} />
      <NotificationSystem />

      {/* Shopping Cart */}
      <ShoppingCart
        isOpen={isShoppingCartOpen}
        onClose={() => setIsShoppingCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={updateCartQuantity}
        onRemoveItem={removeFromCart}
        onCheckout={handleCheckout}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        cartItems={cart}
        onOrderComplete={handleOrderComplete}
      />
    </div>
  )
}
