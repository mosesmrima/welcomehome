"use client"

import { useState, useEffect } from 'react'
import { Card } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Badge } from '../ui/badge'
import { formatUnits, parseUnits, Address } from 'viem'
import { useAccount } from 'wagmi'
import {
  useMarketplaceListing,
  useNextListingId,
  useListTokens,
  usePurchaseFromMarketplace
} from '@/app/lib/web3/hooks/use-token-handler'
import { useTokenBalance } from '@/app/lib/web3/hooks/use-property-token'
import { ShoppingCart, Plus, User, Clock, Coins } from 'lucide-react'

interface MarketplaceListingsProps {
  showCreateListing?: boolean
}

export function MarketplaceListings({ showCreateListing = true }: MarketplaceListingsProps) {
  const { address, isConnected } = useAccount()
  const nextListingId = useNextListingId()
  const [selectedListing, setSelectedListing] = useState<number | null>(null)

  // Get recent listings (last 20)
  const recentListingIds = Array.from(
    { length: Math.min(Number(nextListingId), 20) },
    (_, i) => Number(nextListingId) - i - 1
  ).filter(id => id >= 0)

  return (
    <div className="space-y-6">
      {showCreateListing && <CreateListing />}

      <Card className="p-6">
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Marketplace Listings</h3>
          <p className="text-gray-600">Buy and sell property tokens with other investors</p>
        </div>

        <div className="space-y-4">
          {recentListingIds.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">No marketplace listings available</p>
            </div>
          ) : (
            recentListingIds.map((listingId) => (
              <ListingCard
                key={listingId}
                listingId={listingId}
                isSelected={selectedListing === listingId}
                onSelect={() => setSelectedListing(listingId)}
              />
            ))
          )}
        </div>
      </Card>
    </div>
  )
}

function CreateListing() {
  const [amount, setAmount] = useState('')
  const [price, setPrice] = useState('')
  const [showForm, setShowForm] = useState(false)
  const { address } = useAccount()
  const { balance } = useTokenBalance(address)
  const { listTokens, isPending, isConfirming, isConfirmed, error } = useListTokens()

  const handleCreateListing = () => {
    if (!amount || !price) return

    try {
      const tokenAmount = parseUnits(amount, 18)
      const pricePerToken = parseUnits(price, 18)
      listTokens(tokenAmount, pricePerToken)
    } catch (err) {
      console.error('Error creating listing:', err)
    }
  }

  const resetForm = () => {
    setAmount('')
    setPrice('')
    setShowForm(false)
  }

  useEffect(() => {
    if (isConfirmed) {
      resetForm()
    }
  }, [isConfirmed])

  if (!showForm) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Sell Your Tokens</h3>
            <p className="text-gray-600">Create a listing to sell your property tokens</p>
          </div>
          <Button onClick={() => setShowForm(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Listing
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Create Token Listing</h3>
        <p className="text-sm text-gray-600">
          Your Balance: {balance ? formatUnits(balance, 18) : '0'} tokens
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount to Sell
          </label>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter token amount"
            min="0"
            step="0.000000000000000001"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price per Token (HBAR)
          </label>
          <Input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Enter price in HBAR"
            min="0"
            step="0.000000000000000001"
          />
        </div>
      </div>

      {amount && price && (
        <div className="bg-gray-50 p-3 rounded-lg mb-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Total Value:</span>
            <span className="font-semibold">
              {(parseFloat(amount) * parseFloat(price)).toFixed(6)} HBAR
            </span>
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <Button
          onClick={handleCreateListing}
          disabled={!amount || !price || isPending || isConfirming}
          className="flex-1"
        >
          {isPending ? 'Confirming...' :
           isConfirming ? 'Creating...' :
           'Create Listing'}
        </Button>
        <Button
          onClick={resetForm}
          variant="outline"
        >
          Cancel
        </Button>
      </div>

      {error && (
        <p className="text-red-500 text-sm mt-2">
          Failed to create listing. Please try again.
        </p>
      )}
    </Card>
  )
}

interface ListingCardProps {
  listingId: number
  isSelected: boolean
  onSelect: () => void
}

function ListingCard({ listingId, isSelected, onSelect }: ListingCardProps) {
  const [purchaseAmount, setPurchaseAmount] = useState('')
  const { address } = useAccount()
  const { listing } = useMarketplaceListing(listingId)
  const { purchaseFromMarketplace, isPending, isConfirming, error } = usePurchaseFromMarketplace()

  const handlePurchase = () => {
    if (!purchaseAmount || !listing) return

    try {
      const amount = parseUnits(purchaseAmount, 18)
      purchaseFromMarketplace(BigInt(listingId), amount)
    } catch (err) {
      console.error('Error purchasing from marketplace:', err)
    }
  }

  const calculateCost = () => {
    if (!purchaseAmount || !listing) return '0'
    try {
      const amount = parseUnits(purchaseAmount, 18)
      const cost = (amount * listing.pricePerToken) / BigInt(10**18)
      return formatUnits(cost, 18)
    } catch {
      return '0'
    }
  }

  if (!listing || !listing.isActive) {
    return null
  }

  const isOwnListing = address?.toLowerCase() === listing.seller.toLowerCase()
  const maxPurchaseAmount = listing.amount

  return (
    <Card
      className={`p-4 cursor-pointer transition-colors ${
        isSelected ? 'ring-2 ring-blue-500' : 'hover:bg-gray-50'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <User className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <p className="font-medium">Listing #{listingId}</p>
            <p className="text-sm text-gray-600">
              Seller: {listing.seller.slice(0, 6)}...{listing.seller.slice(-4)}
            </p>
          </div>
        </div>

        <div className="text-right">
          <Badge variant={isOwnListing ? "secondary" : "default"}>
            {isOwnListing ? "Your Listing" : "Available"}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-3">
        <div>
          <p className="text-sm text-gray-600">Amount Available</p>
          <p className="font-semibold">{formatUnits(listing.amount, 18)} tokens</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Price per Token</p>
          <p className="font-semibold">{formatUnits(listing.pricePerToken, 18)} HBAR</p>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
        <Clock className="h-3 w-3" />
        <span>Listed {new Date(Number(listing.listingTime) * 1000).toLocaleDateString()}</span>
      </div>

      {isSelected && !isOwnListing && (
        <div className="border-t pt-4 space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount to Purchase
            </label>
            <Input
              type="number"
              value={purchaseAmount}
              onChange={(e) => setPurchaseAmount(e.target.value)}
              placeholder="Enter amount"
              min="0"
              max={formatUnits(maxPurchaseAmount, 18)}
              step="0.000000000000000001"
            />
          </div>

          {purchaseAmount && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Total Cost:</span>
                <span className="font-semibold">{calculateCost()} HBAR</span>
              </div>
            </div>
          )}

          <Button
            onClick={handlePurchase}
            disabled={!purchaseAmount || isPending || isConfirming}
            className="w-full gap-2"
          >
            <ShoppingCart className="h-4 w-4" />
            {isPending ? 'Confirming...' :
             isConfirming ? 'Processing...' :
             'Purchase Tokens'}
          </Button>

          {error && (
            <p className="text-red-500 text-sm">
              Purchase failed. Please try again.
            </p>
          )}
        </div>
      )}
    </Card>
  )
}