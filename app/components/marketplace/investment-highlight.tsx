"use client"

import { Button } from '@/app/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'

interface InvestmentHighlightProps {
  title: string
  description: string
  futureTitle: string
  futureDescription: string
  image1: string
  image2: string
  onStartInvesting?: () => void
}

export function InvestmentHighlight({
  title = "WHY INVEST IN REAL ESTATE?",
  description = "Investing in a fraction of a property through Welcome Home can be a smart way to build intergenerational wealth. The returns on the investment can be used to purchase additional properties in the future, helping to grow your real estate portfolio and increase financial stability.",
  futureTitle = "BUILDING GENERATIONAL WEALTH",
  futureDescription = "Real estate is considered one of the most stable investments in the world, with a solid history of appreciation, governance and a growing middle class. Additionally, the market is experiencing an economic boom, driven in part by the expansion of the technology, agriculture, fishing, and mining sectors. \n\nAdditionally, the government has been working heavily in the construction of new roads, improving infrastructure for the advancement of agriculture and other industries. The abundance of land in various regions presents a wealth of opportunities, making it an affordable investment option. With these factors in mind, investing in land through Welcome Home is a smart investment choice for anyone looking to build a future in real estate.",
  image1 = "/images/properties/house-1.jpg",
  image2 = "/images/properties/house-2.jpg",
  onStartInvesting
}: InvestmentHighlightProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-8 space-y-8">
      {/* Header Section */}
      <div className="space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
          {title}
        </h2>
        <p className="text-gray-600 text-base leading-relaxed max-w-4xl">
          {description}
        </p>
      </div>

      {/* Images Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative h-64 md:h-80 rounded-lg overflow-hidden shadow-md">
          <Image
            src={image1}
            alt="Investment opportunity 1"
            fill
            className="object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="relative h-64 md:h-80 rounded-lg overflow-hidden shadow-md">
          <Image
            src={image2}
            alt="Investment opportunity 2"
            fill
            className="object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>
      </div>

      {/* Future Section */}
      <div className="border-t pt-8 space-y-6">
        <div className="flex flex-col md:flex-row gap-6 md:gap-12">
          <div className="md:w-1/3">
            <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
              {futureTitle}
            </h3>
            <Button
              onClick={onStartInvesting}
              className="group"
              size="lg"
            >
              Start Investing
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <div className="md:w-2/3">
            <div className="text-gray-600 text-base leading-relaxed space-y-4">
              {futureDescription.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
