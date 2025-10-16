"use client"

import { useState, useEffect } from 'react'
import { PropertyInfo } from '../web3/hooks/use-property-factory'

export interface UserPropertyPurchase {
  propertyId: number
  propertyName: string
  location: string
  coordinates?: string
  parcels: number // number of tokens purchased
  size: number // in sqft (from property data)
  price: number // total amount paid
  tokensPurchased: number // number of tokens
  purchaseDate: string
  image: string
  change: number // percentage change (can be updated)
}

const STORAGE_KEY = 'welcomehome_user_properties'

export function useUserProperties() {
  const [properties, setProperties] = useState<UserPropertyPurchase[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load properties from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        setProperties(parsed)
      }
    } catch (error) {
      console.error('Error loading user properties:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Save properties to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(properties))
      } catch (error) {
        console.error('Error saving user properties:', error)
      }
    }
  }, [properties, isLoading])

  const addProperty = (purchase: UserPropertyPurchase) => {
    setProperties(prev => {
      // Check if property already exists
      const existingIndex = prev.findIndex(p => p.propertyId === purchase.propertyId)

      if (existingIndex >= 0) {
        // Update existing property
        const updated = [...prev]
        updated[existingIndex] = {
          ...updated[existingIndex],
          parcels: updated[existingIndex].parcels + purchase.parcels,
          tokensPurchased: updated[existingIndex].tokensPurchased + purchase.tokensPurchased,
          price: updated[existingIndex].price + purchase.price,
          // Keep the original purchase date
          purchaseDate: updated[existingIndex].purchaseDate,
        }
        return updated
      } else {
        // Add new property
        return [...prev, purchase]
      }
    })
  }

  const updatePropertyChange = (propertyId: number, change: number) => {
    setProperties(prev =>
      prev.map(p =>
        p.propertyId === propertyId
          ? { ...p, change }
          : p
      )
    )
  }

  const removeProperty = (propertyId: number) => {
    setProperties(prev => prev.filter(p => p.propertyId !== propertyId))
  }

  const clearAllProperties = () => {
    setProperties([])
  }

  const getProperty = (propertyId: number) => {
    return properties.find(p => p.propertyId === propertyId)
  }

  const getTotalInvestment = () => {
    return properties.reduce((sum, p) => sum + p.price, 0)
  }

  const getTotalProperties = () => {
    return properties.length
  }

  return {
    properties,
    isLoading,
    addProperty,
    updatePropertyChange,
    removeProperty,
    clearAllProperties,
    getProperty,
    getTotalInvestment,
    getTotalProperties,
  }
}
