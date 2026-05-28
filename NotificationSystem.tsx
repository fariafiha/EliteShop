"use client"

import { useState, useEffect } from "react"
import { X, CheckCircle, AlertCircle, Info } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Notification {
  id: string
  type: "success" | "error" | "info" | "warning"
  title: string
  message: string
  timestamp: Date
  autoClose?: boolean
}

const notificationIcons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertCircle,
}

const notificationColors = {
  success: "border-green-500 bg-green-50",
  error: "border-red-500 bg-red-50",
  info: "border-blue-500 bg-blue-50",
  warning: "border-yellow-500 bg-yellow-50",
}

export default function NotificationSystem() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    // Listen for custom notification events
    const handleNotification = (event: CustomEvent<Notification>) => {
      const notification = event.detail
      setNotifications((prev) => [...prev, notification])

      if (notification.autoClose !== false) {
        setTimeout(() => {
          removeNotification(notification.id)
        }, 5000)
      }
    }

    window.addEventListener("showNotification" as any, handleNotification)
    return () => window.removeEventListener("showNotification" as any, handleNotification)
  }, [])

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const showNotification = (notification: Omit<Notification, "id" | "timestamp">) => {
    const event = new CustomEvent("showNotification", {
      detail: {
        ...notification,
        id: Date.now().toString(),
        timestamp: new Date(),
      },
    })
    window.dispatchEvent(event)
  }

  // Expose function globally for use in other components
  useEffect(() => {
    ;(window as any).showNotification = showNotification
  }, [])

  if (notifications.length === 0) return null

  return (
    <div className="fixed top-20 right-6 z-50 space-y-3 max-w-sm">
      {notifications.map((notification) => {
        const Icon = notificationIcons[notification.type]
        return (
          <Card
            key={notification.id}
            className={`${notificationColors[notification.type]} border-l-4 shadow-lg animate-in slide-in-from-right duration-300`}
          >
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <Icon
                  className={`w-5 h-5 mt-0.5 ${
                    notification.type === "success"
                      ? "text-green-600"
                      : notification.type === "error"
                        ? "text-red-600"
                        : notification.type === "warning"
                          ? "text-yellow-600"
                          : "text-blue-600"
                  }`}
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-sm">{notification.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeNotification(notification.id)}
                  className="p-1 h-auto"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
