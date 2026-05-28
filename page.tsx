"use client"

import { useState, useEffect } from "react"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import ProductCard from "@/components/ui/ProductCard"
import CategorySidebar from "@/components/ui/CategorySidebar"

interface Product {
  id: number
  name: string
  price: number
  originalPrice: number
  image: string
  rating: number
  reviews: number
  category: string
  description: string
  inStock: boolean
  featured: boolean
  tags: string[]
  brand?: string
  sizes?: string[]
  colors?: string[]
}

interface Category {
  id: string
  name: string
  icon: string
}

export default function LadiesPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("featured")
  const [searchTerm, setSearchTerm] = useState("")
  const [cart, setCart] = useState<Product[]>([])
  const [wishlist, setWishlist] = useState<number[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/data/ladies-products.json")
        const data = await response.json()
        setProducts(data.products)
        setCategories(data.categories)
      } catch (error) {
        console.error("Error fetching ladies products data:", error)
      }
    }

    fetchData()
  }, [])

  const sortProducts = (products: Product[]) => {
    switch (sortBy) {
      case "price-low":
        return [...products].sort((a, b) => a.price - b.price)
      case "price-high":
        return [...products].sort((a, b) => b.price - a.price)
      case "rating":
        return [...products].sort((a, b) => b.rating - a.rating)
      case "newest":
        return [...products].sort((a, b) => b.id - a.id)
      default:
        return [...products].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    }
  }

  const filteredProducts = sortProducts(
    products.filter((product) => {
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesCategory && matchesSearch
    }),
  )

  const addToCart = (product: Product) => {
    setCart((prev) => [...prev, product])
  }

  const toggleWishlist = (productId: number) => {
    setWishlist((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]))
  }

  const handleQuickView = (product: Product) => {
    console.log("Quick view:", product)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        cartItemsCount={cart.length}
        wishlistCount={wishlist.length}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Ladies Collection</h1>
          <p className="text-xl text-gray-600">Elegant and stylish products designed for the modern woman</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <CategorySidebar
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            sortBy={sortBy}
            onSortChange={setSortBy}
            productCount={products.length}
          />

          <main className="flex-1">
            <div className="mb-6">
              <p className="text-gray-600">{filteredProducts.length} products found</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
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

            {filteredProducts.length === 0 && (
              <div className="text-center py-16">
                <h3 className="text-xl font-semibold mb-2">No products found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  )
}
