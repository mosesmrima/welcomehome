"use client"

import { useState, useCallback, useEffect } from 'react'
import { supabase } from '../client'
import { Address } from 'viem'
import { deleteFile } from '../storage'

export interface PropertyData {
  id?: string
  property_id?: number
  contract_address: string
  handler_address?: string
  factory_address?: string
  name: string
  symbol: string
  ipfs_hash?: string
  total_value?: string
  max_tokens?: string
  location?: {
    address?: string
    city?: string
    country?: string
    coordinates?: { lat: number; lng: number }
  }
  property_type?: 'RESIDENTIAL' | 'COMMERCIAL' | 'INDUSTRIAL' | 'MIXED_USE' | 'LAND'
  creator_address: string
  is_active?: boolean
  is_verified?: boolean
  images?: string[] // Array of image URLs
  documents?: any[]
  metadata?: any
  created_at?: string
  updated_at?: string
}

export interface PropertyDocument {
  id?: string
  property_id: number
  document_type: string
  filename: string
  ipfs_hash: string
  file_size?: number
  mime_type?: string
  verified?: boolean
  uploaded_by?: string
  uploaded_at?: string
}

export function usePropertyCRUD() {
  const [properties, setProperties] = useState<PropertyData[]>([])
  const [selectedProperty, setSelectedProperty] = useState<PropertyData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // CREATE: Add new property to database
  const createProperty = useCallback(async (propertyData: PropertyData): Promise<{ success: boolean; data?: PropertyData; error?: string }> => {
    setIsLoading(true)
    setError(null)

    try {
      const { data, error: insertError } = await supabase
        .from('properties')
        .insert({
          contract_address: propertyData.contract_address.toLowerCase(),
          handler_address: propertyData.handler_address?.toLowerCase(),
          factory_address: propertyData.factory_address?.toLowerCase(),
          name: propertyData.name,
          symbol: propertyData.symbol,
          ipfs_hash: propertyData.ipfs_hash || null,
          total_value: propertyData.total_value,
          max_tokens: propertyData.max_tokens,
          location: propertyData.location || null,
          property_type: propertyData.property_type || 'RESIDENTIAL',
          creator_address: propertyData.creator_address.toLowerCase(),
          is_active: propertyData.is_active !== undefined ? propertyData.is_active : true,
          is_verified: propertyData.is_verified || false,
          metadata: {
            ...(propertyData.metadata || {}),
            images: propertyData.images || [],
            documents: propertyData.documents || [],
          }
        })
        .select()
        .single()

      if (insertError) {
        setError(insertError.message)
        return { success: false, error: insertError.message }
      }

      // Refresh property list
      await fetchAllProperties()

      return { success: true, data: data as PropertyData }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create property'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }, [])

  // READ: Fetch all properties
  const fetchAllProperties = useCallback(async (filters?: {
    is_active?: boolean
    property_type?: string
    creator_address?: string
  }) => {
    setIsLoading(true)
    setError(null)

    try {
      let query = supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false })

      // Apply filters
      if (filters?.is_active !== undefined) {
        query = query.eq('is_active', filters.is_active)
      }
      if (filters?.property_type) {
        query = query.eq('property_type', filters.property_type)
      }
      if (filters?.creator_address) {
        query = query.eq('creator_address', filters.creator_address.toLowerCase())
      }

      const { data, error: fetchError } = await query

      if (fetchError) {
        setError(fetchError.message)
        return []
      }

      // Parse metadata to extract images
      const propertiesWithImages = (data || []).map(prop => ({
        ...prop,
        images: prop.metadata?.images || [],
        documents: prop.metadata?.documents || []
      }))

      setProperties(propertiesWithImages)
      return propertiesWithImages
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch properties'
      setError(errorMessage)
      return []
    } finally {
      setIsLoading(false)
    }
  }, [])

  // READ: Fetch single property by contract address
  const fetchPropertyByAddress = useCallback(async (contractAddress: string): Promise<PropertyData | null> => {
    setIsLoading(true)
    setError(null)

    try {
      const { data, error: fetchError } = await supabase
        .from('properties')
        .select('*')
        .eq('contract_address', contractAddress.toLowerCase())
        .single()

      if (fetchError) {
        setError(fetchError.message)
        return null
      }

      const propertyWithImages = {
        ...data,
        images: data.metadata?.images || [],
        documents: data.metadata?.documents || []
      }

      setSelectedProperty(propertyWithImages)
      return propertyWithImages
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch property'
      setError(errorMessage)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  // READ: Fetch property by ID
  const fetchPropertyById = useCallback(async (propertyId: number): Promise<PropertyData | null> => {
    setIsLoading(true)
    setError(null)

    try {
      const { data, error: fetchError } = await supabase
        .from('properties')
        .select('*')
        .eq('property_id', propertyId)
        .single()

      if (fetchError) {
        setError(fetchError.message)
        return null
      }

      const propertyWithImages = {
        ...data,
        images: data.metadata?.images || [],
        documents: data.metadata?.documents || []
      }

      setSelectedProperty(propertyWithImages)
      return propertyWithImages
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch property'
      setError(errorMessage)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  // UPDATE: Update property details
  const updateProperty = useCallback(async (
    contractAddress: string,
    updates: Partial<PropertyData>
  ): Promise<{ success: boolean; data?: PropertyData; error?: string }> => {
    setIsLoading(true)
    setError(null)

    try {
      // Prepare update payload
      const updatePayload: any = {}

      if (updates.name) updatePayload.name = updates.name
      if (updates.symbol) updatePayload.symbol = updates.symbol
      if (updates.ipfs_hash !== undefined) updatePayload.ipfs_hash = updates.ipfs_hash
      if (updates.total_value !== undefined) updatePayload.total_value = updates.total_value
      if (updates.max_tokens !== undefined) updatePayload.max_tokens = updates.max_tokens
      if (updates.location !== undefined) updatePayload.location = updates.location
      if (updates.property_type) updatePayload.property_type = updates.property_type
      if (updates.is_active !== undefined) updatePayload.is_active = updates.is_active
      if (updates.is_verified !== undefined) updatePayload.is_verified = updates.is_verified

      // Handle metadata updates (images, documents, etc.)
      if (updates.images || updates.documents || updates.metadata) {
        // Fetch current metadata
        const { data: currentData } = await supabase
          .from('properties')
          .select('metadata')
          .eq('contract_address', contractAddress.toLowerCase())
          .single()

        const currentMetadata = currentData?.metadata || {}

        updatePayload.metadata = {
          ...currentMetadata,
          ...(updates.metadata || {}),
          images: updates.images || currentMetadata.images || [],
          documents: updates.documents || currentMetadata.documents || []
        }
      }

      const { data, error: updateError } = await supabase
        .from('properties')
        .update(updatePayload)
        .eq('contract_address', contractAddress.toLowerCase())
        .select()
        .single()

      if (updateError) {
        setError(updateError.message)
        return { success: false, error: updateError.message }
      }

      // Refresh property list
      await fetchAllProperties()

      const updatedProperty = {
        ...data,
        images: data.metadata?.images || [],
        documents: data.metadata?.documents || []
      }

      return { success: true, data: updatedProperty }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update property'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }, [fetchAllProperties])

  // UPDATE: Add image to property
  const addPropertyImage = useCallback(async (
    contractAddress: string,
    imageUrl: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      // Fetch current images
      const { data: currentData } = await supabase
        .from('properties')
        .select('metadata')
        .eq('contract_address', contractAddress.toLowerCase())
        .single()

      const currentMetadata = currentData?.metadata || {}
      const currentImages = currentMetadata.images || []

      // Add new image
      const updatedImages = [...currentImages, imageUrl]

      return await updateProperty(contractAddress, { images: updatedImages })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add image'
      return { success: false, error: errorMessage }
    }
  }, [updateProperty])

  // UPDATE: Remove image from property
  const removePropertyImage = useCallback(async (
    contractAddress: string,
    imageUrl: string,
    deleteFromStorage = true
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      // Fetch current images
      const { data: currentData } = await supabase
        .from('properties')
        .select('metadata')
        .eq('contract_address', contractAddress.toLowerCase())
        .single()

      const currentMetadata = currentData?.metadata || {}
      const currentImages = currentMetadata.images || []

      // Remove image from array
      const updatedImages = currentImages.filter((img: string) => img !== imageUrl)

      // Delete from storage if requested
      if (deleteFromStorage && imageUrl.includes('supabase')) {
        // Extract path from URL
        const urlParts = imageUrl.split('/storage/v1/object/public/property-images/')
        if (urlParts.length > 1) {
          const path = urlParts[1]
          await deleteFile('property-images', path)
        }
      }

      return await updateProperty(contractAddress, { images: updatedImages })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove image'
      return { success: false, error: errorMessage }
    }
  }, [updateProperty])

  // DELETE: Soft delete property (set is_active = false)
  const deleteProperty = useCallback(async (
    contractAddress: string,
    permanent = false
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)
    setError(null)

    try {
      if (permanent) {
        // Hard delete - remove from database
        const { error: deleteError } = await supabase
          .from('properties')
          .delete()
          .eq('contract_address', contractAddress.toLowerCase())

        if (deleteError) {
          setError(deleteError.message)
          return { success: false, error: deleteError.message }
        }
      } else {
        // Soft delete - set is_active = false
        const result = await updateProperty(contractAddress, { is_active: false })
        if (!result.success) {
          return result
        }
      }

      // Refresh property list
      await fetchAllProperties()

      return { success: true }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete property'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }, [updateProperty, fetchAllProperties])

  // Activate/Deactivate property
  const togglePropertyStatus = useCallback(async (
    contractAddress: string,
    isActive: boolean
  ): Promise<{ success: boolean; error?: string }> => {
    return await updateProperty(contractAddress, { is_active: isActive })
  }, [updateProperty])

  return {
    // State
    properties,
    selectedProperty,
    isLoading,
    error,

    // CRUD Operations
    createProperty,
    fetchAllProperties,
    fetchPropertyByAddress,
    fetchPropertyById,
    updateProperty,
    deleteProperty,
    togglePropertyStatus,

    // Image Management
    addPropertyImage,
    removePropertyImage,

    // Utility
    setSelectedProperty,
  }
}
