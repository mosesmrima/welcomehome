"use client"

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Skeleton } from '../ui/skeleton'
import { formatUnits } from 'viem'
import { useAccount } from 'wagmi'
import { useCompleteUserPortfolio, useUserPortfolio } from '@/app/lib/web3/hooks/use-ownership-registry'
import { usePropertyFactory } from '@/app/lib/web3/hooks/use-property-factory'
import { useClaimableRevenue } from '@/app/lib/web3/hooks/use-token-handler'
import { useStakingInfo, useStakingRewards } from '@/app/lib/web3/hooks/use-token-handler'
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

interface PropertyHolding {
  propertyId: number
  propertyName: string
  propertyLocation: string
  symbol: string
  balance: string
  value: string
  percentage: number
  lastUpdated: Date
  imageUrl: string
}

// Property images mapping
const PROPERTY_IMAGES = [
  '/images/properties/house-1.jpg',
  '/images/properties/house-2.jpg',
  '/images/properties/house-3.jpg',
  '/images/properties/house-6.jpg',
  '/images/properties/house-7.jpg',
  '/images/properties/house-9.jpg',
  '/images/properties/house-10.jpg',
]

export function PortfolioOverview() {
  const [holdings, setHoldings] = useState<PropertyHolding[]>([])
  const [totalValue, setTotalValue] = useState('0')
  const [dailyChange, setDailyChange] = useState({ amount: '0', percentage: '0', isPositive: true })

  const { address, isConnected } = useAccount()
  const { portfolio, properties, isLoading, error, refetch } = useCompleteUserPortfolio(address)
  const { properties: allProperties } = usePropertyFactory()
  const { claimableAmount } = useClaimableRevenue(address)
  const { stakingInfo } = useStakingInfo(address)
  const { rewards } = useStakingRewards(address)

  useEffect(() => {
    if (!portfolio || !allProperties.length || !properties.length) return

    const propertyHoldings: PropertyHolding[] = []
    let total = 0

    for (const propertyId of properties) {
      const propertyIdNum = Number(propertyId)
      const propertyInfo = allProperties.find(p => p.id === propertyIdNum)

      if (propertyInfo) {
        // Mock balance calculation - in production this would come from OwnershipRegistry
        const mockBalance = "100" // This would be actual balance from contract
        const mockValue = "5000" // This would be calculated from balance * current price
        const mockPercentage = 15 // This would be calculated based on total portfolio

        propertyHoldings.push({
          propertyId: propertyIdNum,
          propertyName: propertyInfo.name,
          propertyLocation: propertyInfo.location,
          symbol: propertyInfo.symbol,
          balance: mockBalance,
          value: mockValue,
          percentage: mockPercentage,
          lastUpdated: new Date(Number(propertyInfo.createdAt) * 1000),
          imageUrl: PROPERTY_IMAGES[propertyIdNum % PROPERTY_IMAGES.length]
        })

        total += parseFloat(mockValue)
      }
    }

    setHoldings(propertyHoldings)
    setTotalValue(total.toFixed(2))

    // Mock daily change calculation
    setDailyChange({
      amount: (total * 0.02).toFixed(2), // 2% change
      percentage: "2.1",
      isPositive: Math.random() > 0.5
    })

  }, [portfolio, allProperties, properties])

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

  if (isLoading) {
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
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div>
                      <Skeleton className="h-4 w-32 mb-1" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                  <div className="text-right">
                    <Skeleton className="h-4 w-16 mb-1" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="space-y-2">
            <p className="text-red-600">Failed to load portfolio</p>
            <p className="text-sm text-gray-600">{error}</p>
            <Button onClick={refetch} variant="outline" size="sm">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
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
                <p className="text-2xl font-bold">${totalValue}</p>
                <div className={`flex items-center gap-1 text-sm ${
                  dailyChange.isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {dailyChange.isPositive ?
                    <ArrowUpRight className="h-3 w-3" /> :
                    <ArrowDownRight className="h-3 w-3" />
                  }
                  <span>+${dailyChange.amount} ({dailyChange.percentage}%)</span>
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
                <p className="text-2xl font-bold">{portfolio ? formatUnits(portfolio.totalTokens, 18).split('.')[0] : '0'}</p>
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
                <p className="text-sm font-medium text-gray-600">Claimable Revenue</p>
                <p className="text-2xl font-bold">
                  {claimableAmount ? `$${formatUnits(claimableAmount, 18)}` : '$0'}
                </p>
                <p className="text-sm text-gray-500">Ready to claim</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Staking Information */}
      {stakingInfo && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Staking Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Staked Amount</p>
                <p className="text-xl font-bold">{formatUnits(stakingInfo.stakedAmount, 18)} tokens</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Staking Rewards</p>
                <p className="text-xl font-bold text-green-600">
                  {rewards ? `+${formatUnits(rewards, 18)}` : '0'} tokens
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Total Rewards Earned</p>
                <p className="text-xl font-bold">{formatUnits(stakingInfo.totalRewards, 18)} tokens</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Property Holdings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Property Holdings
            </div>
            {hasInvestments && (
              <Badge variant="outline">{holdings.length} properties</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!hasInvestments ? (
            <div className="text-center py-8">
              <Building2 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">No Properties Yet</h3>
              <p className="text-gray-600 mb-4">
                You haven't invested in any properties. Browse the marketplace to get started.
              </p>
              <Button onClick={() => window.location.href = '/marketplace'}>
                Browse Properties
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {holdings.map((holding) => (
                <div
                  key={holding.propertyId}
                  className="group relative overflow-hidden rounded-2xl border-2 border-gray-200 hover:border-primary-500 transition-all duration-300 hover:shadow-xl cursor-pointer"
                >
                  {/* Property Image */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={holding.imageUrl}
                      alt={holding.propertyName}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                    {/* Badge on Image */}
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-white/90 text-gray-900 backdrop-blur-sm">
                        {holding.symbol}
                      </Badge>
                    </div>

                    {/* Value on Image */}
                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="text-white font-bold text-2xl">${holding.value}</p>
                      <div className="flex items-center gap-2 text-white/90 text-sm">
                        <span>{holding.balance} tokens</span>
                        <span>•</span>
                        <span>{holding.percentage}% of portfolio</span>
                      </div>
                    </div>
                  </div>

                  {/* Property Details */}
                  <div className="p-4 bg-white">
                    <h4 className="font-bold text-lg mb-1">{holding.propertyName}</h4>
                    <p className="text-sm text-gray-600 mb-3">{holding.propertyLocation}</p>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Updated {holding.lastUpdated.toLocaleDateString()}
                      </span>
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      {hasInvestments && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button variant="outline" className="h-16" onClick={() => window.location.href = '/marketplace'}>
            <div className="text-center">
              <Building2 className="h-5 w-5 mx-auto mb-1" />
              <span className="text-sm">Browse More Properties</span>
            </div>
          </Button>

          <Button variant="outline" className="h-16" onClick={() => window.location.href = '/staking'}>
            <div className="text-center">
              <Clock className="h-5 w-5 mx-auto mb-1" />
              <span className="text-sm">Manage Staking</span>
            </div>
          </Button>

          <Button variant="outline" className="h-16" onClick={() => window.location.href = '/revenue'}>
            <div className="text-center">
              <TrendingUp className="h-5 w-5 mx-auto mb-1" />
              <span className="text-sm">Claim Revenue</span>
            </div>
          </Button>
        </div>
      )}
    </div>
  )
}