"use client"

import { useState } from "react"
import { Star, Heart, Eye, ShoppingCart, BadgeIcon, Sparkles, ZoomIn, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Dialog, DialogContent } from "@/components/ui/dialog"

export default function ProductCard({ product, onAddToCart, onToggleWishlist, onQuickView, isInWishlist }) {
  const [isZoomed, setIsZoomed] = useState(false)

  const discountPercentage =
    product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0

  const handleImageError = (e) => {
    e.target.src = `/placeholder.svg?height=300&width=300&text=${encodeURIComponent(product.name)}`
  }

  return (
    <>
      <Card className="group relative overflow-hidden bg-white dark:bg-gray-800 border-0 shadow-lg hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-3 rounded-3xl backdrop-blur-sm">
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/50 dark:from-blue-900/20 dark:via-purple-900/10 dark:to-pink-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl" />

        {/* Sparkle Effect */}
        <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-0 group-hover:scale-100">
          <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
        </div>

        {/* Product Image Container */}
        <div className="relative overflow-hidden rounded-t-3xl">
          <div className="aspect-square relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 p-4">
            <div className="relative cursor-pointer group">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 rounded-2xl shadow-md group-hover:shadow-xl"
                onClick={() => setIsZoomed(true)}
                onError={handleImageError}
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn className="w-10 h-10 text-white bg-black/30 p-2 rounded-full" />
              </div>
            </div>

            {/* Premium Glow Effect */}
            <div className="absolute inset-4 rounded-2xl bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Action Buttons - Enhanced */}
            <div className="absolute top-6 right-6 flex flex-col space-y-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0">
              <Button
                size="sm"
                variant="secondary"
                className="w-12 h-12 rounded-full p-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md hover:bg-white dark:hover:bg-gray-700 shadow-xl border-0 hover:scale-125 transition-all duration-300 hover:rotate-12"
                onClick={(e) => {
                  e.stopPropagation()
                  onToggleWishlist(product.id)
                }}
              >
                <Heart
                  className={`w-5 h-5 transition-all duration-300 ${
                    isInWishlist
                      ? "fill-red-500 text-red-500 scale-110"
                      : "text-gray-600 dark:text-gray-400 hover:text-red-500 hover:scale-110"
                  }`}
                />
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="w-12 h-12 rounded-full p-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md hover:bg-white dark:hover:bg-gray-700 shadow-xl border-0 hover:scale-125 transition-all duration-300 hover:rotate-12"
                onClick={(e) => {
                  e.stopPropagation()
                  onQuickView(product)
                }}
              >
                <Eye className="w-5 h-5 text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-all duration-300 hover:scale-110" />
              </Button>
            </div>

            {/* Enhanced Badges */}
            <div className="absolute top-6 left-6 flex flex-col space-y-2">
              {discountPercentage > 0 && (
                <Badge className="bg-gradient-to-r from-red-500 via-pink-500 to-red-600 text-white font-bold px-4 py-2 rounded-full shadow-xl border-2 border-white/50 backdrop-blur-sm animate-pulse">
                  <span className="text-xs">🔥</span> -{discountPercentage}%
                </Badge>
              )}
              {product.tags &&
                product.tags.slice(0, 1).map((tag) => (
                  <Badge
                    key={tag}
                    className="bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 text-white font-semibold px-4 py-2 rounded-full shadow-lg border-2 border-white/30 backdrop-blur-sm"
                  >
                    <span className="text-xs">✨</span> {tag}
                  </Badge>
                ))}
            </div>

            {/* Stock Status Overlay */}
            {!product.inStock && (
              <div className="absolute inset-4 bg-black/70 backdrop-blur-md flex items-center justify-center rounded-2xl border-2 border-red-500/50">
                <div className="text-center">
                  <BadgeIcon className="w-16 h-16 text-white/90 mx-auto mb-3 animate-bounce" />
                  <span className="text-white font-bold text-xl">Out of Stock</span>
                  <p className="text-white/80 text-sm mt-1">Coming Soon</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Product Content */}
        <CardContent className="p-6 space-y-4 relative z-10">
          {/* Brand with Icon */}
          {product.brand && (
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">{product.brand[0]}</span>
              </div>
              <p className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">{product.brand}</p>
            </div>
          )}

          {/* Product Name with Gradient */}
          <h3 className="font-bold text-xl leading-tight line-clamp-2 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-500 cursor-pointer min-h-[3.5rem]">
            {product.name}
          </h3>

          {/* Enhanced Rating */}
          <div className="flex items-center space-x-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-full px-4 py-2 border border-yellow-200 dark:border-yellow-700">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 transition-all duration-200 ${
                    i < Math.floor(product.rating) ? "text-yellow-500 fill-yellow-500 drop-shadow-sm" : "text-gray-300 dark:text-gray-600"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-bold text-yellow-700 dark:text-yellow-400">{product.rating}</span>
            <span className="text-sm text-yellow-600 dark:text-yellow-500">({product.reviews.toLocaleString()})</span>
          </div>

          {/* Enhanced Price */}
          <div className="flex items-center space-x-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-4 border border-blue-200 dark:border-blue-700">
            <span className="text-3xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 bg-clip-text text-transparent">
              ${product.price}
            </span>
            {product.originalPrice > product.price && (
              <div className="flex flex-col">
                <span className="text-lg text-gray-500 dark:text-gray-400 line-through font-semibold">${product.originalPrice}</span>
                <span className="text-xs text-green-600 dark:text-green-400 font-bold">
                  Save ${(product.originalPrice - product.price).toFixed(0)}
                </span>
              </div>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 leading-relaxed min-h-[2.5rem] bg-gray-50 dark:bg-gray-700 rounded-xl p-3 border border-gray-200 dark:border-gray-600">
            {product.description}
          </p>
        </CardContent>

        {/* Enhanced Add to Cart Button */}
        <CardFooter className="p-6 pt-0 relative z-10">
          <Button
            onClick={(e) => {
              e.stopPropagation()
              onAddToCart(product)
            }}
            disabled={!product.inStock}
            className={`w-full font-bold py-4 rounded-2xl transition-all duration-500 text-lg ${
              product.inStock
                ? "bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 border-2 border-white/20"
                : "bg-gradient-to-r from-gray-400 to-gray-500 text-white cursor-not-allowed opacity-60"
            }`}
          >
            {product.inStock ? (
              <>
                <ShoppingCart className="w-6 h-6 mr-3" />
                Add to Cart
                <Sparkles className="w-5 h-5 ml-3" />
              </>
            ) : (
              <>
                <BadgeIcon className="w-6 h-6 mr-3" />
                Out of Stock
              </>
            )}
          </Button>
        </CardFooter>

        {/* Premium Hover Glow Effect */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-400/0 via-purple-400/0 to-pink-400/0 group-hover:from-blue-400/20 group-hover:via-purple-400/20 group-hover:to-pink-400/20 transition-all duration-700 pointer-events-none" />

        {/* Border Glow */}
        <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-gradient-to-r group-hover:from-blue-400/50 group-hover:via-purple-400/50 group-hover:to-pink-400/50 transition-all duration-700 pointer-events-none" />
      </Card>

      {/* Image Zoom Dialog */}
      <Dialog open={isZoomed} onOpenChange={setIsZoomed}>
        <DialogContent className="max-w-4xl p-0 bg-transparent border-none shadow-none">
          <div className="relative">
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
              onError={handleImageError}
            />
            <Button
              className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 rounded-full p-2 w-10 h-10"
              onClick={() => setIsZoomed(false)}
            >
              <X className="w-6 h-6" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
