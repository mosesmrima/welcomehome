"use client"

import { Card } from "@/app/components/ui/card"
import { PropertyCard } from "@/app/components/properties/property-card"
import { formatCurrency } from "@/app/lib/utils"
import { TrendingUp, MapPin, Coins, Building2, BarChart3 } from "lucide-react"
import { useAccount } from "wagmi"
import { useTokenBalance, useTokenInfo, usePropertyStatus } from "@/app/lib/web3/hooks/use-property-token"
import { useUserRoles } from "@/app/lib/web3/hooks/use-roles"
import { WalletConnect } from "@/app/components/web3/wallet-connect"

// Mock data - will be replaced with real data from smart contracts
const mockProperties = [
  { id: 1, name: "Plot 15", location: "Westlands, Nairobi", size: "2000 sq ft", price: 54000, image: "/property1.jpg" },
  { id: 2, name: "Plot 16", location: "Kilimani, Nairobi", size: "1800 sq ft", price: 48000, image: "/property2.jpg" },
  { id: 3, name: "Plot 17", location: "Karen, Nairobi", size: "3000 sq ft", price: 72000, image: "/property3.jpg" },
  { id: 4, name: "Plot 18", location: "Runda, Nairobi", size: "2500 sq ft", price: 65000, image: "/property4.jpg" },
  { id: 5, name: "Plot 19", location: "Lavington, Nairobi", size: "2200 sq ft", price: 58000, image: "/property5.jpg" },
  { id: 6, name: "Plot 20", location: "Kileleshwa, Nairobi", size: "1900 sq ft", price: 51000, image: "/property6.jpg" },
]

const topLocations = [
  { amount: 50000, location: "Westlands at David" },
  { amount: 50000, location: "Kilimani at David" },
  { amount: 50000, location: "Karen at David" },
  { amount: 50000, location: "Runda at David" },
  { amount: 50000, location: "Lavington at David" },
]

export default function DashboardPage() {
  const { address, isConnected } = useAccount()
  const { balance } = useTokenBalance(address)
  const tokenInfo = useTokenInfo()
  const propertyStatus = usePropertyStatus()
  const userRoles = useUserRoles(address)

  // Show wallet connection if not connected
  if (!isConnected) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <Building2 className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome to Welcome Home Property
            </h1>
            <p className="text-gray-600">
              Connect your wallet to start investing in tokenized real estate
            </p>
          </div>
          <WalletConnect />
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full">
      <div className="flex-1 p-6">
        {/* Welcome Section */}
        <div className="mb-6">
          <h2 className="text-lg text-gray-800">Welcome Back,</h2>
          <h1 className="text-3xl font-bold">Property Investor</h1>
          {userRoles.isManager && (
            <p className="text-sm text-blue-600 font-medium">
              You have administrative privileges
            </p>
          )}
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 text-white border-0 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-500/20 p-2 rounded-lg">
                <Coins className="h-6 w-6" />
              </div>
              <TrendingUp className="h-4 w-4 opacity-60" />
            </div>
            <p className="text-blue-100 text-sm font-medium mb-1">Token Balance</p>
            <h2 className="mb-2 text-3xl font-bold">
              {balance ? Number(balance).toLocaleString() : '0'}
            </h2>
            <p className="text-blue-100 text-sm">
              {tokenInfo.symbol || 'Tokens'}
            </p>
          </Card>

          <Card className="bg-gradient-to-br from-purple-600 to-purple-700 p-6 text-white border-0 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-500/20 p-2 rounded-lg">
                <Building2 className="h-6 w-6" />
              </div>
              <BarChart3 className="h-4 w-4 opacity-60" />
            </div>
            <p className="text-purple-100 text-sm font-medium mb-1">Total Supply</p>
            <h2 className="mb-2 text-3xl font-bold">
              {tokenInfo.totalSupply ? Number(tokenInfo.totalSupply).toLocaleString() : '0'}
            </h2>
            <p className="text-purple-100 text-sm">
              Max: {tokenInfo.maxTokens ? Number(tokenInfo.maxTokens).toLocaleString() : '0'}
            </p>
          </Card>

          <Card className="bg-gradient-to-br from-green-600 to-green-700 p-6 text-white border-0 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-500/20 p-2 rounded-lg">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div className={`w-2 h-2 rounded-full ${propertyStatus.isInitialized ? 'bg-green-300' : 'bg-red-300'}`}></div>
            </div>
            <p className="text-green-100 text-sm font-medium mb-1">Property Status</p>
            <h2 className="mb-2 text-2xl font-bold">
              {propertyStatus.isInitialized ? 'Active' : 'Inactive'}
            </h2>
            <p className="text-green-100 text-sm">
              {propertyStatus.isPaused ? 'Paused' : 'Operating'}
            </p>
          </Card>
        </div>

        {/* Properties Grid */}
        <div>
          <h3 className="mb-4 text-xl font-semibold">Your Properties</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mockProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-80 border-l bg-white p-6">
        <div className="mb-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold">Top locations this week</h3>
            <TrendingUp className="h-5 w-5 text-orange-500" />
          </div>

          <div className="space-y-3">
            {topLocations.map((loc, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                  <MapPin className="h-5 w-5 text-gray-700" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-700">{formatCurrency(loc.amount)} m² bought at David</p>
                  <p className="text-sm font-medium">{loc.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}