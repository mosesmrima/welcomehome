"use client"

import { useState, useCallback } from 'react'
import { supabase } from '../client'
import { PropertyInsert, Property } from '../types'
import { uploadFile, getPublicUrl } from '../storage'
import { useAccount } from 'wagmi'

export interface PropertyWithImages extends Omit<Property, 'images'> {
  images: string[] // Array of public URLs
}

// Helper function to safely parse images from database
function parseImages(images: any): string[] {
  if (!images) return []
  if (Array.isArray(images)) return images
  if (typeof images === 'string') {
    try {
      const parsed = JSON.parse(images)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }
  if (typeof images === 'object' && images !== null) {
    // Handle case where images might be stored as object like {0: "url1", 1: "url2"}
    return Object.values(images).filter(v => typeof v === 'string')
  }
  return []
}

export function usePropertyManagement() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { address } = useAccount()

  // Create a new property entry
  const createProperty = useCallback(async (
    propertyData: Omit<PropertyInsert, 'id' | 'created_at'>,
    imageFiles?: File[]
  ): Promise<PropertyWithImages | null> => {
    if (!address || !supabase) return null

    setIsLoading(true)
    setError(null)

    try {
      let imageUrls: string[] = []

      // First check if images are already provided as URLs in propertyData
      if (propertyData.images && Array.isArray(propertyData.images)) {
        imageUrls = propertyData.images
        console.log('🖼️ Using pre-uploaded images from propertyData:', imageUrls)
      }

      // Then handle file uploads if provided (this would override the above)
      if (imageFiles && imageFiles.length > 0) {
        console.log('📤 Uploading new image files...')
        imageUrls = [] // Reset to use only the new uploads
        for (let i = 0; i < imageFiles.length; i++) {
          const file = imageFiles[i]
          const timestamp = Date.now()
          const extension = file.name.split('.').pop()
          const fileName = `properties/${propertyData.contract_address}/${timestamp}-${i}.${extension}`

          const uploadResult = await uploadFile(file, 'property-images', fileName)
          if (uploadResult.success && uploadResult.url) {
            imageUrls.push(uploadResult.url)
            console.log(`✅ Uploaded image ${i + 1}: ${uploadResult.url}`)
          }
        }
      }

      console.log('💾 Saving property with images:', imageUrls)

      // Create property record
      const { data: property, error: createError } = await supabase
        .from('properties')
        .insert({
          ...propertyData,
          images: imageUrls.length > 0 ? imageUrls : null,
        })
        .select()
        .single()

      if (createError) throw createError

      console.log('✅ Property saved successfully with images:', property.images)

      return {
        ...property,
        images: parseImages(property.images || imageUrls),
      }
    } catch (err) {
      console.error('Error creating property:', err)
      setError(err instanceof Error ? err.message : 'Failed to create property')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [address])

  // Update property metadata
  const updateProperty = useCallback(async (
    contractAddress: string,
    updates: Partial<PropertyInsert>,
    newImageFiles?: File[]
  ): Promise<PropertyWithImages | null> => {
    if (!supabase) return null

    setIsLoading(true)
    setError(null)

    try {
      let imageUrls: string[] = []

      // Check if images are provided in the updates object
      if (updates.images && Array.isArray(updates.images)) {
        imageUrls = updates.images
        console.log('🖼️ Using images from updates:', imageUrls)
      } else {
        // Get existing property to preserve current images
        const { data: existingProperty } = await supabase
          .from('properties')
          .select('images')
          .eq('contract_address', contractAddress.toLowerCase())
          .single()

        if (existingProperty?.images) {
          imageUrls = parseImages(existingProperty.images)
          console.log('📋 Preserving existing images:', imageUrls)
        }
      }

      // Upload new images if provided (this would append to existing)
      if (newImageFiles && newImageFiles.length > 0) {
        console.log('📤 Uploading new image files...')
        for (let i = 0; i < newImageFiles.length; i++) {
          const file = newImageFiles[i]
          const timestamp = Date.now()
          const extension = file.name.split('.').pop()
          const fileName = `properties/${contractAddress}/${timestamp}-${i}.${extension}`

          const uploadResult = await uploadFile(file, 'property-images', fileName)
          if (uploadResult.success && uploadResult.url) {
            imageUrls.push(uploadResult.url)
            console.log(`✅ Uploaded image ${i + 1}: ${uploadResult.url}`)
          }
        }
      }

      console.log('💾 Updating property with images:', imageUrls)

      // Update property record
      const { data: property, error: updateError } = await supabase
        .from('properties')
        .update({
          ...updates,
          images: imageUrls.length > 0 ? imageUrls : null,
        })
        .eq('contract_address', contractAddress.toLowerCase())
        .select()
        .single()

      if (updateError) throw updateError

      console.log('✅ Property updated successfully with images:', property.images)

      return {
        ...property,
        images: parseImages(property.images || imageUrls),
      }
    } catch (err) {
      console.error('Error updating property:', err)
      setError(err instanceof Error ? err.message : 'Failed to update property')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Get property by contract address
  const getProperty = useCallback(async (
    contractAddress: string
  ): Promise<PropertyWithImages | null> => {
    if (!supabase) return null

    try {
      console.log('🗄️ SUPABASE QUERY for:', contractAddress.toLowerCase())

      const { data: property, error } = await supabase
        .from('properties')
        .select('*')
        .eq('contract_address', contractAddress.toLowerCase())
        .single()

      console.log('🗄️ QUERY RESULT:', property ? 'FOUND' : 'NOT FOUND')
      if (property) {
        console.log('🗄️ Raw images from DB:', property.images)
        console.log('🗄️ Parsed images:', parseImages(property.images))
      }
      if (error) {
        console.log('🗄️ Query error:', error)
      }

      if (error) throw error

      return {
        ...property,
        images: parseImages(property.images),
      }
    } catch (err) {
      console.error('Error fetching property:', err)
      return null
    }
  }, [])

  // List all properties
  const listProperties = useCallback(async (): Promise<PropertyWithImages[]> => {
    if (!supabase) return []

    try {
      const { data: properties, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      return properties.map(property => ({
        ...property,
        images: parseImages(property.images),
      }))
    } catch (err) {
      console.error('Error listing properties:', err)
      return []
    }
  }, [])

  // Delete property
  const deleteProperty = useCallback(async (
    contractAddress: string
  ): Promise<boolean> => {
    if (!supabase) return false

    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('contract_address', contractAddress.toLowerCase())

      if (error) throw error

      return true
    } catch (err) {
      console.error('Error deleting property:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete property')
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    createProperty,
    updateProperty,
    getProperty,
    listProperties,
    deleteProperty,
    isLoading,
    error,
  }
}