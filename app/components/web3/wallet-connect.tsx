"use client"

import { useState } from 'react'
import { useAccount, useConnect, useDisconnect, useEnsName } from 'wagmi'
import { Button } from '@/app/components/ui/button'
import { Card } from '@/app/components/ui/card'
import { Badge } from '@/app/components/ui/badge'
import { Wallet, Copy, ExternalLink, ChevronDown, Check } from 'lucide-react'
import { useUserRoles } from '@/app/lib/web3/hooks/use-roles'
import { useTokenBalance } from '@/app/lib/web3/hooks/use-property-token'

export function WalletConnect() {
  const { address, isConnected, chain } = useAccount()
  const { data: ensName } = useEnsName({ address })
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const [showConnectors, setShowConnectors] = useState(false)
  const [copied, setCopied] = useState(false)

  const { balance } = useTokenBalance(address)
  const roles = useUserRoles(address)

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const copyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (isConnected && address) {
    return (
      <Card className="p-4 bg-white border border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Wallet className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">
                {ensName || formatAddress(address)}
              </p>
              <p className="text-sm text-gray-500">
                Connected to {chain?.name || 'Unknown Network'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={copyAddress}
              className="h-8 px-2"
            >
              {copied ? (
                <Check className="h-3 w-3" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => disconnect()}
              className="h-8 px-3"
            >
              Disconnect
            </Button>
          </div>
        </div>

        {/* Token Balance */}
        <div className="mb-3 p-3 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Token Balance:</span>
            <span className="font-semibold text-gray-900">
              {balance ? Number(balance).toLocaleString() : '0'} tokens
            </span>
          </div>
        </div>

        {/* User Roles */}
        {roles.isManager && (
          <div className="flex flex-wrap gap-2">
            {roles.hasAdminRole && (
              <Badge variant="secondary" className="bg-red-50 text-red-700 border-red-200">
                Admin
              </Badge>
            )}
            {roles.hasMinterRole && (
              <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                Minter
              </Badge>
            )}
            {roles.hasPauserRole && (
              <Badge variant="secondary" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                Pauser
              </Badge>
            )}
            {roles.hasPropertyManagerRole && (
              <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                Property Manager
              </Badge>
            )}
          </div>
        )}
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="text-center mb-6">
        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
          <Wallet className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Connect Your Wallet
        </h3>
        <p className="text-gray-600 text-sm">
          Connect your wallet to start investing in tokenized real estate
        </p>
      </div>

      {!showConnectors ? (
        <Button
          onClick={() => setShowConnectors(true)}
          className="w-full"
          disabled={isPending}
        >
          Connect Wallet
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      ) : (
        <div className="space-y-3">
          {connectors.map((connector) => (
            <Button
              key={connector.uid}
              onClick={() => {
                connect({ connector })
                setShowConnectors(false)
              }}
              variant="outline"
              className="w-full justify-start"
              disabled={isPending}
            >
              <div className="flex items-center gap-3">
                <div className="h-6 w-6 rounded bg-gray-100"></div>
                <span>{connector.name}</span>
              </div>
            </Button>
          ))}
          <Button
            variant="ghost"
            onClick={() => setShowConnectors(false)}
            className="w-full"
          >
            Cancel
          </Button>
        </div>
      )}
    </Card>
  )
}