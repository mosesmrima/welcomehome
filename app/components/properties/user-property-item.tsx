import Image from "next/image"
import { Card } from "../ui/card"
import { Badge } from "../ui/badge"
import { MapPin, Home, TrendingUp, TrendingDown, Share2 } from "lucide-react"
import { Button } from "../ui/button"

interface UserPropertyItemProps {
  property: {
    id: number
    name: string
    location: string
    coordinates?: string
    parcels: number
    size: number // in sqft
    price: number
    change: number // percentage
    image: string
  }
}

export function UserPropertyItem({ property }: UserPropertyItemProps) {
  const isPositiveChange = property.change >= 0

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
      <div className="flex items-center p-4 gap-4">
        {/* Property Image */}
        <div className="relative h-16 w-20 flex-shrink-0 overflow-hidden rounded-lg">
          <Image
            src={property.image}
            alt={property.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>

        {/* Plot ID */}
        <div className="flex-shrink-0 w-24">
          <p className="text-xs text-gray-500">Plot {property.id}</p>
          <p className="text-sm font-semibold text-gray-700">{property.name}</p>
        </div>

        {/* Location */}
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500 mb-1">Location</p>
          <p className="text-sm font-medium text-gray-900 truncate">{property.location}</p>
          {property.coordinates && (
            <p className="text-xs text-gray-500">{property.coordinates}</p>
          )}
        </div>

        {/* Parcels */}
        <div className="flex-shrink-0 w-20 text-center">
          <p className="text-xs text-gray-500 mb-1">Parcels</p>
          <div className="flex items-center justify-center gap-1">
            <Home className="h-3 w-3 text-gray-600" />
            <p className="text-sm font-semibold">{property.parcels.toLocaleString()}</p>
          </div>
        </div>

        {/* Size */}
        <div className="flex-shrink-0 w-24 text-center">
          <p className="text-xs text-gray-500 mb-1">Size(ft)</p>
          <div className="flex items-center justify-center gap-1">
            <Home className="h-3 w-3 text-gray-600" />
            <p className="text-sm font-semibold">{property.size.toLocaleString()}</p>
          </div>
        </div>

        {/* Price */}
        <div className="flex-shrink-0 w-28 text-right">
          <p className="text-xs text-gray-500 mb-1">Price</p>
          <p className="text-sm font-bold text-gray-900">
            ${property.price.toLocaleString()}
          </p>
        </div>

        {/* Change */}
        <div className="flex-shrink-0 w-20 text-right">
          <p className="text-xs text-gray-500 mb-1">Change</p>
          <div className={`flex items-center justify-end gap-1 ${
            isPositiveChange ? 'text-green-600' : 'text-red-600'
          }`}>
            {isPositiveChange ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            <p className="text-sm font-semibold">
              {isPositiveChange ? '+' : ''}{property.change}%
            </p>
          </div>
        </div>

        {/* Share Button */}
        <div className="flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-400 hover:text-gray-600"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
