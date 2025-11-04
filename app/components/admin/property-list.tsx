"use client"

import { useState, useEffect } from "react"
import { Card } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Badge } from "@/app/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table"
import {
  Search,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  Building2,
  CheckCircle,
  XCircle,
  Loader2,
  Image as ImageIcon
} from "lucide-react"
import { usePropertyCRUD, PropertyData } from "@/app/lib/supabase/hooks/use-property-crud"
import { formatCurrency } from "@/app/lib/utils"
import Image from "next/image"

interface PropertyListProps {
  onEdit: (property: PropertyData) => void
  onView: (property: PropertyData) => void
  onDelete: (property: PropertyData) => void
}

export function PropertyList({ onEdit, onView, onDelete }: PropertyListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all')
  const { properties, isLoading, error, fetchAllProperties, togglePropertyStatus } = usePropertyCRUD()

  useEffect(() => {
    // Fetch properties on mount
    const filters = filterStatus === 'all' ? {} : { is_active: filterStatus === 'active' }
    fetchAllProperties(filters)
  }, [filterStatus, fetchAllProperties])

  const handleToggleStatus = async (property: PropertyData) => {
    const result = await togglePropertyStatus(
      property.contract_address,
      !property.is_active
    )

    if (result.success) {
      // Refresh list
      fetchAllProperties()
    }
  }

  // Filter properties based on search query
  const filteredProperties = properties.filter(property => {
    const query = searchQuery.toLowerCase()
    return (
      property.name.toLowerCase().includes(query) ||
      property.symbol.toLowerCase().includes(query) ||
      property.contract_address.toLowerCase().includes(query) ||
      property.location?.city?.toLowerCase().includes(query)
    )
  })

  const getPropertyTypeColor = (type: string) => {
    switch (type) {
      case 'RESIDENTIAL':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'COMMERCIAL':
        return 'bg-purple-50 text-purple-700 border-purple-200'
      case 'INDUSTRIAL':
        return 'bg-orange-50 text-orange-700 border-orange-200'
      case 'MIXED_USE':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'LAND':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  if (isLoading && properties.length === 0) {
    return (
      <Card className="p-8">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          <span className="ml-3 text-gray-600">Loading properties...</span>
        </div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="p-8 border-red-200 bg-red-50">
        <div className="text-center">
          <XCircle className="h-12 w-12 mx-auto mb-4 text-red-600" />
          <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading Properties</h3>
          <p className="text-red-700">{error}</p>
          <Button
            onClick={() => fetchAllProperties()}
            className="mt-4"
            variant="outline"
          >
            Retry
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="search"
            placeholder="Search properties by name, symbol, address, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={filterStatus === 'all' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('all')}
            size="sm"
          >
            All
          </Button>
          <Button
            variant={filterStatus === 'active' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('active')}
            size="sm"
          >
            Active
          </Button>
          <Button
            variant={filterStatus === 'inactive' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('inactive')}
            size="sm"
          >
            Inactive
          </Button>
        </div>
      </div>

      {/* Properties Table */}
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>Property</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Tokens</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProperties.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12">
                    <Building2 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600">No properties found</p>
                    {searchQuery && (
                      <p className="text-sm text-gray-500 mt-2">
                        Try adjusting your search query
                      </p>
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                filteredProperties.map((property) => (
                  <TableRow key={property.contract_address} className="hover:bg-gray-50">
                    <TableCell>
                      {property.images && property.images.length > 0 ? (
                        <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-gray-100">
                          <Image
                            src={property.images[0]}
                            alt={property.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                      ) : (
                        <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center">
                          <ImageIcon className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-semibold text-gray-900">{property.name}</div>
                        <div className="text-sm text-gray-500">
                          {property.symbol}
                        </div>
                        <div className="text-xs text-gray-400 font-mono">
                          {property.contract_address.slice(0, 8)}...{property.contract_address.slice(-6)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getPropertyTypeColor(property.property_type || '')}>
                        {property.property_type || 'N/A'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {property.location?.city || 'N/A'}
                        {property.location?.country && `, ${property.location.country}`}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold">
                        {property.total_value
                          ? formatCurrency(parseFloat(property.total_value))
                          : 'N/A'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {property.max_tokens
                          ? parseInt(property.max_tokens).toLocaleString()
                          : 'N/A'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={
                            property.is_active
                              ? 'bg-green-50 text-green-700 border-green-200'
                              : 'bg-gray-50 text-gray-700 border-gray-200'
                          }
                        >
                          {property.is_active ? (
                            <>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Active
                            </>
                          ) : (
                            <>
                              <XCircle className="h-3 w-3 mr-1" />
                              Inactive
                            </>
                          )}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onView(property)}
                          title="View details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(property)}
                          title="Edit property"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleStatus(property)}
                          title={property.is_active ? 'Deactivate' : 'Activate'}
                        >
                          {property.is_active ? (
                            <XCircle className="h-4 w-4 text-red-600" />
                          ) : (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(property)}
                          title="Delete property"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Summary */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <div>
          Showing {filteredProperties.length} of {properties.length} properties
        </div>
        {searchQuery && (
          <div>
            Search results for: <span className="font-medium">"{searchQuery}"</span>
          </div>
        )}
      </div>
    </div>
  )
}
