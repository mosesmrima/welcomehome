"use client"

import { useState, useEffect, useCallback } from 'react'
import { usePublicClient, useWalletClient, useAccount } from 'wagmi'
import { Address, parseEther, formatUnits } from 'viem'
import { CONTRACT_ADDRESSES } from '../config'
import { logError } from '../error-utils'

// Property Factory ABI - Add to your abi.ts file
const PROPERTY_FACTORY_ABI = [
  {
    "inputs": [],
    "name": "propertyCount",
    "outputs": [{"type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"type": "uint256"}],
    "name": "properties",
    "outputs": [
      {"type": "address", "name": "tokenContract"},
      {"type": "address", "name": "handlerContract"},
      {"type": "string", "name": "name"},
      {"type": "string", "name": "symbol"},
      {"type": "string", "name": "ipfsHash"},
      {"type": "uint256", "name": "totalValue"},
      {"type": "uint256", "name": "maxTokens"},
      {"type": "address", "name": "creator"},
      {"type": "uint256", "name": "createdAt"},
      {"type": "bool", "name": "isActive"},
      {"type": "uint8", "name": "propertyType"},
      {"type": "string", "name": "location"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"type": "uint256"},
      {"type": "uint256"}
    ],
    "name": "getPropertyList",
    "outputs": [
      {
        "components": [
          {"type": "address", "name": "tokenContract"},
          {"type": "address", "name": "handlerContract"},
          {"type": "string", "name": "name"},
          {"type": "string", "name": "symbol"},
          {"type": "string", "name": "ipfsHash"},
          {"type": "uint256", "name": "totalValue"},
          {"type": "uint256", "name": "maxTokens"},
          {"type": "address", "name": "creator"},
          {"type": "uint256", "name": "createdAt"},
          {"type": "bool", "name": "isActive"},
          {"type": "uint8", "name": "propertyType"},
          {"type": "string", "name": "location"}
        ],
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"type": "string", "name": "_name"},
      {"type": "string", "name": "_symbol"},
      {"type": "string", "name": "_ipfsHash"},
      {"type": "uint256", "name": "_totalValue"},
      {"type": "uint256", "name": "_maxTokens"},
      {"type": "uint8", "name": "_propertyType"},
      {"type": "string", "name": "_location"},
      {"type": "address", "name": "_paymentToken"}
    ],
    "name": "deployProperty",
    "outputs": [{"type": "uint256"}],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{"type": "uint256"}],
    "name": "verifyProperty",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getActiveProperties",
    "outputs": [
      {
        "components": [
          {"type": "address", "name": "tokenContract"},
          {"type": "address", "name": "handlerContract"},
          {"type": "string", "name": "name"},
          {"type": "string", "name": "symbol"},
          {"type": "string", "name": "ipfsHash"},
          {"type": "uint256", "name": "totalValue"},
          {"type": "uint256", "name": "maxTokens"},
          {"type": "address", "name": "creator"},
          {"type": "uint256", "name": "createdAt"},
          {"type": "bool", "name": "isActive"},
          {"type": "uint8", "name": "propertyType"},
          {"type": "string", "name": "location"}
        ],
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const

export interface PropertyInfo {
  id: number
  tokenContract: Address
  handlerContract: Address
  name: string
  symbol: string
  ipfsHash: string
  totalValue: bigint
  maxTokens: bigint
  creator: Address
  createdAt: bigint
  isActive: boolean
  propertyType: number
  location: string
}

export enum PropertyType {
  RESIDENTIAL = 0,
  COMMERCIAL = 1,
  INDUSTRIAL = 2,
  MIXED_USE = 3,
  LAND = 4
}

export function usePropertyFactory() {
  const [properties, setProperties] = useState<PropertyInfo[]>([])
  const [propertyCount, setPropertyCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const publicClient = usePublicClient()
  const { data: walletClient } = useWalletClient()
  const { address } = useAccount()

  // Fetch all properties from factory
  const fetchProperties = useCallback(async () => {
    if (!publicClient) return

    setIsLoading(true)
    setError(null)

    try {
      // First check if factory contract is deployed
      const factoryAddress = CONTRACT_ADDRESSES.PROPERTY_FACTORY as Address
      if (!factoryAddress || factoryAddress === '0x0000000000000000000000000000000000000000') {
        throw new Error('Property Factory contract not deployed yet')
      }

      // Get total property count
      const count = await publicClient.readContract({
        address: factoryAddress,
        abi: PROPERTY_FACTORY_ABI,
        functionName: 'propertyCount',
      }) as bigint

      const totalCount = Number(count)
      setPropertyCount(totalCount)

      if (totalCount === 0) {
        setProperties([])
        return
      }

      // Get all properties in batches to avoid RPC limits
      const batchSize = 10
      const allProperties: PropertyInfo[] = []

      for (let i = 0; i < totalCount; i += batchSize) {
        const end = Math.min(i + batchSize, totalCount)

        try {
          const propertiesBatch = await publicClient.readContract({
            address: factoryAddress,
            abi: PROPERTY_FACTORY_ABI,
            functionName: 'getPropertyList',
            args: [BigInt(i), BigInt(end - i)],
          }) as any[]

          const formattedBatch = propertiesBatch.map((prop, index) => ({
            id: i + index,
            tokenContract: prop.tokenContract,
            handlerContract: prop.handlerContract,
            name: prop.name,
            symbol: prop.symbol,
            ipfsHash: prop.ipfsHash,
            totalValue: prop.totalValue,
            maxTokens: prop.maxTokens,
            creator: prop.creator,
            createdAt: prop.createdAt,
            isActive: prop.isActive,
            propertyType: prop.propertyType,
            location: prop.location,
          }))

          allProperties.push(...formattedBatch)
        } catch (batchError) {
          console.warn(`Failed to fetch properties batch ${i}-${end}:`, batchError)
        }
      }

      setProperties(allProperties)

    } catch (err) {
      logError('Error fetching properties from factory', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch properties')
    } finally {
      setIsLoading(false)
    }
  }, [publicClient])

  // Get active properties only
  const fetchActiveProperties = useCallback(async () => {
    if (!publicClient) return []

    try {
      const factoryAddress = CONTRACT_ADDRESSES.PROPERTY_FACTORY as Address
      if (!factoryAddress) return []

      const activeProperties = await publicClient.readContract({
        address: factoryAddress,
        abi: PROPERTY_FACTORY_ABI,
        functionName: 'getActiveProperties',
      }) as any[]

      return activeProperties.map((prop, index) => ({
        id: index, // This would be the actual property ID in a real implementation
        tokenContract: prop.tokenContract,
        handlerContract: prop.handlerContract,
        name: prop.name,
        symbol: prop.symbol,
        ipfsHash: prop.ipfsHash,
        totalValue: prop.totalValue,
        maxTokens: prop.maxTokens,
        creator: prop.creator,
        createdAt: prop.createdAt,
        isActive: prop.isActive,
        propertyType: prop.propertyType,
        location: prop.location,
      }))
    } catch (err) {
      logError('Error fetching active properties', err)
      return []
    }
  }, [publicClient])

  // Deploy new property
  const deployProperty = useCallback(async (
    name: string,
    symbol: string,
    ipfsHash: string,
    totalValue: string, // in USD
    maxTokens: string,
    propertyType: PropertyType,
    location: string,
    paymentToken: Address,
    creationFee: string = "1" // in HBAR
  ) => {
    if (!walletClient || !address) {
      throw new Error('Wallet not connected')
    }

    try {
      const factoryAddress = CONTRACT_ADDRESSES.PROPERTY_FACTORY as Address
      if (!factoryAddress) {
        throw new Error('Property Factory contract not deployed')
      }

      const tx = await walletClient.writeContract({
        address: factoryAddress,
        abi: PROPERTY_FACTORY_ABI,
        functionName: 'deployProperty',
        args: [
          name,
          symbol,
          ipfsHash,
          parseEther(totalValue), // Convert USD to wei representation
          parseEther(maxTokens),
          propertyType,
          location,
          paymentToken
        ],
        value: parseEther(creationFee), // Property creation fee
      })

      // Wait for transaction confirmation
      if (publicClient) {
        await publicClient.waitForTransactionReceipt({ hash: tx })
      }

      // Refresh properties list
      await fetchProperties()

      return tx
    } catch (err) {
      logError('Error deploying property', err)
      throw err
    }
  }, [walletClient, address, publicClient, fetchProperties])

  // Verify property (admin only)
  const verifyProperty = useCallback(async (propertyId: number) => {
    if (!walletClient || !address) {
      throw new Error('Wallet not connected')
    }

    try {
      const factoryAddress = CONTRACT_ADDRESSES.PROPERTY_FACTORY as Address
      if (!factoryAddress) {
        throw new Error('Property Factory contract not deployed')
      }

      const tx = await walletClient.writeContract({
        address: factoryAddress,
        abi: PROPERTY_FACTORY_ABI,
        functionName: 'verifyProperty',
        args: [BigInt(propertyId)],
      })

      if (publicClient) {
        await publicClient.waitForTransactionReceipt({ hash: tx })
      }

      // Refresh properties list
      await fetchProperties()

      return tx
    } catch (err) {
      logError('Error verifying property', err)
      throw err
    }
  }, [walletClient, address, publicClient, fetchProperties])

  // Get property by ID
  const getProperty = useCallback((propertyId: number): PropertyInfo | null => {
    return properties.find(p => p.id === propertyId) || null
  }, [properties])

  // Initialize
  useEffect(() => {
    fetchProperties()
  }, [fetchProperties])

  return {
    properties,
    propertyCount,
    isLoading,
    error,
    fetchProperties,
    fetchActiveProperties,
    deployProperty,
    verifyProperty,
    getProperty,
  }
}