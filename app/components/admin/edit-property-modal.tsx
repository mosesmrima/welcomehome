"use client"

import { useState, useEffect } from "react"
import { Card } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { TextArea } from "@/app/components/ui/textarea"
import { FileUpload } from "@/app/components/ui/file-upload"
import {
  X,
  Save,
  Loader2,
  CheckCircle,
  AlertTriangle,
  Image as ImageIcon,
  Trash2,
  Upload
} from "lucide-react"
import { usePropertyCRUD, PropertyData } from "@/app/lib/supabase/hooks/use-property-crud"
import { PropertyImageManager } from "./property-image-manager"
import Image from "next/image"

interface EditPropertyModalProps {
  property: PropertyData
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function EditPropertyModal({
  property,
  isOpen,
  onClose,
  onSuccess
}: EditPropertyModalProps) {
  const [formData, setFormData] = useState({
    name: property.name || '',
    symbol: property.symbol || '',
    location_city: property.location?.city || '',
    location_country: property.location?.country || '',
    location_address: property.location?.address || '',
    totalValue: property.total_value || '',
    maxTokens: property.max_tokens || '',
    propertyType: property.property_type || 'RESIDENTIAL',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const { updateProperty, addPropertyImage, removePropertyImage } = usePropertyCRUD()

  useEffect(() => {
    if (isOpen) {
      // Reset form when modal opens
      setFormData({
        name: property.name || '',
        symbol: property.symbol || '',
        location_city: property.location?.city || '',
        location_country: property.location?.country || '',
        location_address: property.location?.address || '',
        totalValue: property.total_value || '',
        maxTokens: property.max_tokens || '',
        propertyType: property.property_type || 'RESIDENTIAL',
      })
      setSubmitError('')
      setSubmitSuccess(false)
    }
  }, [isOpen, property])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError('')
    setSubmitSuccess(false)

    try {
      const updates: Partial<PropertyData> = {
        name: formData.name,
        symbol: formData.symbol,
        total_value: formData.totalValue,
        max_tokens: formData.maxTokens,
        property_type: formData.propertyType as PropertyData['property_type'],
        location: {
          city: formData.location_city,
          country: formData.location_country,
          address: formData.location_address,
        }
      }

      const result = await updateProperty(property.contract_address, updates)

      if (result.success) {
        setSubmitSuccess(true)
        setTimeout(() => {
          onSuccess?.()
          onClose()
        }, 1500)
      } else {
        setSubmitError(result.error || 'Failed to update property')
      }
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to update property')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageUploadSuccess = async (results: any[]) => {
    // Add uploaded images to property
    for (const result of results) {
      if (result.url) {
        await addPropertyImage(property.contract_address, result.url)
      }
    }
    onSuccess?.() // Refresh the list
  }

  const handleImageRemove = async (imageUrl: string) => {
    const result = await removePropertyImage(property.contract_address, imageUrl, true)
    if (result.success) {
      onSuccess?.() // Refresh the list
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Edit Property</h2>
              <p className="text-sm text-gray-600 mt-1">
                Update property details and manage images
              </p>
              <p className="text-xs text-gray-500 font-mono mt-1">
                {property.contract_address}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              disabled={isSubmitting}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Property Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Luxury Villa in Karen"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="symbol">Token Symbol</Label>
                  <Input
                    id="symbol"
                    name="symbol"
                    value={formData.symbol}
                    onChange={handleInputChange}
                    placeholder="e.g., VILLA"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="propertyType">Property Type</Label>
                  <select
                    id="propertyType"
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleInputChange}
                    className="w-full border rounded-md px-3 py-2 text-sm"
                  >
                    <option value="RESIDENTIAL">Residential</option>
                    <option value="COMMERCIAL">Commercial</option>
                    <option value="INDUSTRIAL">Industrial</option>
                    <option value="MIXED_USE">Mixed Use</option>
                    <option value="LAND">Land</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="totalValue">Total Property Value (USD)</Label>
                  <Input
                    id="totalValue"
                    name="totalValue"
                    type="number"
                    value={formData.totalValue}
                    onChange={handleInputChange}
                    placeholder="e.g., 1000000"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxTokens">Maximum Tokens</Label>
                  <Input
                    id="maxTokens"
                    name="maxTokens"
                    type="number"
                    value={formData.maxTokens}
                    onChange={handleInputChange}
                    placeholder="e.g., 10000"
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Location</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location_city">City</Label>
                  <Input
                    id="location_city"
                    name="location_city"
                    value={formData.location_city}
                    onChange={handleInputChange}
                    placeholder="e.g., Nairobi"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location_country">Country</Label>
                  <Input
                    id="location_country"
                    name="location_country"
                    value={formData.location_country}
                    onChange={handleInputChange}
                    placeholder="e.g., Kenya"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="location_address">Full Address</Label>
                  <Input
                    id="location_address"
                    name="location_address"
                    value={formData.location_address}
                    onChange={handleInputChange}
                    placeholder="e.g., 123 Karen Road, Karen, Nairobi"
                  />
                </div>
              </div>
            </div>

            {/* Property Images */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Images</h3>

              {/* Current Images */}
              {property.images && property.images.length > 0 && (
                <div className="mb-4">
                  <Label className="mb-2 block">Current Images</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {property.images.map((imageUrl, index) => (
                      <div key={index} className="relative group">
                        <div className="relative h-32 rounded-lg overflow-hidden bg-gray-100">
                          <Image
                            src={imageUrl}
                            alt={`Property image ${index + 1}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 50vw, 25vw"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleImageRemove(imageUrl)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                        {index === 0 && (
                          <div className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                            Primary
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload New Images */}
              <FileUpload
                bucket="property-images"
                pathPrefix={`properties/${property.contract_address}`}
                accept="image/*"
                multiple={true}
                maxFiles={10}
                onUploadSuccess={handleImageUploadSuccess}
                onUploadError={(error) => setSubmitError(error)}
              />
            </div>

            {/* Success/Error Messages */}
            {submitSuccess && (
              <Card className="p-4 bg-green-50 border-green-200">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <p className="text-green-800 font-medium">Property updated successfully!</p>
                </div>
              </Card>
            )}

            {submitError && (
              <Card className="p-4 bg-red-50 border-red-200">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <p className="text-red-800">{submitError}</p>
                </div>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || submitSuccess}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  )
}
