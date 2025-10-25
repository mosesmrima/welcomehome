"use client"

import { useState } from "react"
import { Card } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Badge } from "@/app/components/ui/badge"
import { TextArea } from "@/app/components/ui/textarea"
import { Label } from "@/app/components/ui/label"
import { useAccount } from "wagmi"
import { formatUnits, parseUnits, Address } from "viem"
import {
  Shield,
  Users,
  Settings,
  Pause,
  Play,
  DollarSign,
  Lock,
  Unlock,
  UserCheck,
  UserX,
  AlertTriangle,
  CheckCircle,
  Coins,
  Building2,
  Plus
} from "lucide-react"

import { useUserRoles } from "@/app/lib/web3/hooks/use-roles"
import { usePropertyStatus, usePauseContract, useSetMaxTokens, useConnectProperty } from "@/app/lib/web3/hooks/use-property-token"
import { useAccreditedStatus } from "@/app/lib/web3/hooks/use-token-handler"
import { useMounted } from "@/app/lib/hooks/use-mounted"
import { usePropertyFactory, PropertyType } from "@/app/lib/web3/hooks/use-property-factory"
import { CONTRACT_ADDRESSES } from "@/app/lib/web3/config"

// Disable static rendering for this page
export const dynamic = 'force-dynamic'

export default function AdminPage() {
  const mounted = useMounted()
  const { address, isConnected } = useAccount()
  const roles = useUserRoles(address)

  if (!mounted) {
    return (
      <div className="p-6">
        <div className="max-w-md mx-auto text-center">
          <Shield className="h-16 w-16 mx-auto mb-4 text-gray-400 animate-pulse" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Loading...</h1>
          <p className="text-gray-600">Please wait while we load the admin panel</p>
        </div>
      </div>
    )
  }

  if (!isConnected) {
    return (
      <div className="p-6">
        <div className="max-w-md mx-auto text-center">
          <Shield className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Access Required</h1>
          <p className="text-gray-600">Please connect your wallet to access admin features</p>
        </div>
      </div>
    )
  }

  if (!roles.hasAdminRole && !roles.isManager) {
    return (
      <div className="p-6">
        <div className="max-w-md mx-auto text-center">
          <AlertTriangle className="h-16 w-16 mx-auto mb-4 text-red-500" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-4">
            You don't have administrator privileges to access this page.
          </p>
          <div className="text-sm text-gray-500">
            Required roles: Admin or Property Manager
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage smart contracts, users, and system settings</p>

        {/* Admin Role Badges */}
        <div className="flex flex-wrap gap-2 mt-4">
          {roles.hasAdminRole && (
            <Badge className="bg-red-50 text-red-700 border-red-200">
              <Shield className="h-3 w-3 mr-1" />
              Super Admin
            </Badge>
          )}
          {roles.hasPropertyManagerRole && (
            <Badge className="bg-blue-50 text-blue-700 border-blue-200">
              <Settings className="h-3 w-3 mr-1" />
              Property Manager
            </Badge>
          )}
          {roles.hasMinterRole && (
            <Badge className="bg-green-50 text-green-700 border-green-200">
              <Coins className="h-3 w-3 mr-1" />
              Token Minter
            </Badge>
          )}
          {roles.hasPauserRole && (
            <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200">
              <Pause className="h-3 w-3 mr-1" />
              Contract Pauser
            </Badge>
          )}
        </div>
      </div>

      {/* Property Creation - Full Width */}
      <PropertyCreation />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contract Management */}
        <ContractManagement />

        {/* User Management */}
        <UserManagement />

        {/* Property Management */}
        <PropertyManagement />

        {/* Revenue Management */}
        <RevenueManagement />
      </div>
    </div>
  )
}

