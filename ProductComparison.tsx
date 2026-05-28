"use client"

import { useState, useEffect } from "react"
import { X, Plus, Star, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface Product {
  id: number
  name: string
  price: number
  originalPrice: number
  image: string
  rating: number
  brand?: string
  specs?: string[]
  category: string
  description?: string
  inStock?: boolean
  tags?: string[]
}

interface ProductComparisonProps {
  products: Product[]
}

export default function ProductComparison({ products }: ProductComparisonProps) {
  const [compareList, setCompareList] = useState<Product[]>([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("compareList")
      if (saved) {
        setCompareList(JSON.parse(saved))
      }
    }
  }, [])

  const removeFromCompare = (productId: number) => {
    const updated = compareList.filter((p) => p.id !== productId)
    setCompareList(updated)
    if (typeof window !== "undefined") {
      localStorage.setItem("compareList", JSON.stringify(updated))
    }
  }

  const clearCompareList = () => {
    setCompareList([])
    if (typeof window !== "undefined") {
      localStorage.removeItem("compareList")
    }
  }

  if (compareList.length === 0) {
    return null
  }

  return (
    <div className="fixed bottom-24 right-6 z-40">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="bg-green-600 hover:bg-green-700 shadow-lg">Compare ({compareList.length})</Button>
        </DialogTrigger>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              Product Comparison
              <Button variant="outline" size="sm" onClick={clearCompareList}>
                Clear All
              </Button>
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {compareList.map((product) => (
              <Card key={product.id} className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 z-10"
                  onClick={() => removeFromCompare(product.id)}
                >
                  <X className="w-4 h-4" />
                </Button>

                <CardHeader className="pb-3">
                  <img
                    src={product.image || "/placeholder.svg?height=160&width=160"}
                    alt={product.name}
                    className="w-full h-40 object-cover rounded-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = `/placeholder.svg?height=160&width=160&text=${encodeURIComponent(product.name)}`
                    }}
                  />
                </CardHeader>

                <CardContent className="space-y-3">
                  <h3 className="font-semibold text-sm line-clamp-2">{product.name}</h3>

                  {product.brand && <p className="text-xs text-gray-600">{product.brand}</p>}

                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-blue-600">${product.price}</span>
                    {product.originalPrice > product.price && (
                      <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                    )}
                  </div>

                  <div className="flex items-center">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-600 ml-1">({product.rating})</span>
                  </div>

                  {product.specs && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold">Key Features:</h4>
                      <ul className="space-y-1">
                        {product.specs.slice(0, 4).map((spec, index) => (
                          <li key={index} className="text-xs text-gray-600 flex items-start">
                            <Check className="w-3 h-3 text-green-500 mr-1 mt-0.5 flex-shrink-0" />
                            {spec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            {/* Add more products slot */}
            {compareList.length < 4 && (
              <Card className="border-2 border-dashed border-gray-300 flex items-center justify-center min-h-[400px]">
                <div className="text-center text-gray-500">
                  <Plus className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm">Add more products to compare</p>
                </div>
              </Card>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
