"use client"

import { useState, useEffect } from "react"
import { User, Mail, Phone, MapPin, Calendar, CreditCard, Edit3, Save, X, Camera, Settings, Sun, Moon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { useTheme } from "@/contexts/ThemeContext"

export default function MyProfile() {
  const [isEditing, setIsEditing] = useState(false)
  const [eliteCredit, setEliteCredit] = useState(0)
  const [rechargeAmount, setRechargeAmount] = useState("")
  const [profile, setProfile] = useState({
    name: "Faria Islam",
    email: "faria.islam@example.com",
    phone: "+880 1234567890",
    address: "123 Main Street, Dhaka, Bangladesh",
    joinDate: "July 2025",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
  })
  const [editedProfile, setEditedProfile] = useState(profile)
  const [emailSettings, setEmailSettings] = useState({
    orderUpdates: true,
    promotions: false,
    newsletter: true,
    security: true
  })
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    // Load elite credit from localStorage
    const savedCredit = localStorage.getItem("eliteCredit")
    if (savedCredit) {
      setEliteCredit(Number.parseFloat(savedCredit))
    } else {
      // Set initial credit
      const initialCredit = 5000
      setEliteCredit(initialCredit)
      localStorage.setItem("eliteCredit", initialCredit.toString())
    }

    // Load profile from localStorage
    const savedProfile = localStorage.getItem("userProfile")
    if (savedProfile) {
      try {
        const parsedProfile = JSON.parse(savedProfile)
        setProfile(parsedProfile)
        setEditedProfile(parsedProfile)
      } catch (error) {
        console.error("Error loading profile:", error)
      }
    }

    // Load email settings from localStorage
    const savedEmailSettings = localStorage.getItem("emailSettings")
    if (savedEmailSettings) {
      try {
        setEmailSettings(JSON.parse(savedEmailSettings))
      } catch (error) {
        console.error("Error loading email settings:", error)
      }
    }
  }, [])

  const handleSaveProfile = () => {
    setProfile(editedProfile)
    localStorage.setItem("userProfile", JSON.stringify(editedProfile))
    setIsEditing(false)
    
    // Show notification
    if (window.showNotification) {
      window.showNotification({
        type: "success",
        title: "Profile Updated",
        message: "Your profile has been updated successfully",
      })
    }
  }

  const handleCancelEdit = () => {
    setEditedProfile(profile)
    setIsEditing(false)
  }

  const handleRecharge = () => {
    const amount = Number.parseFloat(rechargeAmount)
    if (amount > 0) {
      const newCredit = eliteCredit + amount
      setEliteCredit(newCredit)
      localStorage.setItem("eliteCredit", newCredit.toString())
      setRechargeAmount("")

      // Trigger credit update event
      window.dispatchEvent(new Event("creditUpdated"))

      // Show notification
      if (window.showNotification) {
        window.showNotification({
          type: "success",
          title: "Credit Recharged",
          message: `৳${amount.toFixed(2)} has been added to your Elite Credit`,
        })
      }
    }
  }

  const handleEmailSettingChange = (setting, value) => {
    const newSettings = { ...emailSettings, [setting]: value }
    setEmailSettings(newSettings)
    localStorage.setItem("emailSettings", JSON.stringify(newSettings))
    
    // Show notification
    if (window.showNotification) {
      window.showNotification({
        type: "info",
        title: "Settings Updated",
        message: `Email ${setting} ${value ? 'enabled' : 'disabled'}`,
      })
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
            <div className="relative">
              <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                <AvatarImage src={profile.avatar || "/placeholder.svg"} alt={profile.name} />
                <AvatarFallback className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  {profile.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <Button
                size="sm"
                className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 bg-blue-600 hover:bg-blue-700"
              >
                <Camera className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">{profile.name}</h1>
              <p className="text-gray-600 dark:text-gray-400 mb-2">{profile.email}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                  <Calendar className="w-3 h-3 mr-1" />
                  Joined {profile.joinDate}
                </Badge>
                <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                  Elite Member
                </Badge>
              </div>
            </div>

            <div className="text-center">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-purple-200 dark:border-purple-700">
                <CreditCard className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600 dark:text-gray-400">Elite Credit</p>
                <p className="text-2xl font-bold text-purple-600">৳{eliteCredit.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Information */}
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-600" />
                Profile Information
              </CardTitle>
              {!isEditing ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="hover:bg-blue-50 dark:hover:bg-blue-900/20"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancelEdit}
                    className="hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSaveProfile}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center">
                <User className="w-4 h-4 mr-2 text-gray-500" />
                Full Name
              </Label>
              {isEditing ? (
                <Input
                  id="name"
                  value={editedProfile.name}
                  onChange={(e) => setEditedProfile({...editedProfile, name: e.target.value})}
                  className="rounded-lg"
                />
              ) : (
                <p className="text-gray-900 dark:text-gray-100 font-medium">{profile.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center">
                <Mail className="w-4 h-4 mr-2 text-gray-500" />
                Email Address
              </Label>
              {isEditing ? (
                <Input
                  id="email"
                  type="email"
                  value={editedProfile.email}
                  onChange={(e) => setEditedProfile({...editedProfile, email: e.target.value})}
                  className="rounded-lg"
                />
              ) : (
                <p className="text-gray-900 dark:text-gray-100 font-medium">{profile.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center">
                <Phone className="w-4 h-4 mr-2 text-gray-500" />
                Phone Number
              </Label>
              {isEditing ? (
                <Input
                  id="phone"
                  value={editedProfile.phone}
                  onChange={(e) => setEditedProfile({...editedProfile, phone: e.target.value})}
                  className="rounded-lg"
                />
              ) : (
                <p className="text-gray-900 dark:text-gray-100 font-medium">{profile.phone}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                Address
              </Label>
              {isEditing ? (
                <Input
                  id="address"
                  value={editedProfile.address}
                  onChange={(e) => setEditedProfile({...editedProfile, address: e.target.value})}
                  className="rounded-lg"
                />
              ) : (
                <p className="text-gray-900 dark:text-gray-100 font-medium">{profile.address}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Elite Credit Recharge */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="w-5 h-5 mr-2 text-purple-600" />
              Elite Credit Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-4 rounded-xl border border-purple-200 dark:border-purple-700">
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Current Balance</p>
                <p className="text-3xl font-bold text-purple-600 mb-2">৳{eliteCredit.toFixed(2)}</p>
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                  Active
                </Badge>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <Label htmlFor="recharge">Recharge Amount (BDT)</Label>
              <div className="flex space-x-2">
                <Input
                  id="recharge"
                  type="number"
                  placeholder="Enter amount"
                  value={rechargeAmount}
                  onChange={(e) => setRechargeAmount(e.target.value)}
                  className="rounded-lg"
                />
                <Button
                  onClick={handleRecharge}
                  disabled={!rechargeAmount || Number.parseFloat(rechargeAmount) <= 0}
                  className="bg-purple-600 hover:bg-purple-700 px-6"
                >
                  Recharge
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[500, 1000, 2000, 5000].map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  size="sm"
                  onClick={() => setRechargeAmount(amount.toString())}
                  className="hover:bg-purple-50 dark:hover:bg-purple-900/20 border-purple-200 dark:border-purple-700"
                >
                  ৳{amount}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Email Settings */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Mail className="w-5 h-5 mr-2 text-green-600" />
            Email Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">Order Updates</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Get notified about order status</p>
              </div>
              <Switch
                checked={emailSettings.orderUpdates}
                onCheckedChange={(checked) => handleEmailSettingChange('orderUpdates', checked)}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">Promotions</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Receive promotional offers</p>
              </div>
              <Switch
                checked={emailSettings.promotions}
                onCheckedChange={(checked) => handleEmailSettingChange('promotions', checked)}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">Newsletter</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Weekly newsletter updates</p>
              </div>
              <Switch
                checked={emailSettings.newsletter}
                onCheckedChange={(checked) => handleEmailSettingChange('newsletter', checked)}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">Security Alerts</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Account security notifications</p>
              </div>
              <Switch
                checked={emailSettings.security}
                onCheckedChange={(checked) => handleEmailSettingChange('security', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* App Settings */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="w-5 h-5 mr-2 text-gray-600" />
            App Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center space-x-3">
              {theme === 'light' ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-blue-500" />
              )}
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">Theme</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {theme === 'light' ? 'Light mode' : 'Dark mode'}
                </p>
              </div>
            </div>
            <Switch
              checked={theme === 'dark'}
              onCheckedChange={toggleTheme}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