function ContractManagement() {
  const propertyStatus = usePropertyStatus()
  const { pause, unpause, isPending: pausePending } = usePauseContract()

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-blue-100 p-2 rounded-lg">
          <Settings className="h-5 w-5 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold">Contract Management</h3>
      </div>

      <div className="space-y-4">
        {/* Contract Status */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium mb-3">Contract Status</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Property Initialized:</span>
              <Badge variant={propertyStatus.isInitialized ? "default" : "secondary"}>
                {propertyStatus.isInitialized ? 'Yes' : 'No'}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Contract Status:</span>
              <Badge variant={propertyStatus.isPaused ? "destructive" : "default"}>
                {propertyStatus.isPaused ? 'Paused' : 'Active'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Emergency Controls */}
        <div>
          <h4 className="font-medium mb-3">Emergency Controls</h4>
          <div className="flex gap-2">
            {propertyStatus.isPaused ? (
              <Button
                onClick={() => unpause()}
                disabled={pausePending}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <Play className="h-4 w-4 mr-2" />
                {pausePending ? 'Activating...' : 'Resume Contract'}
              </Button>
            ) : (
              <Button
                onClick={() => pause()}
                disabled={pausePending}
                variant="destructive"
                className="flex-1"
              >
                <Pause className="h-4 w-4 mr-2" />
                {pausePending ? 'Pausing...' : 'Pause Contract'}
              </Button>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Pausing will halt all token transfers and operations
          </p>
        </div>
      </div>
    </Card>
  )
}

function UserManagement() {
  const [userAddress, setUserAddress] = useState('')
  const [checkAddress, setCheckAddress] = useState<Address>()

  const { isAccredited } = useAccreditedStatus(checkAddress)

  const handleCheckUser = () => {
    if (userAddress && userAddress.startsWith('0x') && userAddress.length === 42) {
      setCheckAddress(userAddress as Address)
    }
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-green-100 p-2 rounded-lg">
          <Users className="h-5 w-5 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold">User Management</h3>
      </div>

      <div className="space-y-4">
        {/* User Lookup */}
        <div>
          <h4 className="font-medium mb-3">Check User Status</h4>
          <div className="flex gap-2">
            <Input
              placeholder="0x... user address"
              value={userAddress}
              onChange={(e) => setUserAddress(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleCheckUser} variant="outline">
              Check
            </Button>
          </div>

          {checkAddress && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Accredited Status:</span>
                <Badge variant={isAccredited ? "default" : "secondary"}>
                  {isAccredited ? (
                    <>
                      <UserCheck className="h-3 w-3 mr-1" />
                      Accredited
                    </>
                  ) : (
                    <>
                      <UserX className="h-3 w-3 mr-1" />
                      Not Accredited
                    </>
                  )}
                </Badge>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div>
          <h4 className="font-medium mb-3">Quick Actions</h4>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" className="justify-start">
              <UserCheck className="h-4 w-4 mr-2" />
              Grant Access
            </Button>
            <Button variant="outline" size="sm" className="justify-start">
              <UserX className="h-4 w-4 mr-2" />
              Revoke Access
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}

function PropertyManagement() {
  const [newMaxSupply, setNewMaxSupply] = useState('')
  const [propertyAddress, setPropertyAddress] = useState('')
  const [transactionId, setTransactionId] = useState('')

  const { setMaxTokens, isPending: setMaxPending } = useSetMaxTokens()
  const { connectProperty, isPending: connectPending } = useConnectProperty()

  const handleSetMaxSupply = () => {
    if (!newMaxSupply) return
    try {
      const amount = parseUnits(newMaxSupply, 18)
      setMaxTokens(amount)
      setNewMaxSupply('')
    } catch (err) {
      console.error('Error setting max supply:', err)
    }
  }

  const handleConnectProperty = () => {
    if (!propertyAddress || !transactionId) return
    connectProperty(propertyAddress as Address, transactionId)
    setPropertyAddress('')
    setTransactionId('')
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-purple-100 p-2 rounded-lg">
          <Settings className="h-5 w-5 text-purple-600" />
        </div>
        <h3 className="text-lg font-semibold">Property Management</h3>
      </div>

      <div className="space-y-4">
        {/* Max Supply Management */}
        <div>
          <h4 className="font-medium mb-3">Token Supply Control</h4>
          <div className="flex gap-2">
            <Input
              placeholder="New max supply"
              value={newMaxSupply}
              onChange={(e) => setNewMaxSupply(e.target.value)}
              type="number"
              className="flex-1"
            />
            <Button
              onClick={handleSetMaxSupply}
              disabled={!newMaxSupply || setMaxPending}
            >
              {setMaxPending ? 'Setting...' : 'Set Max'}
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Set maximum number of tokens that can be minted
          </p>
        </div>

        {/* Property Connection */}
        <div>
          <h4 className="font-medium mb-3">Connect Property</h4>
          <div className="space-y-2">
            <Input
              placeholder="Property contract address"
              value={propertyAddress}
              onChange={(e) => setPropertyAddress(e.target.value)}
            />
            <Input
              placeholder="Transaction ID"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
            />
            <Button
              onClick={handleConnectProperty}
              disabled={!propertyAddress || !transactionId || connectPending}
              className="w-full"
            >
              {connectPending ? 'Connecting...' : 'Connect Property'}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}

function RevenueManagement() {
  const [revenueAmount, setRevenueAmount] = useState('')

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-emerald-100 p-2 rounded-lg">
          <DollarSign className="h-5 w-5 text-emerald-600" />
        </div>
        <h3 className="text-lg font-semibold">Revenue Management</h3>
      </div>

      <div className="space-y-4">
        {/* Revenue Distribution */}
        <div>
          <h4 className="font-medium mb-3">Distribute Revenue</h4>
          <div className="flex gap-2">
            <Input
              placeholder="Revenue amount (HBAR)"
              value={revenueAmount}
              onChange={(e) => setRevenueAmount(e.target.value)}
              type="number"
              step="0.01"
              className="flex-1"
            />
            <Button disabled>
              Distribute
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Distribute property revenue to all token holders
          </p>
        </div>

        {/* Revenue Stats */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium mb-3">Revenue Statistics</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Distributed:</span>
              <span className="font-medium">0 HBAR</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Last Distribution:</span>
              <span className="text-sm text-gray-500">Never</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

function PropertyCreation() {
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    location: '',
    totalValue: '',
    maxTokens: '',
    propertyType: '0', // RESIDENTIAL
  })
  const [isCreating, setIsCreating] = useState(false)
  const [createSuccess, setCreateSuccess] = useState(false)
  const [createError, setCreateError] = useState('')

  const { deployProperty } = usePropertyFactory()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCreateProperty = async () => {
    if (!formData.name || !formData.symbol || !formData.location || !formData.totalValue || !formData.maxTokens) {
      setCreateError('Please fill in all fields')
      return
    }

    setIsCreating(true)
    setCreateError('')
    setCreateSuccess(false)

    try {
      const propertyType = parseInt(formData.propertyType) as PropertyType
      const paymentToken = CONTRACT_ADDRESSES.PAYMENT_TOKEN as Address

      await deployProperty(
        formData.name,
        formData.symbol,
        '', // ipfsHash - empty for now, could be added later
        formData.totalValue,
        formData.maxTokens,
        propertyType,
        formData.location,
        paymentToken,
        '1' // creation fee in HBAR
      )

      setCreateSuccess(true)
      // Reset form
      setFormData({
        name: '',
        symbol: '',
        location: '',
        totalValue: '',
        maxTokens: '',
        propertyType: '0',
      })
    } catch (err: any) {
      setCreateError(err.message || 'Failed to create property')
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-indigo-100 p-2 rounded-lg">
          <Building2 className="h-5 w-5 text-indigo-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Create New Property</h3>
          <p className="text-sm text-gray-600">Add a new property to the marketplace</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Property Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="e.g., Luxury Villa in Karen"
            value={formData.name}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="symbol">Token Symbol</Label>
          <Input
            id="symbol"
            name="symbol"
            placeholder="e.g., VILLA"
            value={formData.symbol}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            name="location"
            placeholder="e.g., Karen, Nairobi"
            value={formData.location}
            onChange={handleInputChange}
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
            <option value="0">Residential</option>
            <option value="1">Commercial</option>
            <option value="2">Industrial</option>
            <option value="3">Mixed Use</option>
            <option value="4">Land</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="totalValue">Total Property Value (USD)</Label>
          <Input
            id="totalValue"
            name="totalValue"
            type="number"
            placeholder="e.g., 1000000"
            value={formData.totalValue}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="maxTokens">Maximum Tokens</Label>
          <Input
            id="maxTokens"
            name="maxTokens"
            type="number"
            placeholder="e.g., 10000"
            value={formData.maxTokens}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="mt-6">
        <Button
          onClick={handleCreateProperty}
          disabled={isCreating}
          className="w-full md:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          {isCreating ? 'Creating Property...' : 'Create Property'}
        </Button>
      </div>

      {createSuccess && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 text-green-800">
            <CheckCircle className="h-5 w-5" />
            <p className="font-medium">Property created successfully!</p>
          </div>
        </div>
      )}

      {createError && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 text-red-800">
            <AlertTriangle className="h-5 w-5" />
            <p className="font-medium">{createError}</p>
          </div>
        </div>
      )}
    </Card>
  )
}