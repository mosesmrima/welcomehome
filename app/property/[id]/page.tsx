"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { formatUnits } from 'viem'
import { useAccount } from 'wagmi'
import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { Badge } from '@/app/components/ui/badge'
import { FractionalCalculator } from '@/app/components/marketplace/fractional-calculator'
import { WalletConnect } from '@/app/components/web3/wallet-connect'
import { MapPin, Building2, Calendar, DollarSign, ArrowLeft, Users, TrendingUp, AlertCircle } from 'lucide-react'
import { usePropertyFactory, PropertyInfo, PropertyType } from '@/app/lib/web3/hooks/use-property-factory'
import { usePrimaryTokenSale } from '@/app/lib/web3/hooks/use-token-handler'
import Image from 'next/image'
import Link from 'next/link'

// Property images mapping
const PROPERTY_IMAGES = [
  '/images/properties/house-1.jpg',
  '/images/properties/house-2.jpg',
  '/images/properties/house-3.jpg',
  '/images/properties/house-6.jpg',
  '/images/properties/house-7.jpg',
  '/images/properties/house-9.jpg',
  '/images/properties/house-10.jpg',
]

const PROPERTY_TYPE_LABELS = {
  [PropertyType.RESIDENTIAL]: 'Residential',
  [PropertyType.COMMERCIAL]: 'Commercial',
  [PropertyType.INDUSTRIAL]: 'Industrial',
  [PropertyType.MIXED_USE]: 'Mixed Use',
  [PropertyType.LAND]: 'Land',
}

export const dynamic = 'force-dynamic'

export default function PropertyDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { address, isConnected } = useAccount()
  const { properties, isLoading, error } = usePropertyFactory()
  const [selectedTokenAmount, setSelectedTokenAmount] = useState(1)
  const [selectedTotalPrice, setSelectedTotalPrice] = useState(0)
  const [showWalletPrompt, setShowWalletPrompt] = useState(false)

  const propertyId = parseInt(params.id as string)
  const property = properties.find(p => p.id === propertyId)

  const {
    buyTokens,
    isLoading: isPurchasing,
    isSuccess: isPurchaseSuccess,
    error: purchaseError
  } = usePrimaryTokenSale(property?.tokenContract)

  useEffect(() => {
    if (isPurchaseSuccess) {
      // Redirect to dashboard after successful purchase
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    }
  }, [isPurchaseSuccess, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading property details...</p>
        </div>
      </div>
    )
  }

  if (error || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Property Not Found</h2>
            <p className="text-gray-600 mb-4">
              {error || 'The property you are looking for does not exist.'}
            </p>
            <Link href="/">
              <Button>Back to Marketplace</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const totalValueUSD = formatUnits(property.totalValue, 18)
  const maxTokens = formatUnits(property.maxTokens, 18)
  const pricePerToken = parseFloat(totalValueUSD) / parseFloat(maxTokens)
  const createdDate = new Date(Number(property.createdAt) * 1000)
  const propertyImage = PROPERTY_IMAGES[property.id % PROPERTY_IMAGES.length]

  const handleTokenAmountChange = (amount: number, totalPrice: number) => {
    setSelectedTokenAmount(amount)
    setSelectedTotalPrice(totalPrice)
  }

  const handlePurchase = async () => {
    if (!isConnected) {
      setShowWalletPrompt(true)
      return
    }

    try {
      await buyTokens(BigInt(selectedTokenAmount))
    } catch (err) {
      console.error('Purchase failed:', err)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 text-gray-900 hover:text-gray-700">
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Back to Marketplace</span>
            </Link>
            {!isConnected && (
              <WalletConnect />
            )}
            {isConnected && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </span>
                <Link href="/dashboard">
                  <Button variant="outline" size="sm">Dashboard</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Property Details */}
          <div className="space-y-6">
            {/* Property Image */}
            <Card className="overflow-hidden">
              <div className="relative h-96">
                <Image
                  src={propertyImage}
                  alt={property.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge className="bg-white/90 text-gray-900 backdrop-blur-sm">
                    {PROPERTY_TYPE_LABELS[property.propertyType as PropertyType]}
                  </Badge>
                  <Badge variant={property.isActive ? "default" : "secondary"} className="bg-white/90 text-gray-900 backdrop-blur-sm">
                    {property.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h1 className="text-3xl font-bold text-white mb-2">{property.name}</h1>
                  <p className="text-white/90 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {property.location}
                  </p>
                </div>
              </div>
            </Card>

            {/* Property Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Property Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      Total Value
                    </p>
                    <p className="text-xl font-bold">${parseFloat(totalValueUSD).toLocaleString()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      Price per Token
                    </p>
                    <p className="text-xl font-bold">${pricePerToken.toFixed(2)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      Total Tokens
                    </p>
                    <p className="font-semibold">{parseFloat(maxTokens).toLocaleString()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Listed Date
                    </p>
                    <p className="font-semibold">{createdDate.toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Token Symbol</span>
                      <span className="font-medium">{property.symbol}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Contract Address</span>
                      <span className="font-mono text-xs">
                        {property.tokenContract.slice(0, 6)}...{property.tokenContract.slice(-4)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Creator</span>
                      <span className="font-mono text-xs">
                        {property.creator.slice(0, 6)}...{property.creator.slice(-4)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Calculator & Purchase */}
          <div className="space-y-6">
            {/* Fractional Calculator */}
            <FractionalCalculator
              totalValue={parseFloat(totalValueUSD)}
              maxTokens={parseFloat(maxTokens)}
              pricePerToken={pricePerToken}
              onTokenAmountChange={handleTokenAmountChange}
            />

            {/* Purchase Section */}
            <Card>
              <CardContent className="p-6 space-y-4">
                {!isConnected ? (
                  <div className="space-y-4">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-sm text-yellow-800 font-medium mb-2">
                        Connect Your Wallet
                      </p>
                      <p className="text-sm text-yellow-700">
                        You need to connect your wallet to purchase tokens from this property.
                      </p>
                    </div>
                    <WalletConnect />
                  </div>
                ) : isPurchaseSuccess ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-800 font-medium mb-2">Purchase Successful!</p>
                    <p className="text-sm text-green-700">
                      You have successfully purchased {selectedTokenAmount} tokens. Redirecting to your dashboard...
                    </p>
                  </div>
                ) : (
                  <>
                    <Button
                      onClick={handlePurchase}
                      disabled={isPurchasing || !property.isActive}
                      className="w-full h-12 text-lg font-semibold"
                      size="lg"
                    >
                      {isPurchasing ? (
                        <span className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Processing...
                        </span>
                      ) : (
                        `Purchase ${selectedTokenAmount} Tokens for $${selectedTotalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                      )}
                    </Button>

                    {purchaseError && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-sm text-red-800">
                          {purchaseError}
                        </p>
                      </div>
                    )}

                    <div className="text-xs text-gray-500 space-y-1">
                      <p>By purchasing, you agree to our terms and conditions.</p>
                      <p>All transactions are secured by blockchain technology.</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Benefits Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Why Invest in This Property?</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>Fractional ownership allows you to invest with as little as one token</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>Blockchain-secured transactions and ownership records</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>Potential for revenue distribution from property income</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>Trade tokens on the secondary marketplace</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
