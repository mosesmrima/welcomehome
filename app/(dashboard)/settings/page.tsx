"use client"

import { useState } from "react"
import { Card } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Label } from "@/app/components/ui/label"
import { cn } from "@/app/lib/utils"
import { Upload, Bell, Shield, User, Loader2, CheckCircle, Clock, XCircle, AlertTriangle, FileText } from "lucide-react"
import { useAccount } from "wagmi"
import { useMounted } from "@/app/lib/hooks/use-mounted"

const tabs = [
  { id: "wallet", label: "Wallet", icon: User },
  { id: "kyc", label: "KYC Verification", icon: FileText },
  { id: "security", label: "Security", icon: Shield },
  { id: "notifications", label: "Notifications", icon: Bell },
]

// Disable static rendering for this page
export const dynamic = 'force-dynamic'

export default function SettingsPage() {
  const mounted = useMounted()
  const [activeTab, setActiveTab] = useState("wallet")
  const { address, isConnected } = useAccount()

  if (!mounted) {
    return (
      <div className="p-6">
        <div className="max-w-md mx-auto text-center">
          <User className="h-16 w-16 mx-auto mb-4 text-gray-400 animate-pulse" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Loading Settings...</h1>
        </div>
      </div>
    )
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  if (!isConnected) {
    return (
      <div className="p-6">
        <div className="max-w-md mx-auto text-center">
          <User className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Connect your wallet to access settings</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-gray-600 font-mono text-sm mt-1">{address ? formatAddress(address) : 'Not connected'}</p>
      </div>

      {/* Settings Card */}
      <Card className="overflow-hidden">
        {/* Tabs */}
        <div className="border-b">
          <div className="flex">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors border-b-2",
                    activeTab === tab.id
                      ? "border-primary text-primary bg-primary/5"
                      : "border-transparent text-gray-700 hover:text-gray-800"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "wallet" && <WalletSettings />}
          {activeTab === "kyc" && <KYCSettings />}
          {activeTab === "security" && <SecuritySettings />}
          {activeTab === "notifications" && <NotificationSettings />}
        </div>
      </Card>
    </div>
  )
}

function WalletSettings() {
  const { address } = useAccount()

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 10)}...${addr.slice(-6)}`
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Wallet Information</h3>
        <p className="text-sm text-gray-800 mb-6">Your connected wallet address</p>

        {/* Wallet Address (Read-only) */}
        <div className="mb-6">
          <Label className="text-sm font-medium mb-2 block">Wallet Address</Label>
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="font-mono text-sm">{address ? formatAddress(address) : 'Not connected'}</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            This is your blockchain address. All property ownership and transactions are tied to this wallet.
          </p>
        </div>
      </div>
    </div>
  )
}

function KYCSettings() {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [kycStatus, setKycStatus] = useState<'pending' | 'approved' | 'rejected'>('pending')
  const [selectedFiles, setSelectedFiles] = useState<{
    idDocument: File | null
    proofOfAddress: File | null
  }>({
    idDocument: null,
    proofOfAddress: null
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, docType: 'idDocument' | 'proofOfAddress') => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFiles(prev => ({ ...prev, [docType]: file }))
    }
  }

  const handleSubmitKYC = async () => {
    if (!selectedFiles.idDocument || !selectedFiles.proofOfAddress) {
      setUploadError('Please upload both required documents')
      return
    }

    setIsUploading(true)
    setUploadError('')
    setUploadSuccess(false)

    try {
      // Simulate upload - in production, integrate with your backend
      await new Promise(resolve => setTimeout(resolve, 2000))
      setUploadSuccess(true)
      setKycStatus('pending')
      setSelectedFiles({ idDocument: null, proofOfAddress: null })
    } catch (err: any) {
      setUploadError(err.message || 'Failed to upload documents')
    } finally {
      setIsUploading(false)
    }
  }

  const getKYCStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-600" />
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-600" />
      default:
        return <Clock className="h-5 w-5 text-gray-600" />
    }
  }

  const getKYCStatusMessage = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Your KYC verification has been approved. You can now invest in properties.'
      case 'pending':
        return 'Your KYC documents are under review. This typically takes 1-3 business days.'
      case 'rejected':
        return 'Your KYC verification was rejected. Please resubmit your documents.'
      default:
        return 'Please submit your KYC documents to start investing.'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">KYC Verification</h3>
        <p className="text-sm text-gray-800 mb-6">
          Complete your KYC verification to unlock full access to property investments
        </p>

        {/* Current KYC Status */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
          <div className="flex items-start gap-3">
            {getKYCStatusIcon(kycStatus)}
            <div>
              <h4 className="font-medium mb-1">
                Status: {kycStatus.charAt(0).toUpperCase() + kycStatus.slice(1)}
              </h4>
              <p className="text-sm text-gray-600">
                {getKYCStatusMessage(kycStatus)}
              </p>
            </div>
          </div>
        </div>

        {/* Document Upload */}
        {kycStatus !== 'approved' && (
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">
                Government-Issued ID Document
                <span className="text-red-500">*</span>
              </Label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => handleFileChange(e, 'idDocument')}
                  className="hidden"
                  id="id-document"
                />
                <label htmlFor="id-document" className="cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm font-medium">
                    {selectedFiles.idDocument ? selectedFiles.idDocument.name : 'Click to upload or drag and drop'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Passport, Driver's License, or National ID (PDF, JPG, PNG - Max 5MB)
                  </p>
                </label>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">
                Proof of Address
                <span className="text-red-500">*</span>
              </Label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => handleFileChange(e, 'proofOfAddress')}
                  className="hidden"
                  id="proof-of-address"
                />
                <label htmlFor="proof-of-address" className="cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm font-medium">
                    {selectedFiles.proofOfAddress ? selectedFiles.proofOfAddress.name : 'Click to upload or drag and drop'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Utility Bill, Bank Statement, or Tax Document (PDF, JPG, PNG - Max 5MB)
                  </p>
                </label>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">Document Requirements</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Documents must be clear and legible</li>
                <li>• All four corners of the document must be visible</li>
                <li>• Documents must be current (issued within last 3 months for proof of address)</li>
                <li>• Personal information must match across all documents</li>
              </ul>
            </div>

            {uploadSuccess && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 text-green-800">
                  <CheckCircle className="h-5 w-5" />
                  <p className="font-medium">Documents submitted successfully! Your verification is under review.</p>
                </div>
              </div>
            )}

            {uploadError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 text-red-800">
                  <AlertTriangle className="h-5 w-5" />
                  <p className="font-medium">{uploadError}</p>
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <Button
                onClick={handleSubmitKYC}
                disabled={isUploading || !selectedFiles.idDocument || !selectedFiles.proofOfAddress}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Submit KYC Documents
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Approved Status */}
        {kycStatus === 'approved' && (
          <div className="p-6 bg-green-50 border border-green-200 rounded-lg text-center">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
            <h4 className="font-semibold text-green-900 mb-2">Verification Complete</h4>
            <p className="text-sm text-green-800">
              You are fully verified and can now access all investment opportunities on our platform.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function SecuritySettings() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Security</h3>
        <p className="text-sm text-gray-800 mb-6">Manage your account security settings</p>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-900 mb-2">Wallet Security</h4>
          <p className="text-sm text-blue-800">
            Your account is secured by your wallet. Make sure to:
          </p>
          <ul className="text-sm text-blue-800 space-y-1 mt-2 ml-4">
            <li>• Keep your seed phrase safe and never share it</li>
            <li>• Use a hardware wallet for large investments</li>
            <li>• Enable two-factor authentication in your wallet app</li>
            <li>• Always verify transaction details before signing</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

function NotificationSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Notifications</h3>
        <p className="text-sm text-gray-800 mb-6">Configure your notification preferences</p>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <p className="font-medium">New Property Listings</p>
              <p className="text-sm text-gray-600">Get notified when new properties are listed</p>
            </div>
            <input type="checkbox" defaultChecked className="rounded" />
          </div>

          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <p className="font-medium">Transaction Updates</p>
              <p className="text-sm text-gray-600">Receive updates about your transactions</p>
            </div>
            <input type="checkbox" defaultChecked className="rounded" />
          </div>

          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <p className="font-medium">Revenue Distributions</p>
              <p className="text-sm text-gray-600">Get notified when revenue is available to claim</p>
            </div>
            <input type="checkbox" defaultChecked className="rounded" />
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium">Governance Proposals</p>
              <p className="text-sm text-gray-600">Alerts about new governance proposals</p>
            </div>
            <input type="checkbox" defaultChecked className="rounded" />
          </div>
        </div>
      </div>
    </div>
  )
}
