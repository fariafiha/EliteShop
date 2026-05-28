"use client"

import { useState, useEffect } from "react"
import { CreditCard, MapPin, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface CartItem {
  id: number
  name: string
  price: number
  image: string
  quantity: number
  brand?: string
}

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
  cartItems: CartItem[]
  onOrderComplete: () => void
}

const USD_TO_BDT_RATE = 110
const DELIVERY_CHARGE_PERCENT = 15.25

export default function CheckoutModal({ isOpen, onClose, cartItems, onOrderComplete }: CheckoutModalProps) {
  const [eliteCredit, setEliteCredit] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [shippingInfo, setShippingInfo] = useState({
    name: " Faria Islam",
    phone: "+880 1234567890",
    address: "123 Main St, Dhaka, Bangladesh",
    city: "Dhaka",
    postalCode: "1000",
  })

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

    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
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

    // Polling for real-time updates
    const interval = setInterval(updateCreditBalance, 1000)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("creditUpdated", handleCreditUpdate)
      clearInterval(interval)
    }
  }, [])

  const subtotalUSD = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  const deliveryChargeUSD = (subtotalUSD * DELIVERY_CHARGE_PERCENT) / 100
  const totalUSD = subtotalUSD + deliveryChargeUSD
  const totalBDT = totalUSD * USD_TO_BDT_RATE

  const handlePlaceOrder = async () => {
    setIsProcessing(true)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Deduct from Elite Credit with real-time update
    const newBalance = eliteCredit - totalBDT
    setEliteCredit(newBalance)
    localStorage.setItem("eliteCredit", newBalance.toString())

    // Dispatch real-time update event
    const event = new CustomEvent("creditUpdated", {
      detail: { newBalance },
    })
    window.dispatchEvent(event)

    // Create order
    const newOrder = {
      id: `ORD-${Date.now()}`,
      items: cartItems,
      total: totalUSD,
      totalBDT: totalBDT,
      status: "processing",
      orderDate: new Date(),
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      trackingNumber: `TRK${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      shippingAddress: `${shippingInfo.name}, ${shippingInfo.address}, ${shippingInfo.city} - ${shippingInfo.postalCode}`,
      paymentMethod: "Elite Credit",
    }

    // Save order
    const orders = JSON.parse(localStorage.getItem("eliteShopOrders") || "[]")
    orders.push(newOrder)
    localStorage.setItem("eliteShopOrders", JSON.stringify(orders))

    // Add transaction record
    const transactions = JSON.parse(localStorage.getItem("eliteTransactions") || "[]")
    const newTransaction = {
      id: `TXN-${Date.now()}`,
      type: "debit",
      amount: totalBDT,
      description: `Order Payment - ${newOrder.id}`,
      date: new Date(),
      orderId: newOrder.id,
    }
    transactions.unshift(newTransaction)
    localStorage.setItem("eliteTransactions", JSON.stringify(transactions))

    setIsProcessing(false)
    setOrderComplete(true)

    // Show notification
    if ((window as any).showNotification) {
      ;(window as any).showNotification({
        type: "success",
        title: "🎉 Order Placed Successfully!",
        message: `Order ${newOrder.id} confirmed. New balance: ৳${newBalance.toFixed(2)}`,
      })
    }

    setTimeout(() => {
      onOrderComplete()
      onClose()
      setOrderComplete(false)
    }, 3000)
  }

  if (!isOpen) return null

  if (orderComplete) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Order Confirmed!</h2>
            <p className="text-gray-600 mb-4">Thank you for your purchase. Your order is being processed.</p>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-800">You'll receive a confirmation email shortly.</p>
              <p className="text-xs text-green-600 mt-1">Your Elite Credit has been updated in real-time.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Shipping Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Shipping Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={shippingInfo.name}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={shippingInfo.phone}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={shippingInfo.address}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={shippingInfo.city}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="postal">Postal Code</Label>
                <Input
                  id="postal"
                  value={shippingInfo.postalCode}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, postalCode: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
            <div className="space-y-3">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Summary */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>
                ${subtotalUSD.toFixed(2)} (৳{(subtotalUSD * USD_TO_BDT_RATE).toFixed(2)})
              </span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Charge ({DELIVERY_CHARGE_PERCENT}%):</span>
              <span>
                ${deliveryChargeUSD.toFixed(2)} (৳{(deliveryChargeUSD * USD_TO_BDT_RATE).toFixed(2)})
              </span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total:</span>
              <span className="text-blue-600">৳{totalBDT.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Method - Real-time Balance */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              Payment Method
            </h3>
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border-2 border-purple-200">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">Elite Credit</p>
                  <p className="text-sm text-gray-600">
                    Current Balance:{" "}
                    <span className="font-bold text-purple-600 animate-pulse">৳{eliteCredit.toFixed(2)}</span>
                  </p>
                  <p className="text-xs text-green-600 mt-1">🔄 Real-time balance</p>
                </div>
                <CreditCard className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button
              onClick={handlePlaceOrder}
              disabled={isProcessing || eliteCredit < totalBDT}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isProcessing ? "Processing..." : `Place Order - ৳${totalBDT.toFixed(2)}`}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
