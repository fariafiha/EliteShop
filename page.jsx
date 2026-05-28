"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import ShoppingCart from "@/components/ui/ShoppingCart"
import CheckoutModal from "@/components/ui/CheckoutModal"
import NotificationSystem from "@/components/ui/NotificationSystem"
import FloatingChat from "@/components/ui/FloatingChat"
import { ShoppingCartIcon as CartIcon, ArrowLeft, Package, ShoppingBag } from 'lucide-react'
import { Button } from "@/components/ui/button"

export default function MyCartPage() {
  const [cart, setCart] = useState([])
  const [wishlist, setWishlist] = useState([])
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false)
  const [allProducts, setAllProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

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
        localStorage.removeItem("cartItems") // Clear corrupted data
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
        localStorage.removeItem("wishlist") // Clear corrupted data
      }
    }

    loadCartData()
    loadWishlistData()

    // Mock products for search functionality
    const mockProducts = [
      {
        id: 1,
        name: "iPhone 15 Pro Max",
        price: 1299,
        image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=300&fit=crop",
        category: "smartphones",
        brand: "Apple",
      },
      {
        id: 101,
        name: "Premium Cotton Hoodie",
        price: 89,
        image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300&h=300&fit=crop",
        category: "hoodies",
        brand: "EcoWear",
      },
    ]
    setAllProducts(mockProducts)
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

  const updateCartQuantity = (id, quantity) => {
    if (quantity === 0) {
      setCart((prev) => prev.filter((item) => item.id !== id))
    } else {
      setCart((prev) => prev.map((item) => (item.id === id ? { ...item, quantity } : item)))
    }
  }

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id))
    
    // Show notification
    if (window.showNotification) {
      window.showNotification({
        type: "info",
        title: "Item Removed",
        message: "Item has been removed from your cart",
      })
    }
  }

  const handleCheckout = () => {
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
        message: "Thank you for your purchase! Your cart has been cleared.",
      })
    }

    // Redirect to home page after successful order
    setTimeout(() => {
      router.push("/")
    }, 2000)
  }

  const clearCart = () => {
    setCart([])
    localStorage.removeItem("cartItems")
    
    // Show notification
    if (window.showNotification) {
      window.showNotification({
        type: "info",
        title: "Cart Cleared",
        message: "All items have been removed from your cart",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your cart...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header
        cartItemsCount={cart.reduce((total, item) => total + (item.quantity || 1), 0)}
        wishlistCount={wishlist.length}
        onCartOpen={() => {}} // No need for cart modal on cart page
        products={allProducts}
        onAddToCart={addToCart}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="flex items-center space-x-2 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </Button>
              <div>
                <h1 className="text-4xl font-bold flex items-center text-gray-900 dark:text-gray-100">
                  <CartIcon className="w-8 h-8 mr-3 text-blue-600" />
                  My Cart
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 mt-2">
                  {cart.length > 0 
                    ? `${cart.length} item${cart.length > 1 ? 's' : ''} in your cart`
                    : "Your cart is empty"
                  }
                </p>
              </div>
            </div>
            
            {cart.length > 0 && (
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={clearCart}
                  className="text-red-500 border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600"
                >
                  Clear All
                </Button>
                <Button
                  onClick={handleCheckout}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6"
                >
                  <Package className="w-4 h-4 mr-2" />
                  Checkout
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Cart Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          <ShoppingCart
            isOpen={true}
            onClose={() => {}} // No close button needed on dedicated page
            cartItems={cart}
            onUpdateQuantity={updateCartQuantity}
            onRemoveItem={removeFromCart}
            onCheckout={handleCheckout}
            isFullPage={true} // Add this prop to modify styling for full page
          />
        </div>

        {/* Empty Cart State */}
        {cart.length === 0 && (
          <div className="text-center py-16">
            <ShoppingBag className="w-24 h-24 text-gray-300 dark:text-gray-600 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Your cart is empty</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
            </p>
            <Button
              onClick={() => router.push("/")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3"
            >
              Continue Shopping
            </Button>
          </div>
        )}
      </div>

      <Footer />

      {/* Floating Components */}
      <FloatingChat />
      <NotificationSystem />

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
