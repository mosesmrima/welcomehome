"use client"

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { formatUnits } from 'viem'
import { useAccount } from 'wagmi'
import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { Badge } from '@/app/components/ui/badge'
import { Skeleton } from '@/app/components/ui/skeleton'
import { WalletConnect } from '@/app/components/web3/wallet-connect'
import { MapPin, Building2, TrendingUp, Users, Calendar, DollarSign, Home } from 'lucide-react'
import { usePropertyFactory, PropertyInfo, PropertyType } from '@/app/lib/web3/hooks/use-property-factory'
import Image from 'next/image'

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

const PROPERTY_TYPE_LABELS = {
  [PropertyType.RESIDENTIAL]: 'Residential',
  [PropertyType.COMMERCIAL]: 'Commercial',
  [PropertyType.INDUSTRIAL]: 'Industrial',
  [PropertyType.MIXED_USE]: 'Mixed Use',
  [PropertyType.LAND]: 'Land',
}

const PROPERTY_TYPE_ICONS = {
  [PropertyType.RESIDENTIAL]: '🏠',
  [PropertyType.COMMERCIAL]: '🏢',
  [PropertyType.INDUSTRIAL]: '🏭',
  [PropertyType.MIXED_USE]: '🏘️',
  [PropertyType.LAND]: '🌱',
}

// Disable static rendering for this page
export const dynamic = 'force-dynamic'

interface PropertyCardProps {
  property: PropertyInfo
}

function PropertyCard({ property }: PropertyCardProps) {
  const router = useRouter()
  const totalValueUSD = formatUnits(property.totalValue, 18)
  const maxTokens = formatUnits(property.maxTokens, 18)
  const pricePerToken = parseFloat(totalValueUSD) / parseFloat(maxTokens)
  const createdDate = new Date(Number(property.createdAt) * 1000)

  const propertyImage = PROPERTY_IMAGES[property.id % PROPERTY_IMAGES.length]

  const handleClick = () => {
    router.push(`/property/${property.id}`)
  }

  return (
    <Card
      className="hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group"
      onClick={handleClick}
    >
      {/* Property Image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={propertyImage}
          alt={property.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Badges on Image */}
        <div className="absolute top-3 right-3 flex gap-2">
          <Badge variant={property.isActive ? "default" : "secondary"} className="bg-white/90 text-gray-900 backdrop-blur-sm">
            {property.isActive ? 'Active' : 'Inactive'}
          </Badge>
        </div>

        <div className="absolute top-3 left-3">
          <Badge className="bg-white/90 text-gray-900 backdrop-blur-sm">
            {PROPERTY_TYPE_LABELS[property.propertyType as PropertyType]}
          </Badge>
        </div>

        {/* Title on Image */}
        <div className="absolute bottom-3 left-3 right-3">
          <CardTitle className="text-white text-xl mb-1 flex items-center gap-2">
            <span className="text-2xl">{PROPERTY_TYPE_ICONS[property.propertyType as PropertyType]}</span>
            {property.name}
          </CardTitle>
          <p className="text-white/90 text-sm flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {property.location}
          </p>
        </div>
      </div>

      <CardHeader className="pb-3">
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-gray-600 flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              Total Value
            </p>
            <p className="font-semibold">${parseFloat(totalValueUSD).toLocaleString()}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-600 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              Price per Token
            </p>
            <p className="font-semibold">${pricePerToken.toFixed(2)}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-gray-600 flex items-center gap-1">
              <Users className="h-3 w-3" />
              Max Tokens
            </p>
            <p className="font-semibold">{parseFloat(maxTokens).toLocaleString()}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-600 flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Created
            </p>
            <p className="font-semibold">{createdDate.toLocaleDateString()}</p>
          </div>
        </div>

        <div className="pt-2 border-t">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-gray-500">Token Symbol</p>
              <p className="text-sm font-medium">{property.symbol}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-500">Creator</p>
              <p className="text-sm font-medium font-mono text-xs">
                {property.creator.slice(0, 6)}...{property.creator.slice(-4)}
              </p>
            </div>
          </div>
        </div>

        <Button
          className="w-full"
          variant="outline"
          onClick={(e) => {
            e.stopPropagation()
            handleClick()
          }}
        >
          View Details & Calculator
        </Button>
      </CardContent>
    </Card>
  )
}

