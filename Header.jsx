"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ShoppingCart, Menu, Package, X, User, Heart, Search, ChevronDown, LogOut, Settings, ShoppingBag, Home, Smartphone, Shirt, BookOpen, Crown, MessageCircle, Sun, Moon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import WishlistPersistence from "@/components/ui/WishlistPersistence"
import MyOrders from "@/components/ui/MyOrders"
import MyProfile from "@/components/ui/MyProfile"
import { useTheme } from "@/contexts/ThemeContext"

export default function Header({
  cartItemsCount = 0,
  wishlistCount = 0,
  onCartOpen,
  products = [],
  onAddToCart,
}) {
  const [showMyOrders, setShowMyOrders] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const router = useRouter()

  // Listen for profile opening events
  useEffect(() => {
    const handleOpenProfile = () => {
      setShowProfile(true)
    }

    window.addEventListener("openProfile", handleOpenProfile)

    // Add scroll listener for navbar effect
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("openProfile", handleOpenProfile)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/electronics", label: "Electronics", icon: Smartphone },
    { href: "/fashion", label: "Fashion", icon: Shirt },
    { href: "/books", label: "Books", icon: BookOpen },
    { href: "/ladies", label: "Ladies", icon: Crown },
    { href: "/chat", label: "Chat", icon: MessageCircle },
  ]

  const handleAddToCart = (product) => {
    if (onAddToCart) {
      onAddToCart(product)
    }
  }

  const handleCartClick = () => {
    if (onCartOpen) {
      onCartOpen()
    } else {
      router.push("/mycart")
    }
  }

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled 
            ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg shadow-lg border-b border-gray-200 dark:border-gray-700" 
            : "bg-white dark:bg-gray-900 shadow-md"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Header */}
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 flex-shrink-0">
              <div className="relative">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
                  <span className="text-white font-bold text-lg lg:text-xl">E</span>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-900 animate-pulse"></div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  EliteShop
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1">Premium Shopping</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-all duration-200 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 relative"
                  >
                    <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span>{item.label}</span>
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></div>
                  </Link>
                )
              })}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-all duration-200 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  >
                    <span>Categories</span>
                    <ChevronDown className="ml-1 h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 shadow-xl border-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg">
                  <DropdownMenuLabel className="text-gray-900 dark:text-gray-100 font-semibold">Product Categories</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="hover:bg-blue-50 dark:hover:bg-blue-900/20">
                    <Link href="/electronics" className="flex items-center w-full">
                      <Smartphone className="mr-2 h-4 w-4 text-blue-600" />
                      Electronics
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-purple-50 dark:hover:bg-purple-900/20">
                    <Link href="/fashion" className="flex items-center w-full">
                      <Shirt className="mr-2 h-4 w-4 text-purple-600" />
                      Fashion
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-green-50 dark:hover:bg-green-900/20">
                    <Link href="/books" className="flex items-center w-full">
                      <BookOpen className="mr-2 h-4 w-4 text-green-600" />
                      Books
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-pink-50 dark:hover:bg-pink-900/20">
                    <Link href="/ladies" className="flex items-center w-full">
                      <Crown className="mr-2 h-4 w-4 text-pink-600" />
                      Ladies Collection
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-2 lg:space-x-3">
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"
              >
                {theme === 'light' ? (
                  <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                ) : (
                  <Sun className="w-5 h-5 text-yellow-500" />
                )}
              </Button>

              {/* Wishlist */}
              <div className="hidden md:block">
                <WishlistPersistence onAddToCart={handleAddToCart} allProducts={products} />
              </div>

              {/* My Orders - Desktop */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="hidden lg:flex hover:bg-green-50 dark:hover:bg-green-900/20 rounded-xl">
                    <Package className="w-5 h-5 mr-2 text-green-600" />
                    <span className="text-gray-700 dark:text-gray-300">Orders</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="shadow-xl border-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg">
                  <DropdownMenuItem onClick={() => setShowMyOrders(true)} className="hover:bg-green-50 dark:hover:bg-green-900/20">
                    <ShoppingBag className="mr-2 h-4 w-4 text-green-600" />
                    <span>View Orders</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-blue-50 dark:hover:bg-blue-900/20">
                    <Package className="mr-2 h-4 w-4 text-blue-600" />
                    <span>Track Package</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* My Profile - Desktop */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="hidden lg:flex hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-xl">
                    <User className="w-5 h-5 mr-2 text-purple-600" />
                    <span className="text-gray-700 dark:text-gray-300">Account</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="shadow-xl border-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg">
                  <DropdownMenuItem onClick={() => setShowProfile(true)} className="hover:bg-purple-50 dark:hover:bg-purple-900/20">
                    <User className="mr-2 h-4 w-4 text-purple-600" />
                    <span>My Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-pink-50 dark:hover:bg-pink-900/20">
                    <Heart className="mr-2 h-4 w-4 text-pink-600" />
                    <span>Wishlist</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <Settings className="mr-2 h-4 w-4 text-gray-600" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Shopping Cart */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleCartClick}
                className="relative hover:bg-blue-50 dark:hover:bg-blue-900/20 border-blue-200 dark:border-blue-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl transition-all duration-200 hover:scale-105"
              >
                <ShoppingCart className="w-5 h-5 text-blue-600" />
                {cartItemsCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs bg-gradient-to-r from-red-500 to-pink-500 text-white border-2 border-white dark:border-gray-900 animate-pulse">
                    {cartItemsCount > 99 ? "99+" : cartItemsCount}
                  </Badge>
                )}
              </Button>

              {/* Mobile Menu Toggle */}
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="lg:hidden hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl"
                  >
                    <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg">
                  <SheetHeader>
                    <SheetTitle className="text-left flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">E</span>
                      </div>
                      <span>EliteShop Menu</span>
                    </SheetTitle>
                    <SheetDescription className="text-left">
                      Navigate through our premium shopping experience
                    </SheetDescription>
                  </SheetHeader>
                  
                  <div className="mt-8 space-y-4">
                    {/* Mobile Navigation */}
                    <div className="space-y-2">
                      {navItems.map((item) => {
                        const Icon = item.icon
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all duration-200"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <Icon className="w-5 h-5" />
                            <span className="font-medium">{item.label}</span>
                          </Link>
                        )
                      })}
                    </div>

                    <div className="border-t dark:border-gray-700 pt-4 space-y-2">
                      <Button
                        variant="ghost"
                        className="w-full justify-start hover:bg-green-50 dark:hover:bg-green-900/20 rounded-xl"
                        onClick={() => {
                          setShowMyOrders(true)
                          setIsMobileMenuOpen(false)
                        }}
                      >
                        <Package className="w-5 h-5 mr-3 text-green-600" />
                        My Orders
                      </Button>
                      
                      <Button
                        variant="ghost"
                        className="w-full justify-start hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-xl"
                        onClick={() => {
                          setShowProfile(true)
                          setIsMobileMenuOpen(false)
                        }}
                      >
                        <User className="w-5 h-5 mr-3 text-purple-600" />
                        My Profile
                      </Button>

                      <div className="md:hidden">
                        <WishlistPersistence onAddToCart={handleAddToCart} allProducts={products} />
                      </div>

                      <Button
                        variant="ghost"
                        className="w-full justify-start hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl"
                        onClick={toggleTheme}
                      >
                        {theme === 'light' ? (
                          <>
                            <Moon className="w-5 h-5 mr-3 text-gray-600" />
                            Dark Mode
                          </>
                        ) : (
                          <>
                            <Sun className="w-5 h-5 mr-3 text-yellow-500" />
                            Light Mode
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* My Orders Modal */}
      {showMyOrders && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">My Orders</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowMyOrders(false)}>
                  <X className="w-6 h-6" />
                </Button>
              </div>
              <MyOrders />
            </div>
          </div>
        </div>
      )}

      {/* My Profile Modal */}
      {showProfile && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">My Profile</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowProfile(false)}>
                  <X className="w-6 h-6" />
                </Button>
              </div>
              <MyProfile />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
