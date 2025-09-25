"use client"

import { PortfolioOverview } from "@/app/components/dashboard/portfolio-overview"

export default function PropertiesPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">My Properties</h1>
        <p className="text-gray-600">
          View and manage your property token portfolio, track performance, and monitor investments
        </p>
      </div>

      <PortfolioOverview />
    </div>
  )
}