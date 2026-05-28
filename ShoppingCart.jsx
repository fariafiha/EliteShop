"use client"

import { useState, useEffect } from "react"
import { ShoppingCartIcon, Plus, Minus, Trash2, X, CreditCard, ShoppingBag, Package } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const USD_TO_BDT_RATE = 110 // 1 USD = 110 BDT
const DELIVERY_CHARGE_PERCENT = 15.25

export default function EliteShoppingCart({ 
  isOpen, 
  onClose, 
  cartItems, 
  onUpdateQuantity, 
  onRemoveItem, 
  onCheckout,
  isFullPage = false 
}) {
  const [eliteCredit, setEliteCredit] = useState(0)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)

  // Real-time credit balance update
  useEffect(() => {
    const updateCreditBalance = () => {
      const savedCredit = localStorage.getItem("eliteCredit")
      if (savedCredit) {
        setEliteCredit(Number.parseFloat(savedCredit))
      }
    }

    // Initial load
    updateCreditBalance()

    // Listen for storage changes (when credit is updated from other components)
    const handleStorageChange = (e) => {
      if (e.key === "eliteCredit") {
        updateCreditBalance()
      }
    }

    // Listen for custom credit update events
    const handleCreditUpdate = () => {
      updateCreditBalance()
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("creditUpdated", handleCreditUpdate)

    // Polling for real-time updates (fallback)
    const interval = setInterval(updateCreditBalance, 1000)

    // Save cart to localStorage
    localStorage.setItem("cartItems", JSON.stringify(cartItems))

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("creditUpdated", handleCreditUpdate)
      clearInterval(interval)
    }
  }, [cartItems])

  const subtotalUSD = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  const deliveryChargeUSD = (subtotalUSD * DELIVERY_CHARGE_PERCENT) / 100
  const totalUSD = subtotalUSD + deliveryChargeUSD

  const subtotalBDT = subtotalUSD * USD_TO_BDT_RATE
  const deliveryChargeBDT = deliveryChargeUSD * USD_TO_BDT_RATE
  const totalBDT = totalUSD * USD_TO_BDT_RATE

  const canAfford = eliteCredit >= totalBDT

  const handleRemoveItem = (item) => {
    setItemToDelete(item)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (itemToDelete) {
      onRemoveItem(itemToDelete.id)

      // Show notification
      if (window.showNotification) {
        window.showNotification({
          type: "info",
          title: "Item Removed",
          message: `${itemToDelete.name} has been removed from your cart`,
        })
      }
    }
    setIsDeleteDialogOpen(false)
    setItemToDelete(null)
  }

  const clearCart = () => {
    cartItems.forEach((item) => onRemoveItem(item.id))
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

  if (!isOpen && !isFullPage) return null

  const CartContent = () => (
    <>
      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingCartIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Your cart is empty</h3>
          <p className="text-gray-600 mb-6">Add some products to get started</p>
          {!isFullPage && (
            <Button onClick={onClose}>Continue Shopping</Button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Cart Items */}
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center space-x-4 p-4 border rounded-xl hover:bg-gray-50 transition-colors"
              >
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-lg shadow-sm"
                  onError={(e) => {
                    e.target.src = `/placeholder.svg?height=64&width=64&text=${encodeURIComponent(item.name)}`
                  }}
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{item.name}</h4>
                  {item.brand && <p className="text-sm text-gray-600">{item.brand}</p>}
                  <p className="text-lg font-bold text-blue-600">${item.price}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="rounded-lg"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-8 text-center font-semibold">{item.quantity}</span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    className="rounded-lg"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveItem(item)}
                  className="hover:bg-red-50 hover:text-red-500 rounded-lg"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            ))}
          </div>

          {/* Price Breakdown */}
          <div className="border-t pt-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span>Subtotal (USD):</span>
              <span>${subtotalUSD.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Delivery Charge ({DELIVERY_CHARGE_PERCENT}%):</span>
              <span>${deliveryChargeUSD.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm border-t pt-2">
              <span>Total (USD):</span>
              <span className="font-semibold">${totalUSD.toFixed(2)}</span>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl border border-blue-200">
              <div className="flex justify-between text-sm">
                <span>Subtotal (BDT):</span>
                <span>৳{subtotalBDT.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Delivery Charge (BDT):</span>
                <span>৳{deliveryChargeBDT.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                <span>Total (BDT):</span>
                <span className="text-blue-600">৳{totalBDT.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Elite Credit Balance - Real-time Update */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-xl border-2 border-purple-200">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-semibold flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-purple-600" />
                  Elite Credit Balance
                  <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Live</span>
                </h4>
                <p className="text-3xl font-bold text-purple-600 animate-pulse">৳{eliteCredit.toFixed(2)}</p>
              </div>
              <Badge variant={canAfford ? "default" : "destructive"} className="text-sm px-3 py-1">
                {canAfford ? "✅ Sufficient Balance" : "❌ Insufficient Balance"}
              </Badge>
            </div>
            {!canAfford && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700 font-medium">
                  ⚠️ You need ৳{(totalBDT - eliteCredit).toFixed(2)} more to complete this order
                </p>
                <p className="text-xs text-red-600 mt-1">Please recharge your Elite Credit from My Profile</p>
              </div>
            )}
            {canAfford && (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-700 font-medium">
                  ✅ You have sufficient balance to complete this order
                </p>
                <p className="text-xs text-green-600 mt-1">
                  Remaining balance after order: ৳{(eliteCredit - totalBDT).toFixed(2)}
                </p>
              </div>
            )}
          </div>

          {/* Checkout Button */}
          <Button
            onClick={onCheckout}
            disabled={!canAfford || cartItems.length === 0}
            className={`w-full font-semibold py-3 transition-all duration-300 rounded-xl ${
              canAfford
                ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {canAfford ? (
              <div className="flex items-center">
                <ShoppingBag className="w-5 h-5 mr-2" />
                Checkout - ৳{totalBDT.toFixed(2)}
              </div>
            ) : (
              <div className="flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Insufficient Elite Credit
              </div>
            )}
          </Button>

          {!canAfford && (
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Need to recharge your Elite Credit?</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // Trigger profile modal opening
                  const event = new CustomEvent("openProfile")
                  window.dispatchEvent(event)
                  if (onClose) onClose()
                }}
                className="text-purple-600 border-purple-600 hover:bg-purple-50 rounded-xl"
              >
                💳 Recharge Now
              </Button>
            </div>
          )}
        </div>
      )}
    </>
  )

  if (isFullPage) {
    return (
      <div className="w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              <ShoppingCartIcon className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold">Shopping Cart ({cartItems.length})</h2>
            </div>
            {cartItems.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearCart}
                className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 bg-transparent rounded-xl"
              >
                Clear All
              </Button>
            )}
          </div>
          <CartContent />
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center">
              <ShoppingCartIcon className="w-6 h-6 mr-2" />
              Shopping Cart ({cartItems.length})
            </CardTitle>
            <div className="flex space-x-2">
              {cartItems.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearCart}
                  className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 bg-transparent rounded-xl"
                >
                  Clear All
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={onClose} className="rounded-xl">
                <X className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <CartContent />
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {itemToDelete?.name} from your cart?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600">
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
