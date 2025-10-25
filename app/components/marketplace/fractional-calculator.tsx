"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/app/components/ui/card'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'
import { Slider } from '@/app/components/ui/slider'
import { Calculator, DollarSign, Percent } from 'lucide-react'

interface FractionalCalculatorProps {
  totalValue: number
  maxTokens: number
  pricePerToken: number
  availableTokens?: number
  onTokenAmountChange?: (amount: number, totalPrice: number) => void
  compact?: boolean
}

export function FractionalCalculator({
  totalValue,
  maxTokens,
  pricePerToken,
  availableTokens,
  onTokenAmountChange,
  compact = false
}: FractionalCalculatorProps) {
  const [tokenAmount, setTokenAmount] = useState(1)
  const maxAvailable = availableTokens || maxTokens

  const totalPrice = tokenAmount * pricePerToken
  const ownershipPercentage = (tokenAmount / maxTokens) * 100

  useEffect(() => {
    if (onTokenAmountChange) {
      onTokenAmountChange(tokenAmount, totalPrice)
    }
  }, [tokenAmount, totalPrice, onTokenAmountChange])

  const handleSliderChange = (value: number[]) => {
    setTokenAmount(Math.max(1, value[0]))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value)
    if (!isNaN(value) && value > 0 && value <= maxAvailable) {
      setTokenAmount(value)
    }
  }

  if (compact) {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="token-amount" className="text-sm font-medium flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            Select Tokens
          </Label>
          <div className="flex gap-2">
            <Input
              id="token-amount"
              type="number"
              value={tokenAmount}
              onChange={handleInputChange}
              min={1}
              max={maxAvailable}
              step={1}
              className="flex-1"
            />
            <div className="flex items-center px-3 py-2 bg-gray-50 rounded-md border min-w-[120px]">
              <span className="text-sm font-medium">
                ${totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
          <Slider
            value={[tokenAmount]}
            onValueChange={handleSliderChange}
            min={1}
            max={maxAvailable}
            step={1}
            className="mt-2"
          />
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 flex items-center gap-1">
            <Percent className="h-3 w-3" />
            Ownership
          </span>
          <span className="font-semibold">{ownershipPercentage.toFixed(2)}%</span>
        </div>
      </div>
    )
  }

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <Calculator className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Fractional Ownership Calculator</h3>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="token-input" className="text-sm text-gray-600">
                Number of Tokens
              </Label>
              <Input
                id="token-input"
                type="number"
                value={tokenAmount}
                onChange={handleInputChange}
                min={1}
                max={maxAvailable}
                step={1}
                className="text-lg font-semibold"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-sm text-gray-600">Available</Label>
              <div className="flex items-center h-10 px-3 py-2 bg-gray-50 rounded-md border">
                <span className="text-lg font-semibold">{maxAvailable.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>1</span>
              <span>{maxAvailable.toLocaleString()}</span>
            </div>
            <Slider
              value={[tokenAmount]}
              onValueChange={handleSliderChange}
              min={1}
              max={maxAvailable}
              step={1}
              className="w-full"
            />
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Price per Token
            </span>
            <span className="font-semibold">${pricePerToken.toFixed(2)}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600 flex items-center gap-2">
              <Percent className="h-4 w-4" />
              Ownership Percentage
            </span>
            <span className="font-semibold">{ownershipPercentage.toFixed(2)}%</span>
          </div>

          <div className="flex justify-between items-center pt-3 border-t">
            <span className="text-lg font-semibold">Total Investment</span>
            <span className="text-2xl font-bold text-blue-600">
              ${totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 text-sm text-gray-700">
          <p>
            You will own <span className="font-semibold">{ownershipPercentage.toFixed(2)}%</span> of this property,
            representing <span className="font-semibold">{tokenAmount.toLocaleString()}</span> tokens
            out of <span className="font-semibold">{maxTokens.toLocaleString()}</span> total.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
