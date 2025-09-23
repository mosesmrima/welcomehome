"use client"

import { useState } from "react"
import { Card } from "@/app/components/ui/card"
import { Input } from "@/app/components/ui/input"
import { Button } from "@/app/components/ui/button"
import { Badge } from "@/app/components/ui/badge"
import { formatCurrency } from "@/app/lib/utils"
import { Search, Filter, MapPin, TrendingUp, TrendingDown, Activity } from "lucide-react"

// Mock transaction data
const mockTransactions = [
  {
    id: 1,
    time: "11:32 AM",
    property: "Sunset Villa Complex",
    location: "Westlands, Nairobi",
    type: "Purchase",
    tokens: 2500,
    amount: 125000,
    status: "Completed",
    transactionId: "TX001234",
    propertyImage: "/property-1.jpg"
  },
  {
    id: 2,
    time: "09:15 AM",
    property: "Ocean View Apartments",
    location: "Kilifi, Coast",
    type: "Purchase",
    tokens: 1800,
    amount: 90000,
    status: "Completed",
    transactionId: "TX001235",
    propertyImage: "/property-2.jpg"
  },
  {
    id: 3,
    time: "08:45 AM",
    property: "Garden Heights",
    location: "Karen, Nairobi",
    type: "Sale",
    tokens: 500,
    amount: 35000,
    status: "Pending",
    transactionId: "TX001236",
    propertyImage: "/property-3.jpg"
  },
]

const yesterdayTransactions = [
  {
    id: 4,
    time: "03:22 PM",
    property: "Riverside Mall",
    location: "Riverside Drive, Nairobi",
    type: "Purchase",
    tokens: 3200,
    amount: 180000,
    status: "Completed",
    transactionId: "TX001237",
    propertyImage: "/property-4.jpg"
  },
  {
    id: 5,
    time: "10:15 AM",
    property: "Tech Hub Plaza",
    location: "Ngong Road, Nairobi",
    type: "Purchase",
    tokens: 1500,
    amount: 75000,
    status: "Completed",
    transactionId: "TX001238",
    propertyImage: "/property-5.jpg"
  },
]

