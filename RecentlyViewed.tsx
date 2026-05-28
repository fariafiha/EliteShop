"use client"

import { useState, useEffect } from "react"
import { Eye, Heart, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface Product {
  id: number
  name: string
  price: number
  image: string
  category: string
  brand?: string
  description?: string
  rating?: number
  reviews?: number
  inStock?: boolean
  originalPrice?: number
  tags?: string[]
}

interface RecentlyViewedProps {
  onAddToCart: (product: Product) => void
  onToggleWishlist: (productId: number) => void
  wishlist: number[]
}

export default function RecentlyViewed({ onAddToCart, onToggleWishlist, wishlist }: RecentlyViewedProps) {
  const [recentProducts, setRecentProducts] = useState<Product[]>([])

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedProducts = localStorage.getItem("recentlyViewed")
      if (savedProducts) {
        setRecentProducts(JSON.parse(savedProducts))
      }
    }
  }, [])

  const clearRecentlyViewed = () => {
    setRecentProducts([])
    if (typeof window !== "undefined") {
      localStorage.removeItem("recentlyViewed")
    }
  }

  if (recentProducts.length === 0) {
    return null
  }

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold flex items-center">
          <Eye className="w-6 h-6 mr-2 text-blue-600" />
          Recently Viewed
        </h2>
        <Button variant="outline" size="sm" onClick={clearRecentlyViewed}>
          Clear All
        </Button>
      </div>

      <div className="flex space-x-4 overflow-x-auto pb-4">
        {recentProducts.map((product) => (
          <Card key={product.id} className="flex-shrink-0 w-64 hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <img
                src={product.image || "/placeholder.svg?height=160&width=240"}
                alt={product.name}
                className="w-full h-40 object-cover rounded-lg mb-3"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = `/placeholder.svg?height=160&width=240&text=${encodeURIComponent(product.name)}`
                }}
              />
              <h3 className="font-semibold text-sm mb-2 line-clamp-2">{product.name}</h3>
              <p className="text-lg font-bold text-blue-600 mb-3">${product.price}</p>
              <div className="flex space-x-2">
                <Button size="sm" onClick={() => onAddToCart(product)} className="flex-1 bg-blue-600 hover:bg-blue-700">
                  <ShoppingCart className="w-4 h-4 mr-1" />
                  Add
                </Button>
                <Button size="sm" variant="outline" onClick={() => onToggleWishlist(product.id)}>
                  <Heart className={`w-4 h-4 ${wishlist.includes(product.id) ? "fill-red-500 text-red-500" : ""}`} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
