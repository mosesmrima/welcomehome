"use client"

import { useState } from 'react'
import { TokenPurchase } from "@/app/components/marketplace/token-purchase"
import { MarketplaceListings } from "@/app/components/marketplace/marketplace-listings"
import { PropertyBrowser } from "@/app/components/marketplace/property-browser"
import { PropertyInfo } from '@/app/lib/web3/hooks/use-property-factory'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"

export default function MarketplacePage() {
  const [selectedProperty, setSelectedProperty] = useState<PropertyInfo | null>(null)

  return (
    <div className="p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Marketplace</h1>
        <p className="text-gray-600">
          Browse properties, buy tokens in primary sales, and trade with other investors
        </p>
      </div>

      <Tabs defaultValue="browse" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="browse">Browse Properties</TabsTrigger>
          <TabsTrigger value="purchase">Token Purchase</TabsTrigger>
          <TabsTrigger value="listings">Secondary Market</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-6">
          <PropertyBrowser onSelectProperty={setSelectedProperty} />
        </TabsContent>

        <TabsContent value="purchase" className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <TokenPurchase selectedProperty={selectedProperty} />
            <div className="space-y-4">
              {selectedProperty && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Selected Property</h3>
                  <p className="text-blue-800">{selectedProperty.name}</p>
                  <p className="text-sm text-blue-600">{selectedProperty.location}</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="listings" className="space-y-6">
          <MarketplaceListings />
        </TabsContent>
      </Tabs>
    </div>
  )
}