export default function TransactionsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="flex h-full flex-col lg:flex-row">
      <div className="flex-1 p-4 md:p-6 overflow-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Transactions</h1>
          <p className="text-gray-600">Track all your property transactions and investment activities</p>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-500/20 p-2 rounded-lg">
                <Activity className="h-5 w-5" />
              </div>
              <TrendingUp className="h-4 w-4 opacity-60" />
            </div>
            <p className="text-blue-100 text-sm font-medium mb-1">Total Transactions</p>
            <h3 className="text-3xl font-bold">18</h3>
          </Card>

          <Card className="bg-gradient-to-br from-purple-600 to-purple-700 p-6 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-500/20 p-2 rounded-lg">
                <TrendingDown className="h-5 w-5" />
              </div>
              <Activity className="h-4 w-4 opacity-60" />
            </div>
            <p className="text-purple-100 text-sm font-medium mb-1">Total Invested</p>
            <h3 className="text-3xl font-bold">{formatCurrency(15000)}</h3>
          </Card>

          <Card className="bg-gradient-to-br from-green-600 to-green-700 p-6 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-500/20 p-2 rounded-lg">
                <TrendingUp className="h-5 w-5" />
              </div>
              <Activity className="h-4 w-4 opacity-60" />
            </div>
            <p className="text-green-100 text-sm font-medium mb-1">Portfolio Value</p>
            <h3 className="text-3xl font-bold">+{formatCurrency(1500)}</h3>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <Input
              type="search"
              placeholder="Search transactions by property, amount, or status..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 h-12 text-base border-gray-200 focus:border-primary focus:ring-primary/20"
            />
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="h-12 px-6 border-gray-200 hover:bg-gray-50">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
            <Button variant="outline" className="h-12 px-6 border-gray-200 hover:bg-gray-50">
              Export
            </Button>
          </div>
        </div>

        {/* Transactions List */}
        <Card className="overflow-hidden border-0 shadow-sm">
          <div className="divide-y divide-gray-100">
            {/* Today's Transactions */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Today</h3>
                  <p className="text-sm text-gray-500">September 23, 2024</p>
                </div>
                <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                  {mockTransactions.length} transactions
                </Badge>
              </div>
              <div className="space-y-4">
                {mockTransactions.map((tx) => (
                  <TransactionItem key={tx.id} transaction={tx} />
                ))}
              </div>
            </div>

            {/* Yesterday's Transactions */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Yesterday</h3>
                  <p className="text-sm text-gray-500">September 22, 2024</p>
                </div>
                <Badge variant="secondary" className="bg-gray-50 text-gray-700 border-gray-200">
                  {yesterdayTransactions.length} transactions
                </Badge>
              </div>
              <div className="space-y-4">
                {yesterdayTransactions.map((tx) => (
                  <TransactionItem key={tx.id} transaction={tx} />
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Map Sidebar */}
      <div className="w-full lg:w-80 xl:w-96 border-l-0 lg:border-l border-t lg:border-t-0 bg-gray-50/30 p-4 md:p-6 overflow-y-auto lg:max-h-screen">
        {/* Property Map */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Location</h3>
          <div className="rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 h-48 flex items-center justify-center border border-blue-100">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-blue-800">Interactive Map</p>
              <p className="text-xs text-blue-600">Coming Soon</p>
            </div>
          </div>
        </div>

        {/* Selected Transaction Details */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Sunset Villa Complex</h3>
              <p className="text-sm text-gray-500">Westlands, Nairobi</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Transaction Summary</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Transaction ID</span>
                  <span className="text-sm font-mono text-gray-900">TX001234</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Type</span>
                  <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                    Purchase
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Tokens</span>
                  <span className="text-sm font-semibold text-gray-900">2,500 tokens</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Amount</span>
                  <span className="text-lg font-bold text-gray-900">{formatCurrency(125000)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Date & Time</span>
                  <span className="text-sm text-gray-900">Sep 23, 2024 at 11:32 AM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Status</span>
                  <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                    Completed
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button className="flex-1 bg-primary hover:bg-primary/90">
                View Receipt
              </Button>
              <Button variant="outline" className="flex-1 border-gray-200 hover:bg-gray-50">
                Share
              </Button>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-6">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Recent Activity</h4>
          <div className="space-y-2">
            <div className="text-xs text-gray-600 bg-white rounded-lg p-3 border border-gray-100">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                <span className="font-medium">Transaction Completed</span>
              </div>
              <p>Payment processed successfully</p>
              <p className="text-gray-500 mt-1">2 minutes ago</p>
            </div>
            <div className="text-xs text-gray-600 bg-white rounded-lg p-3 border border-gray-100">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                <span className="font-medium">Tokens Transferred</span>
              </div>
              <p>2,500 tokens added to wallet</p>
              <p className="text-gray-500 mt-1">5 minutes ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function TransactionItem({ transaction }: { transaction: any }) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'failed':
        return 'bg-red-50 text-red-700 border-red-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getTypeIcon = (type: string) => {
    return type === 'Purchase' ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : (
      <TrendingDown className="h-4 w-4 text-blue-600" />
    )
  }

  return (
    <div className="flex items-center gap-4 rounded-xl border border-gray-100 p-4 hover:bg-gray-50/50 hover:border-gray-200 transition-all cursor-pointer">
      {/* Property Image Placeholder */}
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 shrink-0">
        <div className="flex h-6 w-6 items-center justify-center rounded bg-white/80">
          {getTypeIcon(transaction.type)}
        </div>
      </div>

      {/* Transaction Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between mb-1">
          <h4 className="font-semibold text-gray-900 truncate pr-2">
            {transaction.property}
          </h4>
          <div className="text-right shrink-0">
            <p className="font-semibold text-lg text-gray-900">
              {transaction.type === 'Purchase' ? '-' : '+'}{formatCurrency(transaction.amount)}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 md:gap-3 text-sm text-gray-500 flex-wrap">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="truncate max-w-32 md:max-w-none">{transaction.location}</span>
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="whitespace-nowrap">{transaction.tokens.toLocaleString()} tokens</span>
            <span className="hidden sm:inline">•</span>
            <span className="whitespace-nowrap">{transaction.time}</span>
          </div>

          <Badge variant="secondary" className={`text-xs font-medium shrink-0 ${getStatusColor(transaction.status)}`}>
            {transaction.status}
          </Badge>
        </div>
      </div>
    </div>
  )
}