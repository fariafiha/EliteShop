"use client"

import { useState, useEffect, useRef } from "react"
import { Search, Clock, TrendingUp, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function SearchWithAutocomplete({ products, onSearch, onProductSelect }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [suggestions, setSuggestions] = useState([])
  const [recentSearches, setRecentSearches] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const searchRef = useRef(null)

  useEffect(() => {
    const saved = localStorage.getItem("recentSearches")
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    if (searchTerm.length > 1) {
      const filtered = products
        .filter(
          (product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (product.brand && product.brand.toLowerCase().includes(searchTerm.toLowerCase())),
        )
        .slice(0, 5)
      setSuggestions(filtered)
      setIsOpen(true)
    } else {
      setSuggestions([])
      setIsOpen(searchTerm.length > 0)
    }
  }, [searchTerm, products])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSearch = (term) => {
    if (term.trim()) {
      const updated = [term, ...recentSearches.filter((s) => s !== term)].slice(0, 5)
      setRecentSearches(updated)
      localStorage.setItem("recentSearches", JSON.stringify(updated))
      onSearch(term)
      setIsOpen(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch(searchTerm)
    }
  }

  const handleProductClick = (product) => {
    onProductSelect(product)
    setSearchTerm("")
    setIsOpen(false)
  }

  const handleRecentSearchClick = (term) => {
    setSearchTerm(term)
    handleSearch(term)
  }

  const clearSearch = () => {
    setSearchTerm("")
    setSuggestions([])
    setIsOpen(false)
  }

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          type="text"
          placeholder="Search for products, brands, and more..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
          onFocus={() => setIsOpen(true)}
          className="pl-12 pr-10 py-3 w-full rounded-full border-2 border-gray-200 focus:border-blue-500 transition-colors"
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 rounded-full"
            onClick={clearSearch}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {isOpen && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 shadow-lg">
          <CardContent className="p-0">
            {/* Product Suggestions */}
            {suggestions.length > 0 && (
              <div className="p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Products
                </h3>
                <div className="space-y-2">
                  {suggestions.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => handleProductClick(product)}
                      className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                    >
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-10 h-10 object-cover rounded"
                        onError={(e) => {
                          e.target.src = `/placeholder.svg?height=40&width=40&text=${encodeURIComponent(product.name)}`
                        }}
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{product.name}</p>
                        <p className="text-xs text-gray-600">{product.category || "Product"}</p>
                      </div>
                      <span className="text-sm font-semibold text-blue-600">${product.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {searchTerm.length > 1 && suggestions.length === 0 && (
              <div className="p-4 text-center">
                <p className="text-gray-500">No products found for "{searchTerm}"</p>
                <Button variant="link" className="mt-2" onClick={() => handleSearch(searchTerm)}>
                  Search anyway
                </Button>
              </div>
            )}

            {/* Recent Searches */}
            {recentSearches.length > 0 && searchTerm.length <= 1 && (
              <div className="p-4 border-t">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Recent Searches
                </h3>
                <div className="space-y-1">
                  {recentSearches.map((term, index) => (
                    <div
                      key={index}
                      onClick={() => handleRecentSearchClick(term)}
                      className="text-sm text-gray-600 hover:text-blue-600 cursor-pointer p-2 hover:bg-gray-50 rounded flex justify-between items-center"
                    >
                      <span>{term}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 rounded-full opacity-50 hover:opacity-100"
                        onClick={(e) => {
                          e.stopPropagation()
                          const updated = recentSearches.filter((s) => s !== term)
                          setRecentSearches(updated)
                          localStorage.setItem("recentSearches", JSON.stringify(updated))
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
