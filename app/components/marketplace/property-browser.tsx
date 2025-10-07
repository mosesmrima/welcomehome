"use client"

import { useState, useEffect } from 'react'
import { formatUnits } from 'viem'
import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { Badge } from '@/app/components/ui/badge'
import { Skeleton } from '@/app/components/ui/skeleton'
import { MapPin, Building2, TrendingUp, Users, Calendar, DollarSign } from 'lucide-react'
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

interface PropertyCardProps {
  property: PropertyInfo
  onViewDetails: (property: PropertyInfo) => void
}

function PropertyCard({ property, onViewDetails }: PropertyCardProps) {
  const totalValueUSD = formatUnits(property.totalValue, 18)
  const maxTokens = formatUnits(property.maxTokens, 18)
  const pricePerToken = parseFloat(totalValueUSD) / parseFloat(maxTokens)
  const createdDate = new Date(Number(property.createdAt) * 1000)

  const propertyImage = PROPERTY_IMAGES[property.id % PROPERTY_IMAGES.length]

  return (
    <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group">
      {/* Property Image */}
      <div className="relative h-48 overflow-hidden" onClick={() => onViewDetails(property)}>
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

      <CardHeader className="pb-3" onClick={() => onViewDetails(property)}>
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
            onViewDetails(property)
          }}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  )
}

function PropertySkeleton() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32 mt-2" />
          </div>
          <Skeleton className="h-6 w-16" />
        </div>
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
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-5 w-20" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-5 w-20" />
          </div>
        </div>
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  )
}

interface PropertyBrowserProps {
  onSelectProperty?: (property: PropertyInfo) => void
}

export function PropertyBrowser({ onSelectProperty }: PropertyBrowserProps) {
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

  const handleViewDetails = (property: PropertyInfo) => {
    if (onSelectProperty) {
      onSelectProperty(property)
    }
  }

  if (error) {
    return (
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
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-2xl font-bold">Available Properties</h2>
          <p className="text-gray-600">
            {isLoading ? 'Loading...' : `${propertyCount} properties available for investment`}
          </p>
        </div>

        <div className="flex gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as PropertyType | 'all')}
            className="border rounded-md px-3 py-2 text-sm"
          >
            <option value="all">All Types</option>
            {Object.entries(PROPERTY_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'newest' | 'price' | 'value')}
            className="border rounded-md px-3 py-2 text-sm"
          >
            <option value="newest">Newest First</option>
            <option value="price">Price (Low to High)</option>
            <option value="value">Value (High to Low)</option>
          </select>
        </div>
      </div>

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
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      )}
    </div>
  )
}