"use client"

import type React from "react"

import { useState } from "react"
import { MessageCircle, X, Send, Bot, Minimize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Message {
  id: number
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

const botResponses = [
  "Hello! How can I help you today?",
  "I'm here to assist you with any questions about our products.",
  "Would you like me to help you find something specific?",
  "Our customer service team is available 24/7 to help you.",
  "Is there anything else I can help you with?",
  "Thank you for contacting us! We appreciate your business.",
  "I can help you with product information, orders, and general inquiries.",
  "Feel free to ask me about our latest deals and promotions!",
  "You can track your orders in the 'My Orders' section.",
  "Would you like me to help you find products in a specific category?",
]

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi! I'm your EliteShop assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  const sendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsTyping(true)

    // Simulate bot response delay
    setTimeout(
      () => {
        const botMessage: Message = {
          id: messages.length + 2,
          text: botResponses[Math.floor(Math.random() * botResponses.length)],
          sender: "bot",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, botMessage])
        setIsTyping(false)

        if (!isOpen) {
          setUnreadCount((prev) => prev + 1)
        }
      },
      1000 + Math.random() * 2000,
    )
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      sendMessage()
    }
  }

  const openChat = () => {
    setIsOpen(true)
    setIsMinimized(false)
    setUnreadCount(0)
  }

  const closeChat = () => {
    setIsOpen(false)
    setIsMinimized(false)
  }

  const minimizeChat = () => {
    setIsMinimized(true)
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={openChat}
          className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-2xl hover:shadow-3xl transition-all duration-300 relative"
          size="lg"
        >
          <MessageCircle className="w-8 h-8 text-white" />
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
              {unreadCount}
            </span>
          )}
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className={`w-80 transition-all duration-300 shadow-2xl ${isMinimized ? "h-16" : "h-96"}`}>
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg p-3">
          <CardTitle className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <Bot className="w-5 h-5 mr-2" />
              EliteShop Assistant
              <span className="ml-2 text-xs opacity-75">Online</span>
            </div>
            <div className="flex space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={minimizeChat}
                className="text-white hover:bg-white/20 p-1 h-auto"
              >
                <Minimize2 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={closeChat} className="text-white hover:bg-white/20 p-1 h-auto">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="flex flex-col p-0 h-80">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                      message.sender === "user"
                        ? "bg-blue-600 text-white rounded-br-sm"
                        : "bg-gray-100 text-gray-800 rounded-bl-sm"
                    }`}
                  >
                    <p>{message.text}</p>
                    <p className={`text-xs mt-1 ${message.sender === "user" ? "text-blue-100" : "text-gray-500"}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-800 rounded-lg rounded-bl-sm px-3 py-2 max-w-xs">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="border-t p-3">
              <div className="flex space-x-2">
                <Input
                  type="text"
                  placeholder="Type a message..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 text-sm"
                />
                <Button
                  onClick={sendMessage}
                  disabled={!inputMessage.trim()}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
