"use client"

import { useState, useEffect } from "react"
import { Card } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Badge } from "@/app/components/ui/badge"
import { useAccount } from "wagmi"
import { useMounted } from "@/app/lib/hooks/use-mounted"
import { formatUnits } from "viem"
import {
  Vote,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  Users,
  TrendingUp,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  Calendar,
  Building2,
  Filter
} from "lucide-react"

import { useTokenBalance } from "@/app/lib/web3/hooks/use-property-token"
import { useMultiPropertyData } from "@/app/lib/web3/hooks/use-multi-property-data"
import {
  usePropertyGovernance,
  ProposalType,
  ProposalStatus,
  VoteSupport,
  type Proposal
} from "@/app/lib/web3/hooks/use-property-governance"

// Disable static rendering for this page
export const dynamic = 'force-dynamic'

export default function GovernancePage() {
  const mounted = useMounted()
  const { address, isConnected } = useAccount()

  if (!mounted) {
    return (
      <div className="p-6">
        <div className="max-w-md mx-auto text-center">
          <Vote className="h-16 w-16 mx-auto mb-4 text-gray-400 animate-pulse" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Loading Governance...</h1>
        </div>
      </div>
    )
  }

  const { balance } = useTokenBalance(address)
  const { properties, isLoading: propertiesLoading } = useMultiPropertyData()
  const {
    proposals,
    isLoading: proposalsLoading,
    createProposal,
    vote,
    getPropertyProposals,
    getProposalTypeLabel,
    getProposalStatusLabel
  } = usePropertyGovernance()

  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(null)
  const [showCreateProposal, setShowCreateProposal] = useState(false)
  const [filteredProposals, setFilteredProposals] = useState<Proposal[]>([])
  const [statusFilter, setStatusFilter] = useState<string>('all')

  // Filter proposals by selected property and status
  useEffect(() => {
    let filtered = proposals

    if (selectedPropertyId !== null) {
      filtered = proposals.filter(p => p.propertyId === selectedPropertyId)
    }

    if (statusFilter !== 'all') {
      const statusValue = {
        'pending': ProposalStatus.PENDING,
        'active': ProposalStatus.ACTIVE,
        'succeeded': ProposalStatus.SUCCEEDED,
        'defeated': ProposalStatus.DEFEATED,
        'executed': ProposalStatus.EXECUTED,
        'expired': ProposalStatus.EXPIRED
      }[statusFilter]

      if (statusValue !== undefined) {
        filtered = filtered.filter(p => p.status === statusValue)
      }
    }

    setFilteredProposals(filtered)
  }, [proposals, selectedPropertyId, statusFilter])

  if (!isConnected) {
    return (
      <div className="p-6">
        <div className="max-w-md mx-auto text-center">
          <Vote className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Governance</h1>
          <p className="text-gray-600">Connect your wallet to participate in governance</p>
        </div>
      </div>
    )
  }

  const votingPower = balance ? parseFloat(formatUnits(balance, 18)) : 0
  const selectedProperty = selectedPropertyId !== null ? properties.find(p => p.id === selectedPropertyId) : null

  return (
    <div className="p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Property Governance</h1>
        <p className="text-gray-600">
          Participate in property-specific governance by creating and voting on proposals
        </p>
      </div>

      {/* Property Selector */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Select Property</h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-gray-600" />
              <span className="text-sm text-gray-600">{properties.length} properties</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            onClick={() => setSelectedPropertyId(null)}
            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
              selectedPropertyId === null
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <Building2 className="h-8 w-8 text-gray-600" />
              <div>
                <h4 className="font-semibold">All Properties</h4>
                <p className="text-sm text-gray-600">View all proposals</p>
              </div>
            </div>
          </div>

          {properties.map((property) => (
            <div
              key={property.id}
              onClick={() => setSelectedPropertyId(property.id)}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedPropertyId === property.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <Building2 className="h-8 w-8 text-blue-600" />
                <div>
                  <h4 className="font-semibold">{property.name}</h4>
                  <p className="text-sm text-gray-600">{property.symbol}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Voting Power Card */}
      <Card className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold mb-2">Your Voting Power</h3>
            <p className="text-3xl font-bold">{votingPower.toLocaleString()}</p>
            <p className="text-blue-100">
              {selectedProperty ? `${selectedProperty.symbol} Tokens held` : 'Total tokens held'}
            </p>
          </div>
          <div className="text-right">
            <Vote className="h-12 w-12 mb-2 opacity-80" />
            <p className="text-sm text-blue-100">
              1 Token = 1 Vote
            </p>
          </div>
        </div>
      </Card>

      {/* Create Proposal */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Create New Proposal</h3>
          <Button
            onClick={() => setShowCreateProposal(!showCreateProposal)}
            className="gap-2"
            disabled={!selectedProperty}
          >
            <Plus className="h-4 w-4" />
            New Proposal
          </Button>
        </div>

        {!selectedProperty && (
          <div className="text-center py-4">
            <AlertCircle className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p className="text-gray-600">Select a property to create proposals</p>
          </div>
        )}

        {showCreateProposal && selectedProperty && (
          <CreateProposalForm
            propertyId={selectedProperty.id}
            onSubmit={createProposal}
            onCancel={() => setShowCreateProposal(false)}
          />
        )}
      </Card>

      {/* Proposals */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">
            {selectedProperty ? `${selectedProperty.name} Proposals` : 'All Proposals'}
          </h3>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-600" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="active">Active</option>
              <option value="succeeded">Succeeded</option>
              <option value="defeated">Defeated</option>
              <option value="executed">Executed</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        </div>

        {proposalsLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredProposals.length === 0 ? (
          <Card className="p-8 text-center">
            <Vote className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h4 className="text-lg font-semibold text-gray-900 mb-2">No Proposals Found</h4>
            <p className="text-gray-600 mb-4">
              {selectedProperty
                ? `No proposals found for ${selectedProperty.name}`
                : 'No proposals have been created yet'}
            </p>
            {selectedProperty && (
              <Button onClick={() => setShowCreateProposal(true)}>
                Create First Proposal
              </Button>
            )}
          </Card>
        ) : (
          filteredProposals.map((proposal) => (
            <MultiPropertyProposalCard
              key={proposal.id}
              proposal={proposal}
              property={properties.find(p => p.id === proposal.propertyId)}
              votingPower={votingPower}
              onVote={vote}
              getProposalTypeLabel={getProposalTypeLabel}
              getProposalStatusLabel={getProposalStatusLabel}
            />
          ))
        )}
      </div>
    </div>
  )
}

function CreateProposalForm({
  propertyId,
  onSubmit,
  onCancel
}: {
  propertyId: number
  onSubmit: (propertyId: number, title: string, description: string, ipfsHash: string, proposalType: ProposalType) => Promise<any>
  onCancel: () => void
}) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [proposalType, setProposalType] = useState<ProposalType>(ProposalType.OTHER)
  const [ipfsHash, setIpfsHash] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return

    setIsSubmitting(true)
    try {
      await onSubmit(propertyId, title, description, ipfsHash, proposalType)
      onCancel() // Close form on success
    } catch (error) {
      console.error('Error creating proposal:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4 pt-4 border-t">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Proposal Title *
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter proposal title"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Proposal Type *
          </label>
          <select
            value={proposalType}
            onChange={(e) => setProposalType(Number(e.target.value) as ProposalType)}
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          >
            <option value={ProposalType.MAINTENANCE}>Maintenance</option>
            <option value={ProposalType.IMPROVEMENT}>Improvement</option>
            <option value={ProposalType.REFINANCE}>Refinance</option>
            <option value={ProposalType.SALE}>Sale</option>
            <option value={ProposalType.MANAGEMENT}>Management</option>
            <option value={ProposalType.DIVIDEND}>Dividend</option>
            <option value={ProposalType.OTHER}>Other</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description *
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your proposal in detail"
          className="w-full p-3 border border-gray-300 rounded-lg resize-none"
          rows={4}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          IPFS Hash (Optional)
        </label>
        <Input
          value={ipfsHash}
          onChange={(e) => setIpfsHash(e.target.value)}
          placeholder="QmExample... (for additional documents)"
        />
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={!title || !description || isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Proposal'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>

      <div className="text-sm text-gray-500">
        <p>• Minimum token balance required to create proposals</p>
        <p>• Voting period: 7 days</p>
        <p>• Proposals are property-specific</p>
      </div>
    </form>
  )
}

function MultiPropertyProposalCard({
  proposal,
  property,
  votingPower,
  onVote,
  getProposalTypeLabel,
  getProposalStatusLabel
}: {
  proposal: Proposal
  property?: any
  votingPower: number
  onVote: (proposalId: number, support: VoteSupport) => Promise<any>
  getProposalTypeLabel: (type: ProposalType) => string
  getProposalStatusLabel: (status: ProposalStatus) => string
}) {
  const [selectedVote, setSelectedVote] = useState<VoteSupport | null>(null)
  const [isVoting, setIsVoting] = useState(false)

  const getStatusColor = (status: ProposalStatus) => {
    switch (status) {
      case ProposalStatus.ACTIVE:
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case ProposalStatus.SUCCEEDED:
        return 'bg-green-50 text-green-700 border-green-200'
      case ProposalStatus.DEFEATED:
        return 'bg-red-50 text-red-700 border-red-200'
      case ProposalStatus.EXECUTED:
        return 'bg-gray-50 text-gray-700 border-gray-200'
      case ProposalStatus.EXPIRED:
        return 'bg-orange-50 text-orange-700 border-orange-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getStatusIcon = (status: ProposalStatus) => {
    switch (status) {
      case ProposalStatus.PENDING:
        return <Clock className="h-3 w-3" />
      case ProposalStatus.ACTIVE:
        return <Clock className="h-3 w-3" />
      case ProposalStatus.SUCCEEDED:
        return <CheckCircle className="h-3 w-3" />
      case ProposalStatus.DEFEATED:
        return <XCircle className="h-3 w-3" />
      case ProposalStatus.EXECUTED:
        return <CheckCircle className="h-3 w-3" />
      case ProposalStatus.EXPIRED:
        return <AlertCircle className="h-3 w-3" />
      default:
        return <AlertCircle className="h-3 w-3" />
    }
  }

  const isActive = proposal.status === ProposalStatus.ACTIVE
  const currentTime = BigInt(Math.floor(Date.now() / 1000))
  const timeRemaining = Number(proposal.endTime - currentTime)
  const daysRemaining = Math.ceil(timeRemaining / (24 * 60 * 60))

  const forPercentage = proposal.totalVotes > 0 ? (Number(proposal.forVotes) / Number(proposal.totalVotes)) * 100 : 0
  const againstPercentage = proposal.totalVotes > 0 ? (Number(proposal.againstVotes) / Number(proposal.totalVotes)) * 100 : 0
  const abstainPercentage = proposal.totalVotes > 0 ? (Number(proposal.abstainVotes) / Number(proposal.totalVotes)) * 100 : 0
  const quorumPercentage = proposal.quorumRequired > 0 ? (Number(proposal.totalVotes) / Number(proposal.quorumRequired)) * 100 : 0

  const handleVote = async () => {
    if (selectedVote === null || isVoting) return

    setIsVoting(true)
    try {
      await onVote(proposal.id, selectedVote)
      setSelectedVote(null)
    } catch (error) {
      console.error('Error voting:', error)
    } finally {
      setIsVoting(false)
    }
  }

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 pr-4">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold">#{proposal.id} {proposal.title}</h3>
            <Badge variant="secondary" className={getStatusColor(proposal.status)}>
              {getStatusIcon(proposal.status)}
              <span className="ml-1">{getProposalStatusLabel(proposal.status)}</span>
            </Badge>
            <Badge variant="outline">
              {getProposalTypeLabel(proposal.proposalType)}
            </Badge>
          </div>

          {/* Property info */}
          {property && (
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-600">{property.name}</span>
              <Badge variant="outline" className="text-xs">{property.symbol}</Badge>
            </div>
          )}

          <p className="text-gray-600 text-sm mb-3">{proposal.description}</p>

          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>Proposed by {`${proposal.proposer.slice(0, 6)}...${proposal.proposer.slice(-4)}`}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {isActive && daysRemaining > 0 ? `${daysRemaining} days remaining` : 'Ended'}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {Number(formatUnits(proposal.totalVotes, 18)).toLocaleString()} votes
            </span>
          </div>
        </div>
      </div>

      {/* Voting Results */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Results</span>
          <span className="text-sm text-gray-500">
            Quorum: {quorumPercentage.toFixed(1)}% ({Number(formatUnits(proposal.totalVotes, 18)).toLocaleString()}/{Number(formatUnits(proposal.quorumRequired, 18)).toLocaleString()})
          </span>
        </div>

        <div className="space-y-3">
          {/* For Votes */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-2">
                <ThumbsUp className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-600">For</span>
              </div>
              <span className="text-sm font-medium">
                {forPercentage.toFixed(1)}% ({Number(formatUnits(proposal.forVotes, 18)).toLocaleString()})
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${forPercentage}%` }}
              />
            </div>
          </div>

          {/* Against Votes */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-2">
                <ThumbsDown className="h-4 w-4 text-red-600" />
                <span className="text-sm font-medium text-red-600">Against</span>
              </div>
              <span className="text-sm font-medium">
                {againstPercentage.toFixed(1)}% ({Number(formatUnits(proposal.againstVotes, 18)).toLocaleString()})
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-red-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${againstPercentage}%` }}
              />
            </div>
          </div>

          {/* Abstain Votes */}
          {abstainPercentage > 0 && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 bg-gray-400 rounded-sm" />
                  <span className="text-sm font-medium text-gray-600">Abstain</span>
                </div>
                <span className="text-sm font-medium">
                  {abstainPercentage.toFixed(1)}% ({Number(formatUnits(proposal.abstainVotes, 18)).toLocaleString()})
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gray-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${abstainPercentage}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Voting Interface */}
      {isActive && votingPower > 0 && (
        <div className="border-t pt-4">
          <h4 className="font-medium mb-3">Cast Your Vote</h4>

          <div className="grid grid-cols-3 gap-3 mb-3">
            <Button
              variant={selectedVote === VoteSupport.FOR ? 'default' : 'outline'}
              onClick={() => setSelectedVote(VoteSupport.FOR)}
              className="justify-center gap-2"
            >
              <ThumbsUp className="h-4 w-4" />
              For
            </Button>
            <Button
              variant={selectedVote === VoteSupport.AGAINST ? 'destructive' : 'outline'}
              onClick={() => setSelectedVote(VoteSupport.AGAINST)}
              className="justify-center gap-2"
            >
              <ThumbsDown className="h-4 w-4" />
              Against
            </Button>
            <Button
              variant={selectedVote === VoteSupport.ABSTAIN ? 'secondary' : 'outline'}
              onClick={() => setSelectedVote(VoteSupport.ABSTAIN)}
              className="justify-center gap-2"
            >
              Abstain
            </Button>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleVote}
              disabled={selectedVote === null || isVoting}
              className="flex-1"
            >
              {isVoting ? 'Submitting...' : 'Submit Vote'}
            </Button>
          </div>

          <p className="text-xs text-gray-500 mt-2">
            Your voting power: {votingPower.toLocaleString()} tokens
          </p>
        </div>
      )}

      {/* No voting power warning */}
      {isActive && votingPower === 0 && (
        <div className="border-t pt-4">
          <div className="flex items-center gap-2 text-yellow-600">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">You need tokens to participate in voting</span>
          </div>
        </div>
      )}
    </Card>
  )
}