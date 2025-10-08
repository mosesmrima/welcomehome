"use client"

import { useState } from 'react'
import { TokenPurchase } from "@/app/components/marketplace/token-purchase"
import { MarketplaceListings } from "@/app/components/marketplace/marketplace-listings"
import { PropertyBrowser } from "@/app/components/marketplace/property-browser"
import { PropertyDetails } from "@/app/components/marketplace/property-details"
import { PropertyInfo } from '@/app/lib/web3/hooks/use-property-factory'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"

// Disable static rendering for this page
export const dynamic = 'force-dynamic'

export default function MarketplacePage() {
  const [selectedProperty, setSelectedProperty] = useState<PropertyInfo | null>(null)
  const [activeTab, setActiveTab] = useState("browse")

  const handlePropertySelect = (property: PropertyInfo) => {
    setSelectedProperty(property)
    setActiveTab("purchase")
  }

  return (
    <div className="p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Marketplace</h1>
        <p className="text-gray-600">
          Browse properties, buy tokens in primary sales, and trade with other investors
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="browse">Browse Properties</TabsTrigger>
          <TabsTrigger value="purchase">Token Purchase</TabsTrigger>
          <TabsTrigger value="listings">Secondary Market</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-6">
          <PropertyBrowser onSelectProperty={handlePropertySelect} />
        </TabsContent>

        <TabsContent value="purchase" className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <TokenPurchase selectedProperty={selectedProperty} />
            <PropertyDetails selectedProperty={selectedProperty} />
          </div>
        </TabsContent>

        <TabsContent value="listings" className="space-y-6">
          <MarketplaceListings />
        </TabsContent>
      </Tabs>
    </div>
  )
}