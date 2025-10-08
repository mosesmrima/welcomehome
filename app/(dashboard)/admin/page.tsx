"use client"

import { useState } from "react"
import { Card } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Badge } from "@/app/components/ui/badge"
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
  Coins
} from "lucide-react"

import { useUserRoles } from "@/app/lib/web3/hooks/use-roles"
import { usePropertyStatus, usePauseContract, useSetMaxTokens, useConnectProperty } from "@/app/lib/web3/hooks/use-property-token"
import { useAccreditedStatus } from "@/app/lib/web3/hooks/use-token-handler"
import { useMounted } from "@/app/lib/hooks/use-mounted"

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