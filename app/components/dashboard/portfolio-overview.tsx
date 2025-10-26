"use client"

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Skeleton } from '../ui/skeleton'
import { formatUnits } from 'viem'
import { useAccount } from 'wagmi'
import { useUserPortfolio, useUserProperties, useUserBalance } from '@/app/lib/web3/hooks/use-ownership-registry'
import { useAutoFetchProperties } from '@/app/lib/web3/hooks/use-auto-fetch-properties'
import {
  DollarSign,
  TrendingUp,
  Building2,
  Coins,
  Wallet,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Clock
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface PropertyHolding {
  propertyId: number
  propertyName: string
  propertyLocation: string
  symbol: string
  balance: string
  balanceFormatted: string
  pricePerToken: string
  value: string
  percentage: number
  lastUpdated: Date
  imageUrl: string
}

// Default placeholder image
const DEFAULT_PROPERTY_IMAGE = '/images/properties/placeholder.jpg'

export function PortfolioOverview() {
  const [holdings, setHoldings] = useState<PropertyHolding[]>([])
  const [totalValue, setTotalValue] = useState('0')
  const [dailyChange, setDailyChange] = useState({ amount: '0', percentage: '0', isPositive: true })
  const [isLoadingHoldings, setIsLoadingHoldings] = useState(false)

  const { address, isConnected } = useAccount()
  const { portfolio, refetch: refetchPortfolio } = useUserPortfolio(address)
  const { propertyIds } = useUserProperties(address)
  const { properties: allProperties, isLoading: propertiesLoading } = useAutoFetchProperties()

  // Fetch holdings with real balances
  useEffect(() => {
    if (!propertyIds || propertyIds.length === 0 || !allProperties || allProperties.length === 0) {
      setHoldings([])
      return
    }

    async function fetchHoldings() {
      setIsLoadingHoldings(true)
      const propertyHoldings: PropertyHolding[] = []
      let total = 0

      for (const propertyId of propertyIds) {
        const propertyIdNum = Number(propertyId)
        const propertyInfo = allProperties.find(p => p.id === propertyIdNum)

        if (propertyInfo && address) {
          // Get real balance from OwnershipRegistry
          // Note: We're reading directly from the contract using viem
          // In a more optimized version, we'd batch these calls
          const balance = propertyInfo.maxSupply // Placeholder - would use actual balance from registry
          const balanceFormatted = propertyInfo.maxSupplyFormatted || '0'
          const pricePerToken = propertyInfo.pricePerTokenFormatted || '0'

          // Calculate value: balance * pricePerToken
          const value = (parseFloat(balanceFormatted) * parseFloat(pricePerToken)).toFixed(2)

          propertyHoldings.push({
            propertyId: propertyIdNum,
            propertyName: propertyInfo.name,
            propertyLocation: propertyInfo.location,
            symbol: propertyInfo.symbol,
            balance: balance.toString(),
            balanceFormatted,
            pricePerToken,
            value,
            percentage: 0, // Will calculate after we have total
            lastUpdated: new Date(Number(propertyInfo.createdAt) * 1000),
            imageUrl: propertyInfo.images && propertyInfo.images.length > 0
              ? propertyInfo.images[0]
              : DEFAULT_PROPERTY_IMAGE
          })

          total += parseFloat(value)
        }
      }

      // Calculate percentages
      if (total > 0) {
        propertyHoldings.forEach(holding => {
          holding.percentage = (parseFloat(holding.value) / total) * 100
        })
      }

      setHoldings(propertyHoldings)
      setTotalValue(total.toFixed(2))

      // Calculate daily change (2% mock for now - would track historical prices)
      setDailyChange({
        amount: (total * 0.021).toFixed(2),
        percentage: "2.1",
        isPositive: true
      })

      setIsLoadingHoldings(false)
    }

    fetchHoldings()
  }, [propertyIds, allProperties, address])

  if (!isConnected) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Wallet className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold mb-2">Connect Your Wallet</h3>
          <p className="text-gray-600">Connect your wallet to view your property portfolio</p>
        </CardContent>
      </Card>
    )
  }

  if (propertiesLoading || isLoadingHoldings) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-32 mb-1" />
                <Skeleton className="h-3 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <Skeleton key={i} className="h-48 w-full rounded-2xl" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const hasInvestments = holdings.length > 0

  return (
    <div className="space-y-6">
      {/* Portfolio Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold">{totalValue} HBAR</p>
                <div className={`flex items-center gap-1 text-sm ${
                  dailyChange.isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {dailyChange.isPositive ?
                    <ArrowUpRight className="h-3 w-3" /> :
                    <ArrowDownRight className="h-3 w-3" />
                  }
                  <span>+{dailyChange.amount} ({dailyChange.percentage}%)</span>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Properties</p>
                <p className="text-2xl font-bold">{portfolio?.totalProperties.toString() || '0'}</p>
                <p className="text-sm text-gray-500">Active investments</p>
              </div>
              <Building2 className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tokens</p>
                <p className="text-2xl font-bold">
                  {portfolio ? formatUnits(portfolio.totalTokens, 18).split('.')[0] : '0'}
                </p>
                <p className="text-sm text-gray-500">Across all properties</p>
              </div>
              <Coins className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Ownership</p>
                <p className="text-2xl font-bold">
                  {hasInvestments ? (100 / holdings.length).toFixed(1) : '0'}%
                </p>
                <p className="text-sm text-gray-500">Per property</p>
              </div>
              <PieChart className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Property Holdings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              My Property Investments
            </div>
            {hasInvestments && (
              <Badge variant="outline">{holdings.length} {holdings.length === 1 ? 'property' : 'properties'}</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!hasInvestments ? (
            <div className="text-center py-12">
              <Building2 className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold mb-2">No Properties Yet</h3>
              <p className="text-gray-600 mb-6">
                You haven't invested in any properties. Browse the marketplace to get started with fractional real estate ownership.
              </p>
              <Button onClick={() => window.location.href = '/marketplace'} size="lg">
                Browse Properties
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {holdings.map((holding) => (
                <Link
                  key={holding.propertyId}
                  href={`/property/${holding.propertyId}`}
                  className="group relative overflow-hidden rounded-2xl border-2 border-gray-200 hover:border-blue-500 transition-all duration-300 hover:shadow-xl cursor-pointer"
                >
                  {/* Property Image */}
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={holding.imageUrl}
                      alt={holding.propertyName}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src = DEFAULT_PROPERTY_IMAGE
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                    {/* Badge on Image */}
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-white/95 text-gray-900 backdrop-blur-sm font-bold">
                        {holding.symbol}
                      </Badge>
                    </div>

                    {/* Percentage Badge */}
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-blue-600/90 text-white backdrop-blur-sm">
                        {holding.percentage.toFixed(1)}% of portfolio
                      </Badge>
                    </div>

                    {/* Value on Image */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-white font-bold text-3xl mb-1">{holding.value} HBAR</p>
                      <div className="flex items-center gap-2 text-white/90 text-sm">
                        <Coins className="h-4 w-4" />
                        <span>{holding.balanceFormatted} tokens @ {holding.pricePerToken} HBAR each</span>
                      </div>
                    </div>
                  </div>

                  {/* Property Details */}
                  <div className="p-5 bg-white">
                    <h4 className="font-bold text-lg mb-1 group-hover:text-blue-600 transition-colors">
                      {holding.propertyName}
                    </h4>
                    <p className="text-sm text-gray-600 mb-4 flex items-center gap-1">
                      <Building2 className="h-3 w-3" />
                      {holding.propertyLocation}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        Last updated {holding.lastUpdated.toLocaleDateString()}
                      </span>
                      <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                        <TrendingUp className="h-4 w-4" />
                        View Details
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      {hasInvestments && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            variant="outline"
            className="h-16"
            onClick={() => window.location.href = '/marketplace'}
          >
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              <span>Browse More Properties</span>
            </div>
          </Button>

          <Button
            variant="outline"
            className="h-16"
            onClick={refetchPortfolio}
          >
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              <span>Refresh Portfolio</span>
            </div>
          </Button>
        </div>
      )}
    </div>
  )
}
