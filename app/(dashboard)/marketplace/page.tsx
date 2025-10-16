"use client"

import { useState } from 'react'
import { TokenPurchase } from "@/app/components/marketplace/token-purchase"
import { PropertyBrowser } from "@/app/components/marketplace/property-browser"
import { PropertyDetails } from "@/app/components/marketplace/property-details"
import { InvestmentHighlight } from "@/app/components/marketplace/investment-highlight"
import { PropertyInfo } from '@/app/lib/web3/hooks/use-property-factory'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"

export default function MarketplacePage() {
  const [selectedProperty, setSelectedProperty] = useState<PropertyInfo | null>(null)
  const [activeTab, setActiveTab] = useState("browse")

  const handlePropertySelect = (property: PropertyInfo) => {
    setSelectedProperty(property)
    setActiveTab("purchase")
  }

  const handleStartInvesting = () => {
    setActiveTab("browse")
    // Scroll to properties section
    setTimeout(() => {
      const element = document.getElementById('property-browser')
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 100)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Marketplace</h1>
        <p className="text-gray-600">
          Browse properties and buy tokens in primary sales
        </p>
      </div>

      {/* Investment Highlight Section */}
      <InvestmentHighlight
        title="WHY INVEST IN REAL ESTATE WITH WELCOME HOME?"
        description="Investing in a fraction of a property through Welcome Home can be a smart way to build intergenerational wealth. The returns on the investment can be used to purchase additional properties in the future, helping to grow your real estate portfolio and increase financial stability."
        futureTitle="BUILDING GENERATIONAL WEALTH"
        futureDescription="Real estate is considered one of the most stable investments in the world, with a solid history of appreciation, governance and a growing middle class. Additionally, the market is experiencing an economic boom, driven in part by the expansion of the technology, agriculture, and tourism sectors.

Additionally, our platform has been working to provide access to premium properties and investment opportunities, improving infrastructure for wealth building and community empowerment. The abundance of investment opportunities in various regions presents a wealth of possibilities, making it an accessible investment option. With these factors in mind, investing in real estate through Welcome Home is a smart investment choice for anyone looking to build a future and create generational wealth for the African diaspora."
        image1="/images/properties/house-3.jpg"
        image2="/images/properties/house-6.jpg"
        onStartInvesting={handleStartInvesting}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="browse">Browse Properties</TabsTrigger>
          <TabsTrigger value="purchase">Token Purchase</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-6">
          <div id="property-browser">
            <PropertyBrowser onSelectProperty={handlePropertySelect} />
          </div>
        </TabsContent>

        <TabsContent value="purchase" className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <TokenPurchase selectedProperty={selectedProperty} />
            <PropertyDetails selectedProperty={selectedProperty} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}