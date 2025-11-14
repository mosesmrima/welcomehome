"use client"


import { Search, Bell, Wallet, Home } from "lucide-react"

import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { useAccount } from "wagmi"
import { WalletConnect } from "../web3/wallet-connect"
import { NotificationBell } from "../ui/notifications"
import { useState, useEffect } from "react"

export function Header() {
  const { address, isConnected } = useAccount()
  const [showWalletModal, setShowWalletModal] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  return (
    <>
      <header className="flex h-16 items-center justify-between border-b bg-white px-6">
        {/* Page Title */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-600">
              <Home className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Welcome Home</h1>
              <p className="text-xs text-gray-500 -mt-1">International Group</p>
            </div>
          </div>
        </div>

        {/* Search and Actions */}
        <div className="flex items-center gap-4">
          {/* Search Bar */}
          <div className="relative w-96 hidden md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-600" />
            <Input
              type="search"
              placeholder="Search properties..."
              className="pl-10 pr-4"
            />
          </div>

          {/* Wallet Connection */}
          {mounted && (
            <>
              {isConnected && address ? (
                <Button
                  variant="outline"
                  onClick={() => setShowWalletModal(true)}
                  className="flex items-center gap-2"
                >
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <Wallet className="h-4 w-4" />
                  <span className="hidden sm:inline">{formatAddress(address)}</span>
                </Button>
              ) : (
                <Button
                  onClick={() => setShowWalletModal(true)}
                  className="flex items-center gap-2"
                >
                  <Wallet className="h-4 w-4" />
                  <span className="hidden sm:inline">Connect Wallet</span>
                </Button>
              )}
            </>
          )}

          {/* Real-time Notification Bell */}
          <NotificationBell />
        </div>
      </header>

      {/* Wallet Modal */}
      {showWalletModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-md w-full">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowWalletModal(false)}
              className="absolute -top-10 right-0 text-white hover:bg-white/10"
            >
              ×
            </Button>
            <WalletConnect />
          </div>
        </div>
      )}
    </>
  )
}