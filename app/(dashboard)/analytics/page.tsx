"use client"

import { useState } from "react"
import { Card } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Badge } from "@/app/components/ui/badge"
import { formatCurrency } from "@/app/lib/utils"
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Activity,
  DollarSign,
  Users,
  Lock,
  ArrowUp,
  ArrowDown,
  Minus
} from "lucide-react"
import { useAccount } from "wagmi"
import { formatUnits } from "viem"
import {
  useTokenMetrics,
  usePriceHistory,
  useTransactionVolume,
  useStakingMetrics
} from "@/app/lib/web3/hooks/use-analytics-data"
import { useMounted } from "@/app/lib/hooks/use-mounted"

type TimeframeOption = '24h' | '7d' | '30d' | '1y'

// Disable static rendering for this page
export const dynamic = 'force-dynamic'

export default function AnalyticsPage() {
  const mounted = useMounted()
  const { isConnected } = useAccount()
  const [selectedTimeframe, setSelectedTimeframe] = useState<TimeframeOption>('7d')

  if (!mounted) {
    return (
      <div className="p-6">
        <div className="max-w-md mx-auto text-center">
          <BarChart3 className="h-16 w-16 mx-auto mb-4 text-gray-400 animate-pulse" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Loading Analytics...</h1>
        </div>
      </div>
    )
  }

  const { metrics, isLoading: metricsLoading } = useTokenMetrics()
  const { priceHistory, isLoading: priceLoading } = usePriceHistory(selectedTimeframe)
  const { volumeData, isLoading: volumeLoading } = useTransactionVolume(selectedTimeframe)
  const { stakingMetrics, isLoading: stakingLoading } = useStakingMetrics()

  if (!isConnected) {
    return (
      <div className="p-6">
        <div className="max-w-md mx-auto text-center">
          <BarChart3 className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">Connect your wallet to view token analytics</p>
        </div>
      </div>
    )
  }

  const formatNumber = (value: bigint, decimals: number = 18) => {
    return Number(formatUnits(value, decimals)).toLocaleString()
  }

  const getChangeIcon = (change: number) => {
    if (change > 0) return <ArrowUp className="h-3 w-3 text-green-600" />
    if (change < 0) return <ArrowDown className="h-3 w-3 text-red-600" />
    return <Minus className="h-3 w-3 text-gray-600" />
  }

  const getChangeColor = (change: number) => {
    if (change > 0) return "text-green-600"
    if (change < 0) return "text-red-600"
    return "text-gray-600"
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
        <p className="text-gray-600">Track token performance, trading volume, and market metrics</p>
      </div>

      {/* Timeframe Selector */}
      <div className="flex gap-2">
        {(['24h', '7d', '30d', '1y'] as TimeframeOption[]).map((timeframe) => (
          <Button
            key={timeframe}
            variant={selectedTimeframe === timeframe ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedTimeframe(timeframe)}
          >
            {timeframe}
          </Button>
        ))}
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 p-2 rounded-lg">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
            <div className={`flex items-center gap-1 ${getChangeColor(metrics.priceChange24h)}`}>
              {getChangeIcon(metrics.priceChange24h)}
              <span className="text-sm font-medium">
                {Math.abs(metrics.priceChange24h).toFixed(1)}%
              </span>
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Current Price</h3>
          <p className="text-2xl font-bold">
            {metricsLoading ? '...' : `${formatNumber(metrics.currentPrice)} HBAR`}
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 p-2 rounded-lg">
              <BarChart3 className="h-6 w-6 text-green-600" />
            </div>
            <div className={`flex items-center gap-1 ${getChangeColor(metrics.volumeChange24h)}`}>
              {getChangeIcon(metrics.volumeChange24h)}
              <span className="text-sm font-medium">
                {Math.abs(metrics.volumeChange24h).toFixed(1)}%
              </span>
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Market Cap</h3>
          <p className="text-2xl font-bold">
            {metricsLoading ? '...' : `${formatNumber(metrics.marketCap)} HBAR`}
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Activity className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Total Supply</h3>
          <p className="text-2xl font-bold">
            {metricsLoading ? '...' : formatNumber(metrics.totalSupply)}
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-orange-100 p-2 rounded-lg">
              <Lock className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Total Staked</h3>
          <p className="text-2xl font-bold">
            {stakingLoading ? '...' : formatNumber(stakingMetrics.totalStaked)}
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Price History Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Price History</h3>
            <Badge variant="secondary">{selectedTimeframe}</Badge>
          </div>

          {priceLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="h-64">
              {/* Simple ASCII-style chart representation */}
              <div className="relative h-full bg-gray-50 rounded p-4">
                <div className="flex items-end justify-between h-full">
                  {priceHistory.slice(0, 20).map((point, index) => {
                    const maxPrice = Math.max(...priceHistory.map(p => p.price))
                    const minPrice = Math.min(...priceHistory.map(p => p.price))
                    const heightPercent = ((point.price - minPrice) / (maxPrice - minPrice)) * 100

                    return (
                      <div
                        key={index}
                        className="bg-blue-500 w-3 rounded-t"
                        style={{ height: `${Math.max(heightPercent, 5)}%` }}
                        title={`Price: ${point.price.toFixed(2)} HBAR`}
                      />
                    )
                  })}
                </div>
                <div className="absolute bottom-2 left-4 text-xs text-gray-500">
                  Min: {Math.min(...priceHistory.map(p => p.price)).toFixed(2)} HBAR
                </div>
                <div className="absolute top-2 left-4 text-xs text-gray-500">
                  Max: {Math.max(...priceHistory.map(p => p.price)).toFixed(2)} HBAR
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Trading Volume */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Trading Volume</h3>
            <Badge variant="secondary">{selectedTimeframe}</Badge>
          </div>

          {volumeLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
          ) : (
            <div className="space-y-3">
              {volumeData.slice(0, 8).map((volume, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{volume.period}</span>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Buy: {volume.purchases}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-sm">Sell: {volume.sales}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Stake: {volume.stakes}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Staking Analytics */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-orange-100 p-2 rounded-lg">
            <Lock className="h-6 w-6 text-orange-600" />
          </div>
          <h3 className="text-lg font-semibold">Staking Analytics</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-600 mb-2">Total Stakers</h4>
            <p className="text-2xl font-bold text-gray-900">
              {stakingLoading ? '...' : stakingMetrics.totalStakers.toLocaleString()}
            </p>
          </div>

          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-600 mb-2">Average Stake</h4>
            <p className="text-2xl font-bold text-gray-900">
              {stakingLoading ? '...' : formatNumber(stakingMetrics.averageStake)}
            </p>
          </div>

          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-600 mb-2">Current APY</h4>
            <p className="text-2xl font-bold text-green-600">
              {stakingLoading ? '...' : `${stakingMetrics.currentAPY.toFixed(1)}%`}
            </p>
          </div>

          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-600 mb-2">Rewards Distributed</h4>
            <p className="text-2xl font-bold text-gray-900">
              {stakingLoading ? '...' : `${formatNumber(stakingMetrics.rewardsDistributed)} HBAR`}
            </p>
          </div>
        </div>
      </Card>

      {/* Market Summary */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Market Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-2">Circulating Supply</h4>
            <p className="text-xl font-bold">
              {metricsLoading ? '...' : `${formatNumber(metrics.circulatingSupply)} tokens`}
            </p>
            <p className="text-sm text-gray-500">
              {metricsLoading ? '...' : `${((Number(formatUnits(metrics.circulatingSupply, 18)) / Number(formatUnits(metrics.totalSupply, 18))) * 100).toFixed(1)}% of total`}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-2">Staking Ratio</h4>
            <p className="text-xl font-bold">
              {stakingLoading || metricsLoading ? '...' : `${((Number(formatUnits(stakingMetrics.totalStaked, 18)) / Number(formatUnits(metrics.totalSupply, 18))) * 100).toFixed(1)}%`}
            </p>
            <p className="text-sm text-gray-500">
              of total supply staked
            </p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-2">24h Change</h4>
            <p className={`text-xl font-bold ${getChangeColor(metrics.priceChange24h)}`}>
              {metricsLoading ? '...' : `${metrics.priceChange24h > 0 ? '+' : ''}${metrics.priceChange24h.toFixed(2)}%`}
            </p>
            <p className="text-sm text-gray-500">
              price movement
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}