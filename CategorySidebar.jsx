"use client"

import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function CategorySidebar({
  categories,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  productCount,
}) {
  const allCategories = [{ id: "all", name: "All Products", icon: "🛍️" }, ...(categories || [])]

  return (
    <aside className="lg:w-80">
      <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
        <h3 className="text-xl font-bold mb-6">Filters</h3>

        <div className="space-y-6">
          {/* Categories */}
          <div>
            <h4 className="font-semibold mb-4 text-gray-900">Categories</h4>
            <div className="space-y-3">
              {allCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => onCategoryChange(category.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 ${
                    selectedCategory === category.id
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{category.icon}</span>
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <Badge variant={selectedCategory === category.id ? "secondary" : "outline"}>
                      {category.id === "all" ? productCount : ""}
                    </Badge>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Sort Options */}
          <div>
            <h4 className="font-semibold mb-4 text-gray-900">Sort By</h4>
            <Select value={sortBy} onValueChange={onSortChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sort products" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </aside>
  )
}
