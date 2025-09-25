"use client"

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { CONTRACT_ADDRESSES } from '../config'
import { PROPERTY_TOKEN_HANDLER_ABI } from '../abi'
import { Address } from 'viem'

// Token Sale Hooks
export function useTokenSale() {
  const { data: saleData, refetch } = useReadContract({
    address: CONTRACT_ADDRESSES.PROPERTY_MANAGER as Address,
    abi: PROPERTY_TOKEN_HANDLER_ABI,
    functionName: 'currentSale',
  })

  return {
    sale: saleData ? {
      pricePerToken: saleData[0],
      minPurchase: saleData[1],
      maxPurchase: saleData[2],
      isActive: saleData[3],
      totalSold: saleData[4],
      maxSupply: saleData[5],
    } : null,
    refetch
  }
}

export function usePurchaseTokens() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  const purchaseTokens = (tokenAmount: bigint) => {
    writeContract({
      address: CONTRACT_ADDRESSES.PROPERTY_MANAGER as Address,
      abi: PROPERTY_TOKEN_HANDLER_ABI,
      functionName: 'purchaseTokens',
      args: [tokenAmount],
    })
  }

  return {
    purchaseTokens,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  }
}

// Marketplace Hooks
export function useMarketplaceListing(listingId: number) {
  const { data: listingData } = useReadContract({
    address: CONTRACT_ADDRESSES.PROPERTY_MANAGER as Address,
    abi: PROPERTY_TOKEN_HANDLER_ABI,
    functionName: 'marketplaceListings',
    args: [BigInt(listingId)],
  })

  return {
    listing: listingData ? {
      seller: listingData[0],
      amount: listingData[1],
      pricePerToken: listingData[2],
      listingTime: listingData[3],
      isActive: listingData[4],
    } : null
  }
}

export function useNextListingId() {
  const { data: nextId } = useReadContract({
    address: CONTRACT_ADDRESSES.PROPERTY_MANAGER as Address,
    abi: PROPERTY_TOKEN_HANDLER_ABI,
    functionName: 'nextListingId',
  })

  return nextId || 0n
}

export function useListTokens() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  const listTokens = (amount: bigint, pricePerToken: bigint) => {
    writeContract({
      address: CONTRACT_ADDRESSES.PROPERTY_MANAGER as Address,
      abi: PROPERTY_TOKEN_HANDLER_ABI,
      functionName: 'listTokensForSale',
      args: [amount, pricePerToken],
    })
  }

  return {
    listTokens,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  }
}

export function usePurchaseFromMarketplace() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  const purchaseFromMarketplace = (listingId: bigint, amount: bigint) => {
    writeContract({
      address: CONTRACT_ADDRESSES.PROPERTY_MANAGER as Address,
      abi: PROPERTY_TOKEN_HANDLER_ABI,
      functionName: 'purchaseFromMarketplace',
      args: [listingId, amount],
    })
  }

  return {
    purchaseFromMarketplace,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  }
}

// Staking Hooks
export function useStakingInfo(address?: Address) {
  const { data: stakingData, refetch } = useReadContract({
    address: CONTRACT_ADDRESSES.PROPERTY_MANAGER as Address,
    abi: PROPERTY_TOKEN_HANDLER_ABI,
    functionName: 'stakingInfo',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  })

  return {
    stakingInfo: stakingData ? {
      stakedAmount: stakingData[0],
      stakeTime: stakingData[1],
      lastRewardClaim: stakingData[2],
      totalRewards: stakingData[3],
    } : null,
    refetch
  }
}

export function useStakingRewards(address?: Address) {
  const { data: rewards } = useReadContract({
    address: CONTRACT_ADDRESSES.PROPERTY_MANAGER as Address,
    abi: PROPERTY_TOKEN_HANDLER_ABI,
    functionName: 'calculateStakingRewards',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  })

  return { rewards }
}

export function useStakeTokens() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  const stakeTokens = (amount: bigint) => {
    writeContract({
      address: CONTRACT_ADDRESSES.PROPERTY_MANAGER as Address,
      abi: PROPERTY_TOKEN_HANDLER_ABI,
      functionName: 'stakeTokens',
      args: [amount],
    })
  }

  return {
    stakeTokens,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  }
}

export function useUnstakeTokens() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  const unstakeTokens = (amount: bigint) => {
    writeContract({
      address: CONTRACT_ADDRESSES.PROPERTY_MANAGER as Address,
      abi: PROPERTY_TOKEN_HANDLER_ABI,
      functionName: 'unstakeTokens',
      args: [amount],
    })
  }

  return {
    unstakeTokens,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  }
}

// Revenue Distribution Hooks
export function usePropertyRevenue() {
  const { data: revenueData, refetch } = useReadContract({
    address: CONTRACT_ADDRESSES.PROPERTY_MANAGER as Address,
    abi: PROPERTY_TOKEN_HANDLER_ABI,
    functionName: 'propertyRevenue',
  })

  return {
    revenue: revenueData ? {
      totalRevenue: revenueData[0],
      distributedRevenue: revenueData[1],
      revenuePerToken: revenueData[2],
      lastDistribution: revenueData[3],
    } : null,
    refetch
  }
}

export function useClaimableRevenue(address?: Address) {
  const { data: claimableAmount, refetch } = useReadContract({
    address: CONTRACT_ADDRESSES.PROPERTY_MANAGER as Address,
    abi: PROPERTY_TOKEN_HANDLER_ABI,
    functionName: 'getClaimableRevenue',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  })

  return { claimableAmount, refetch }
}

export function useClaimRevenue() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  const claimRevenue = () => {
    writeContract({
      address: CONTRACT_ADDRESSES.PROPERTY_MANAGER as Address,
      abi: PROPERTY_TOKEN_HANDLER_ABI,
      functionName: 'claimRevenue',
    })
  }

  return {
    claimRevenue,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  }
}

// Access Control Hooks
export function useAccreditedStatus(address?: Address) {
  const { data: isAccredited } = useReadContract({
    address: CONTRACT_ADDRESSES.PROPERTY_MANAGER as Address,
    abi: PROPERTY_TOKEN_HANDLER_ABI,
    functionName: 'accreditedInvestors',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  })

  return { isAccredited }
}