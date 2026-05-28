"use client"

import { useState, useEffect } from "react"
import { Heart, X, ShoppingCart, Trash2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export default function WishlistPersistence({ onAddToCart, allProducts = [] }) {
  const [wishlist, setWishlist] = useState([])
  const [wishlistProducts, setWishlistProducts] = useState([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Load wishlist from localStorage
    const savedWishlist = localStorage.getItem("wishlist")
    if (savedWishlist) {
      try {
        const wishlistIds = JSON.parse(savedWishlist)
        setWishlist(wishlistIds)
        
        // Filter products that are in wishlist
        const wishlistItems = allProducts.filter(product => wishlistIds.includes(product.id))
        setWishlistProducts(wishlistItems)
      } catch (error) {
        console.error("Error loading wishlist:", error)
        setWishlist([])
        setWishlistProducts([])
      }
    }
  }, [allProducts])

  const removeFromWishlist = (productId) => {
    const newWishlist = wishlist.filter(id => id !== productId)
    setWishlist(newWishlist)
    localStorage.setItem("wishlist", JSON.stringify(newWishlist))
    
    // Update wishlist products
    const updatedProducts = wishlistProducts.filter(product => product.id !== productId)
    setWishlistProducts(updatedProducts)

    // Show notification
    if (window.showNotification) {
      window.showNotification({
        type: "info",
        title: "Removed from Wishlist",
        message: "Item has been removed from your wishlist",
      })
    }
  }

  const handleAddToCart = (product) => {
    if (onAddToCart) {
      onAddToCart(product)
    }
  }

  const clearWishlist = () => {
    setWishlist([])
    setWishlistProducts([])
    localStorage.removeItem("wishlist")

    // Show notification
    if (window.showNotification) {
      window.showNotification({
        type: "info",
        title: "Wishlist Cleared",
        message: "All items have been removed from your wishlist",
      })
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="relative hover:bg-pink-50 rounded-xl">
          <Heart className="w-5 h-5 text-pink-600" />
          {wishlist.length > 0 && (
            <Badge className="absolute -top-2 -right-2 w-5 h-5 rounded-full p-0 flex items-center justify-center text-xs bg-pink-500">
              {wishlist.length}
            </Badge>
          )}
          <span className="hidden lg:inline ml-2 text-gray-700">Wishlist</span>
        </Button>
      </SheetTrigger>
      
      <SheetContent side="right" className="w-full sm:w-96 bg-white/95 backdrop-blur-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center space-x-2">
            <Heart className="w-6 h-6 text-pink-600" />
            <span>My Wishlist ({wishlist.length})</span>
          </SheetTitle>
          <SheetDescription>
            Your saved items for later purchase
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6">
          {wishlistProducts.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Your wishlist is empty</h3>
              <p className="text-gray-600 mb-6">Save items you love for later</p>
              <Button onClick={() => setIsOpen(false)} className="bg-pink-600 hover:bg-pink-700">
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Clear All Button */}
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">{wishlistProducts.length} items saved</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearWishlist}
                  className="text-red-500 border-red-200 hover:bg-red-50"
                >
                  Clear All
                </Button>
              </div>

              {/* Wishlist Items */}
              <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
                {wishlistProducts.map((product) => (
                  <Card key={product.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                          onError={(e) => {
                            e.target.src = `/placeholder.svg?height=64&width=64&text=${encodeURIComponent(product.name)}`
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm truncate">{product.name}</h4>
                          {product.brand && (
                            <p className="text-xs text-gray-600">{product.brand}</p>
                          )}
                          <p className="text-lg font-bold text-pink-600">${product.price}</p>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <Button
                            size="sm"
                            onClick={() => handleAddToCart(product)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1"
                          >
                            <ShoppingCart className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromWishlist(product.id)}
                            className="hover:bg-red-50 text-red-500 px-3 py-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Add All to Cart */}
              <Button
                onClick={() => {
                  wishlistProducts.forEach(product => handleAddToCart(product))
                  setIsOpen(false)
                }}
                className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add All to Cart
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
