"use client"

import { Card } from "@/app/components/ui/card"
import { PropertyCard } from "@/app/components/properties/property-card"
import { PortfolioOverview } from "@/app/components/dashboard/portfolio-overview"
import { formatCurrency } from "@/app/lib/utils"
import { TrendingUp, MapPin, Coins, Building2, BarChart3, Lock, DollarSign } from "lucide-react"
import { useAccount } from "wagmi"
import { useTokenBalance, useTokenInfo, usePropertyStatus } from "@/app/lib/web3/hooks/use-property-token"
import { useUserRoles } from "@/app/lib/web3/hooks/use-roles"
import { useStakingInfo, useClaimableRevenue } from "@/app/lib/web3/hooks/use-token-handler"
import { usePropertyData, usePropertyStats } from "@/app/lib/web3/hooks/use-property-data"
import { WalletConnect } from "@/app/components/web3/wallet-connect"
import { ContractDebug } from "@/app/components/debug/ContractDebug"
import { formatUnits } from "viem"
import { useMounted } from "@/app/lib/hooks/use-mounted"

const topLocations = [
  { amount: 50000, location: "Westlands at David" },
  { amount: 50000, location: "Kilimani at David" },
  { amount: 50000, location: "Karen at David" },
  { amount: 50000, location: "Runda at David" },
  { amount: 50000, location: "Lavington at David" },
]

// Disable static rendering for this page
export const dynamic = 'force-dynamic'

export default function DashboardPage() {
  const mounted = useMounted()
  const { address, isConnected } = useAccount()

  if (!mounted) {
    return (
      <div className="p-6">
        <div className="max-w-md mx-auto text-center">
          <Building2 className="h-16 w-16 mx-auto mb-4 text-gray-400 animate-pulse" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Loading Dashboard...</h1>
        </div>
      </div>
    )
  }
  const { balance } = useTokenBalance(address)
  const tokenInfo = useTokenInfo()
  const propertyStatus = usePropertyStatus()
  const userRoles = useUserRoles(address)
  const { stakingInfo } = useStakingInfo(address)
  const { claimableAmount } = useClaimableRevenue(address)
  const { properties, isLoading: propertiesLoading } = usePropertyData()
  const { stats } = usePropertyStats()

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
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
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

          <Card className="bg-gradient-to-br from-orange-600 to-orange-700 p-6 text-white border-0 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-orange-500/20 p-2 rounded-lg">
                <Lock className="h-6 w-6" />
              </div>
              <BarChart3 className="h-4 w-4 opacity-60" />
            </div>
            <p className="text-orange-100 text-sm font-medium mb-1">Staked Tokens</p>
            <h2 className="mb-2 text-3xl font-bold">
              {stakingInfo?.stakedAmount ? Number(stakingInfo.stakedAmount).toLocaleString() : '0'}
            </h2>
            <p className="text-orange-100 text-sm">
              Earning 5.00% APY
            </p>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-600 to-emerald-700 p-6 text-white border-0 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-emerald-500/20 p-2 rounded-lg">
                <DollarSign className="h-6 w-6" />
              </div>
              <TrendingUp className="h-4 w-4 opacity-60" />
            </div>
            <p className="text-emerald-100 text-sm font-medium mb-1">Claimable Revenue</p>
            <h2 className="mb-2 text-3xl font-bold">
              {claimableAmount ? Number(claimableAmount).toLocaleString() : '0'}
            </h2>
            <p className="text-emerald-100 text-sm">
              HBAR Available
            </p>
          </Card>
        </div>

        {/* Portfolio Overview */}
        <div className="mb-8">
          <h3 className="mb-4 text-xl font-semibold">Portfolio Overview</h3>
          <PortfolioOverview />
        </div>

        {/* Debug Section - Remove in production */}
        <div className="mt-8">
          <ContractDebug />
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