function PropertySkeleton() {
  return (
    <Card>
      <div className="relative h-48">
        <Skeleton className="w-full h-full" />
      </div>
      <CardHeader className="pb-3">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-32 mt-2" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-5 w-24" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-5 w-16" />
          </div>
        </div>
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  )
}

export default function HomePage() {
  const { address, isConnected } = useAccount()
  const { properties, isLoading, error, fetchProperties, propertyCount } = usePropertyFactory()
  const [filter, setFilter] = useState<PropertyType | 'all'>('all')
  const [sortBy, setSortBy] = useState<'newest' | 'price' | 'value'>('newest')

  const filteredProperties = properties.filter(property => {
    if (filter === 'all') return true
    return property.propertyType === filter
  }).sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return Number(b.createdAt) - Number(a.createdAt)
      case 'price':
        const priceA = parseFloat(formatUnits(a.totalValue, 18)) / parseFloat(formatUnits(a.maxTokens, 18))
        const priceB = parseFloat(formatUnits(b.totalValue, 18)) / parseFloat(formatUnits(b.maxTokens, 18))
        return priceA - priceB
      case 'value':
        return parseFloat(formatUnits(b.totalValue, 18)) - parseFloat(formatUnits(a.totalValue, 18))
      default:
        return 0
    }
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <Home className="w-6 h-6 text-gray-900" />
              <span className="text-lg font-semibold text-gray-900">Welcome Home</span>
            </Link>

            <div className="flex items-center gap-4">
              {isConnected ? (
                <>
                  <span className="text-sm text-gray-600">
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                  </span>
                  <Link href="/dashboard">
                    <Button variant="outline" size="sm">Dashboard</Button>
                  </Link>
                  <Link href="/settings">
                    <Button variant="outline" size="sm">Settings</Button>
                  </Link>
                </>
              ) : (
                <WalletConnect />
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Fractional Real Estate Ownership
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Invest in premium properties with as little as one token. Own a fraction, earn proportional returns.
            </p>
            {!isConnected && (
              <div className="flex justify-center">
                <WalletConnect />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div>
              <h2 className="text-3xl font-bold">Available Properties</h2>
              <p className="text-gray-600 mt-1">
                {isLoading ? 'Loading...' : `${propertyCount} properties available for fractional investment`}
              </p>
            </div>

            <div className="flex gap-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as PropertyType | 'all')}
                className="border rounded-md px-3 py-2 text-sm bg-white"
              >
                <option value="all">All Types</option>
                {Object.entries(PROPERTY_TYPE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'newest' | 'price' | 'value')}
                className="border rounded-md px-3 py-2 text-sm bg-white"
              >
                <option value="newest">Newest First</option>
                <option value="price">Price (Low to High)</option>
                <option value="value">Value (High to Low)</option>
              </select>
            </div>
          </div>

          {error && (
            <Card>
              <CardContent className="p-6 text-center">
                <div className="space-y-2">
                  <p className="text-red-600">Failed to load properties</p>
                  <p className="text-sm text-gray-600">{error}</p>
                  <Button onClick={fetchProperties} variant="outline" size="sm">
                    Try Again
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <PropertySkeleton key={i} />
              ))}
            </div>
          ) : filteredProperties.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Properties Found</h3>
                <p className="text-gray-600 mb-4">
                  {propertyCount === 0
                    ? 'No properties have been listed yet.'
                    : 'No properties match your current filters.'
                  }
                </p>
                {propertyCount === 0 && (
                  <Button onClick={fetchProperties} variant="outline">
                    Refresh
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600 text-sm">
            <p>Welcome Home International Group</p>
            <p className="mt-2">Building pathways to wealth through blockchain-powered real estate</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
