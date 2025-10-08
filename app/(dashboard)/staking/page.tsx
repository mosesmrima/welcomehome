"use client"

import { StakingDashboard } from "@/app/components/staking/staking-dashboard"

// Disable static rendering for this page
export const dynamic = 'force-dynamic'

export default function StakingPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Staking</h1>
        <p className="text-gray-600">
          Stake your property tokens to earn rewards and participate in property governance
        </p>
      </div>

      <StakingDashboard />
    </div>
  )
}