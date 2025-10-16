"use client"

import { Card } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { TrendingUp, MapPin, Home as HomeIcon, Share2 } from "lucide-react"
import Image from "next/image"

// Mock user data
const userData = {
  name: "John Martins",
  email: "johnmartins@gmail.com",
  balance: 24000,
  earnings: 1000,
  meterSquare: 243,
}

// Mock property data
const userProperty = {
  id: "1",
  name: "Plot 15",
  location: "Somoa, senegal",
  coordinates: "41.8880° N, .876231° W",
  image: "/images/properties/house-1.jpg",
  parcels: 1000,
  size: 12000,
  price: 4000,
  change: "+$15"
}

// Top locations data
const topLocations = [
  {
    amount: 10000,
    location: "Oasis!",
    image: "/images/properties/house-1.jpg",
    time: "Just now"
  },
  {
    amount: 10000,
    location: "Oasis!",
    image: "/images/properties/house-2.jpg",
    time: "Just now"
  },
  {
    amount: 10000,
    location: "Oasis!",
    image: "/images/properties/house-3.jpg",
    time: "Just now"
  },
  {
    amount: 10000,
    location: "Oasis!",
    image: "/images/properties/house-4.jpg",
    time: "Just now"
  },
  {
    amount: 10000,
    location: "Oasis!",
    image: "/images/properties/house-5.jpg",
    time: "Just now"
  },
  {
    amount: 10000,
    location: "Oasis!",
    image: "/images/properties/house-6.jpg",
    time: "Just now"
  },
]

export default function HomePage() {
  return (
    <div className="flex h-full bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-1">Home</h1>
        </div>

        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl p-6 mb-6 flex items-center justify-between">
          <div>
            <p className="text-gray-600 mb-1">Welcome Back,</p>
            <h2 className="text-3xl font-bold text-gray-900">{userData.name}</h2>
          </div>
          <div className="w-32 h-32">
            <Image
              src="/images/properties/house-illustration.svg"
              alt="Property illustration"
              width={128}
              height={128}
              className="object-contain"
              onError={(e) => {
                // Fallback if image doesn't exist
                e.currentTarget.style.display = 'none'
              }}
            />
          </div>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* My Balance Card */}
          <Card className="bg-gradient-to-br from-gray-900 via-teal-900 to-gray-900 p-8 text-white border-0 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-700/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-800/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
            <div className="relative z-10">
              <p className="text-white/90 text-sm mb-4 font-medium">My Balance</p>
              <h2 className="text-6xl font-bold mb-4 text-white drop-shadow-lg">
                ${userData.balance.toLocaleString()}
              </h2>
              <p className="text-emerald-300 text-base font-semibold">
                Earnings: +${userData.earnings.toLocaleString()}
              </p>
            </div>
          </Card>

          {/* Meter Square Card */}
          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 text-white border-0 shadow-xl flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-6xl font-bold mb-2 text-white drop-shadow-lg">{userData.meterSquare}</h2>
              <p className="text-white/80 text-sm flex items-center justify-center gap-2 font-medium">
                <HomeIcon className="h-4 w-4" />
                meter sq
              </p>
            </div>
          </Card>
        </div>

        {/* Your Properties Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Your Properties</h3>
            <Button variant="ghost" className="text-sm">
              List view
            </Button>
          </div>

          {/* Property Card */}
          <Card className="p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              {/* Property Image */}
              <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200">
                <Image
                  src={userProperty.image}
                  alt={userProperty.name}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              </div>

              {/* Property Details */}
              <div className="flex-1 grid grid-cols-6 gap-4 items-center">
                <div>
                  <p className="font-semibold text-gray-900">{userProperty.name}</p>
                  <p className="text-xs text-gray-500">{userProperty.coordinates}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Location</p>
                  <p className="text-sm font-medium text-gray-900">{userProperty.location}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Parcels</p>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 border border-gray-400 rounded flex items-center justify-center">
                      <div className="w-2 h-2 bg-gray-400"></div>
                    </div>
                    <p className="text-sm font-medium text-gray-900">{userProperty.parcels.toLocaleString()}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Size(M)</p>
                  <div className="flex items-center gap-1">
                    <HomeIcon className="w-4 h-4 text-gray-400" />
                    <p className="text-sm font-medium text-gray-900">{userProperty.size.toLocaleString()}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Price</p>
                  <p className="text-sm font-medium text-gray-900">${userProperty.price.toLocaleString()}</p>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Change</p>
                    <p className="text-sm font-medium text-emerald-600">{userProperty.change}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Share2 className="h-4 w-4 text-gray-600" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Right Sidebar - Top Locations */}
      <div className="w-80 border-l bg-white p-6 overflow-auto">
        <div className="mb-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Top locations this week</h3>
            <TrendingUp className="h-5 w-5 text-orange-500" />
          </div>

          <div className="space-y-3">
            {topLocations.map((loc, index) => (
              <div key={index} className="flex items-center gap-3 group hover:bg-gray-50 p-2 rounded-lg transition-colors cursor-pointer">
                <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
                  <Image
                    src={loc.image}
                    alt={loc.location}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-600 mb-0.5">Purchase</p>
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {loc.amount.toLocaleString()} m² bought at {loc.location}
                  </p>
                </div>
                <p className="text-xs text-gray-400 flex-shrink-0">{loc.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
