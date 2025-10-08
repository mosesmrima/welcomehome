"use client"

import { RevenueDashboard } from "@/app/components/revenue/revenue-dashboard"

// Disable static rendering for this page
export const dynamic = 'force-dynamic'

export default function RevenuePage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Revenue</h1>
        <p className="text-gray-600">
          Track property revenue distributions and claim your share of rental income and capital gains
        </p>
      </div>

      <RevenueDashboard />
    </div>
  )
}