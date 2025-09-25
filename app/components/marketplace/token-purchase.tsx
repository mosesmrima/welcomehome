"use client"

import { useState } from 'react'
import { Card } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { formatUnits, parseUnits } from 'viem'
import { useAccount } from 'wagmi'
import { useTokenSale, usePurchaseTokens } from '@/app/lib/web3/hooks/use-token-handler'
import { useTokenBalance } from '@/app/lib/web3/hooks/use-property-token'
import { useUserKYCStatus } from '@/app/lib/web3/hooks/use-kyc-registry'
import { Coins, TrendingUp, AlertCircle, CheckCircle, Building2, FileText } from 'lucide-react'
import { PropertyInfo } from '@/app/lib/web3/hooks/use-property-factory'

interface TokenPurchaseProps {
  selectedProperty?: PropertyInfo | null
}

export function TokenPurchase({ selectedProperty }: TokenPurchaseProps) {
  const [purchaseAmount, setPurchaseAmount] = useState('')
  const { address, isConnected } = useAccount()
  const { sale } = useTokenSale()
  const { purchaseTokens, isPending, isConfirming, isConfirmed, error } = usePurchaseTokens()
  const { balance, refetch: refetchBalance } = useTokenBalance(address)
  const { status, isApproved, isAccredited, record, canPurchase } = useUserKYCStatus(address)

  const handlePurchase = () => {
    if (!purchaseAmount || !sale) return

    try {
      const amount = parseUnits(purchaseAmount, 18) // Assuming 18 decimals
      purchaseTokens(amount)
    } catch (err) {
      console.error('Error purchasing tokens:', err)
    }
  }

  const calculateCost = () => {
    if (!purchaseAmount || !sale) return '0'
    try {
      const amount = parseUnits(purchaseAmount, 18)
      const cost = (amount * sale.pricePerToken) / BigInt(10**18)
      return formatUnits(cost, 18)
    } catch {
      return '0'
    }
  }

  const isValidAmount = () => {
    if (!purchaseAmount || !sale) return false
    try {
      const amount = parseUnits(purchaseAmount, 18)
      return amount >= sale.minPurchase && amount <= sale.maxPurchase
    } catch {
      return false
    }
  }

  if (!selectedProperty) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <Building2 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold mb-2">Select a Property</h3>
          <p className="text-gray-600">Choose a property from the browse tab to purchase tokens</p>
        </div>
      </Card>
    )
  }

  if (!isConnected) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <Coins className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">Connect your wallet to purchase tokens</p>
        </div>
      </Card>
    )
  }

  if (!canPurchase) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-orange-500" />
          <h3 className="text-lg font-semibold mb-2">KYC Verification Required</h3>
          <div className="space-y-3">
            {!isApproved && (
              <div className="text-gray-600">
                <p className="mb-2">Your KYC application status:</p>
                <div className="flex items-center justify-center gap-2 text-sm">
                  <span className="px-2 py-1 rounded-full bg-orange-100 text-orange-800">
                    {status === 0 ? 'Not Submitted' :
                     status === 1 ? 'Pending Review' :
                     status === 3 ? 'Denied' :
                     status === 4 ? 'Expired' : 'Unknown'}
                  </span>
                </div>
                {status === 0 && (
                  <p className="text-sm text-gray-500 mt-2">
                    Submit your KYC documents to start investing
                  </p>
                )}
                {status === 1 && (
                  <p className="text-sm text-gray-500 mt-2">
                    Your application is being reviewed by our team
                  </p>
                )}
                {status === 3 && record?.rejectionReason && (
                  <p className="text-sm text-red-600 mt-2">
                    Reason: {record.rejectionReason}
                  </p>
                )}
              </div>
            )}
            {isApproved && !isAccredited && (
              <div className="text-gray-600">
                <p className="mb-2">KYC approved, but accredited investor status required</p>
                <p className="text-sm text-gray-500">
                  Contact administrators for accredited investor verification
                </p>
              </div>
            )}
            <div className="mt-4">
              <Button
                variant="outline"
                className="w-full flex items-center gap-2"
                onClick={() => window.location.href = '/kyc'}
              >
                <FileText className="h-4 w-4" />
                {status === 0 ? 'Submit KYC Application' : 'View KYC Status'}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  if (!sale || !sale.isActive) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold mb-2">No Active Sale</h3>
          <p className="text-gray-600">There is no token sale currently active.</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Purchase Tokens</h3>
        <p className="text-gray-600">Buy property tokens directly from the primary sale</p>
      </div>

      {/* Selected Property Information */}
      <div className="bg-green-50 p-4 rounded-lg mb-6">
        <h4 className="font-medium text-green-900 mb-3">Selected Property</h4>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-green-700">Property:</span>
            <span className="font-medium text-green-900">{selectedProperty.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-green-700">Location:</span>
            <span className="font-medium text-green-900">{selectedProperty.location}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-green-700">Total Value:</span>
            <span className="font-medium text-green-900">
              ${parseFloat(formatUnits(selectedProperty.totalValue, 18)).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-green-700">Token Symbol:</span>
            <span className="font-medium text-green-900">{selectedProperty.symbol}</span>
          </div>
        </div>
      </div>

      {/* Sale Information */}
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <h4 className="font-medium text-blue-900 mb-3">Current Sale Details</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-blue-700">Price per Token:</span>
            <span className="font-medium text-blue-900">
              {sale.pricePerToken ? formatUnits(sale.pricePerToken, 18) : '0'} HBAR
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-700">Min Purchase:</span>
            <span className="font-medium text-blue-900">
              {sale.minPurchase ? formatUnits(sale.minPurchase, 18) : '0'} tokens
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-700">Max Purchase:</span>
            <span className="font-medium text-blue-900">
              {sale.maxPurchase ? formatUnits(sale.maxPurchase, 18) : '0'} tokens
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-700">Tokens Sold:</span>
            <span className="font-medium text-blue-900">
              {sale.totalSold ? formatUnits(sale.totalSold, 18) : '0'} / {sale.maxSupply ? formatUnits(sale.maxSupply, 18) : '∞'}
            </span>
          </div>
        </div>
      </div>

      {/* Purchase Form */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Tokens
          </label>
          <Input
            type="number"
            value={purchaseAmount}
            onChange={(e) => setPurchaseAmount(e.target.value)}
            placeholder="Enter amount"
            min="0"
            step="0.000000000000000001"
          />
          {purchaseAmount && !isValidAmount() && (
            <p className="text-red-500 text-sm mt-1">
              Amount must be between {sale.minPurchase ? formatUnits(sale.minPurchase, 18) : '0'} and {sale.maxPurchase ? formatUnits(sale.maxPurchase, 18) : '0'} tokens
            </p>
          )}
        </div>

        {/* Cost Calculation */}
        {purchaseAmount && isValidAmount() && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Total Cost:</span>
              <span className="font-semibold text-lg">{calculateCost()} HBAR</span>
            </div>
          </div>
        )}

        {/* Current Balance */}
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>Your Token Balance:</span>
          <span>{balance ? formatUnits(balance, 18) : '0'} tokens</span>
        </div>

        {/* Purchase Button */}
        <Button
          onClick={handlePurchase}
          disabled={!purchaseAmount || !isValidAmount() || isPending || isConfirming}
          className="w-full"
          size="lg"
        >
          {isPending ? 'Confirming...' :
           isConfirming ? 'Processing...' :
           'Purchase Tokens'}
        </Button>

        {/* Transaction Status */}
        {isConfirmed && (
          <div className="flex items-center gap-2 text-green-600 text-sm">
            <CheckCircle className="h-4 w-4" />
            <span>Purchase successful! Your tokens have been minted.</span>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 text-red-600 text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>Transaction failed. Please try again.</span>
          </div>
        )}
      </div>
    </Card>
  )
}