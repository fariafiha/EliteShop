"use client"

import { useState, useEffect } from "react"
import { Package, Truck, CheckCircle, Clock, Eye, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface OrderItem {
  id: number
  name: string
  price: number
  quantity: number
  image: string
}

interface Order {
  id: string
  items: OrderItem[]
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  orderDate: Date
  estimatedDelivery?: Date
  trackingNumber?: string
  shippingAddress: string
}

const statusConfig = {
  pending: { color: "bg-yellow-500", icon: Clock, text: "Pending" },
  processing: { color: "bg-blue-500", icon: Package, text: "Processing" },
  shipped: { color: "bg-purple-500", icon: Truck, text: "Shipped" },
  delivered: { color: "bg-green-500", icon: CheckCircle, text: "Delivered" },
  cancelled: { color: "bg-red-500", icon: Clock, text: "Cancelled" },
}

export default function MyOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  useEffect(() => {
    // Load orders from localStorage
    const savedOrders = localStorage.getItem("eliteShopOrders")
    if (savedOrders) {
      const parsedOrders = JSON.parse(savedOrders).map((order: any) => ({
        ...order,
        orderDate: new Date(order.orderDate),
        estimatedDelivery: order.estimatedDelivery ? new Date(order.estimatedDelivery) : undefined,
      }))
      setOrders(parsedOrders)
    }
  }, [])

  const getStatusIcon = (status: Order["status"]) => {
    const config = statusConfig[status]
    const Icon = config.icon
    return <Icon className="w-4 h-4" />
  }

  const getStatusColor = (status: Order["status"]) => {
    return statusConfig[status].color
  }

  const getStatusText = (status: Order["status"]) => {
    return statusConfig[status].text
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
        <p className="text-gray-600 mb-6">Start shopping to see your orders here</p>
        <Button>Continue Shopping</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Orders</h2>
        <Badge variant="outline">{orders.length} Orders</Badge>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                  <p className="text-sm text-gray-600">Placed on {order.orderDate.toLocaleDateString()}</p>
                </div>
                <Badge className={`${getStatusColor(order.status)} text-white`}>
                  <div className="flex items-center space-x-1">
                    {getStatusIcon(order.status)}
                    <span>{getStatusText(order.status)}</span>
                  </div>
                </Badge>
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                {/* Order Items Preview */}
                <div className="flex space-x-4 overflow-x-auto">
                  {order.items.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex-shrink-0 flex items-center space-x-3 bg-gray-50 rounded-lg p-3">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div>
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <div className="flex-shrink-0 flex items-center justify-center bg-gray-100 rounded-lg p-3 w-20">
                      <span className="text-sm text-gray-600">+{order.items.length - 3} more</span>
                    </div>
                  )}
                </div>

                {/* Order Summary */}
                <div className="flex justify-between items-center pt-3 border-t">
                  <div>
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="text-xl font-bold text-blue-600">${order.total}</p>
                  </div>
                  <div className="flex space-x-2">
                    {order.trackingNumber && (
                      <Button variant="outline" size="sm">
                        Track Order
                      </Button>
                    )}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Order Details - #{order.id}</DialogTitle>
                        </DialogHeader>
                        {selectedOrder && (
                          <div className="space-y-6">
                            {/* Order Status */}
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                              <div>
                                <h3 className="font-semibold">Order Status</h3>
                                <p className="text-sm text-gray-600">
                                  Placed on {selectedOrder.orderDate.toLocaleDateString()}
                                </p>
                              </div>
                              <Badge className={`${getStatusColor(selectedOrder.status)} text-white`}>
                                <div className="flex items-center space-x-1">
                                  {getStatusIcon(selectedOrder.status)}
                                  <span>{getStatusText(selectedOrder.status)}</span>
                                </div>
                              </Badge>
                            </div>

                            {/* Tracking Info */}
                            {selectedOrder.trackingNumber && (
                              <div className="p-4 border rounded-lg">
                                <h3 className="font-semibold mb-2">Tracking Information</h3>
                                <p className="text-sm text-gray-600">Tracking Number: {selectedOrder.trackingNumber}</p>
                                {selectedOrder.estimatedDelivery && (
                                  <p className="text-sm text-gray-600">
                                    Estimated Delivery: {selectedOrder.estimatedDelivery.toLocaleDateString()}
                                  </p>
                                )}
                              </div>
                            )}

                            {/* Order Items */}
                            <div>
                              <h3 className="font-semibold mb-4">Order Items</h3>
                              <div className="space-y-3">
                                {selectedOrder.items.map((item) => (
                                  <div key={item.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                                    <img
                                      src={item.image || "/placeholder.svg"}
                                      alt={item.name}
                                      className="w-16 h-16 object-cover rounded"
                                    />
                                    <div className="flex-1">
                                      <h4 className="font-medium">{item.name}</h4>
                                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                      <p className="text-lg font-semibold text-blue-600">${item.price}</p>
                                    </div>
                                    {selectedOrder.status === "delivered" && (
                                      <Button variant="outline" size="sm">
                                        <Star className="w-4 h-4 mr-2" />
                                        Review
                                      </Button>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Shipping Address */}
                            <div className="p-4 border rounded-lg">
                              <h3 className="font-semibold mb-2">Shipping Address</h3>
                              <p className="text-sm text-gray-600">{selectedOrder.shippingAddress}</p>
                            </div>

                            {/* Order Total */}
                            <div className="p-4 bg-blue-50 rounded-lg">
                              <div className="flex justify-between items-center">
                                <span className="font-semibold">Total Amount</span>
                                <span className="text-2xl font-bold text-blue-600">${selectedOrder.total}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
