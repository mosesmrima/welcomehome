"use client"

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Badge } from '../ui/badge'
import { useAccount } from 'wagmi'
import { useUserKYCStatus, useSubmitKYC, InvestorType, KYCStatus } from '@/app/lib/web3/hooks/use-kyc-registry'
import { FileText, Upload, CheckCircle, AlertCircle, Clock, User } from 'lucide-react'

const INVESTOR_TYPE_LABELS = {
  [InvestorType.RETAIL]: 'Retail Investor',
  [InvestorType.ACCREDITED]: 'Accredited Investor',
  [InvestorType.INSTITUTIONAL]: 'Institutional Investor',
}

const STATUS_LABELS = {
  [KYCStatus.NONE]: 'Not Submitted',
  [KYCStatus.PENDING]: 'Under Review',
  [KYCStatus.APPROVED]: 'Approved',
  [KYCStatus.DENIED]: 'Denied',
  [KYCStatus.EXPIRED]: 'Expired',
}

const STATUS_COLORS = {
  [KYCStatus.NONE]: 'bg-gray-100 text-gray-800',
  [KYCStatus.PENDING]: 'bg-orange-100 text-orange-800',
  [KYCStatus.APPROVED]: 'bg-green-100 text-green-800',
  [KYCStatus.DENIED]: 'bg-red-100 text-red-800',
  [KYCStatus.EXPIRED]: 'bg-yellow-100 text-yellow-800',
}

export function KYCSubmission() {
  const [investorType, setInvestorType] = useState<InvestorType>(InvestorType.RETAIL)
  const [documentHash, setDocumentHash] = useState('')
  const [documents, setDocuments] = useState<{ name: string; uploaded: boolean }[]>([])

  const { address, isConnected } = useAccount()
  const { status, isApproved, isAccredited, record } = useUserKYCStatus(address)
  const { submitKYC, isPending, isConfirming, isConfirmed, error } = useSubmitKYC()

  const handleSubmit = async () => {
    if (!documentHash.trim()) {
      alert('Please provide a document hash')
      return
    }

    try {
      await submitKYC(documentHash, investorType)
    } catch (err) {
      console.error('Failed to submit KYC:', err)
    }
  }

  const mockUploadFile = (fileName: string) => {
    // Mock file upload - in production this would upload to IPFS
    const mockHash = `QmHash${Math.random().toString(36).substring(2, 15)}`
    setDocumentHash(mockHash)
    setDocuments(prev => [...prev, { name: fileName, uploaded: true }])
  }

  if (!isConnected) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <User className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">Connect your wallet to access KYC submission</p>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Current Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            KYC Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Verification Status</p>
              <Badge className={STATUS_COLORS[status || KYCStatus.NONE]}>
                {STATUS_LABELS[status || KYCStatus.NONE]}
              </Badge>
            </div>

            {record && record.investorType !== undefined && (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Investor Type</p>
                <p className="font-medium">{INVESTOR_TYPE_LABELS[record.investorType]}</p>
              </div>
            )}

            <div className="space-y-2">
              <p className="text-sm text-gray-600">Investment Access</p>
              <div className="flex items-center gap-2">
                {isApproved && isAccredited ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-green-600 font-medium">Approved</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-4 w-4 text-orange-500" />
                    <span className="text-orange-600 font-medium">Restricted</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {record && record.rejectionReason && (
            <div className="mt-4 p-3 bg-red-50 rounded-lg">
              <p className="text-sm text-red-800">
                <strong>Rejection Reason:</strong> {record.rejectionReason}
              </p>
            </div>
          )}

          {record && record.expiresAt && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Expires:</strong> {new Date(Number(record.expiresAt) * 1000).toLocaleDateString()}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* KYC Submission Form */}
      {(!status || status === KYCStatus.NONE || status === KYCStatus.DENIED || status === KYCStatus.EXPIRED) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Submit KYC Application
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Investor Type Selection */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Investor Type
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {Object.entries(INVESTOR_TYPE_LABELS).map(([value, label]) => (
                  <button
                    key={value}
                    onClick={() => setInvestorType(Number(value) as InvestorType)}
                    className={`p-3 border rounded-lg text-sm font-medium transition-colors ${
                      investorType === Number(value)
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="text-xs text-gray-500 space-y-1">
                <p><strong>Retail:</strong> Standard investment limits and restrictions apply</p>
                <p><strong>Accredited:</strong> Higher investment limits for qualified investors</p>
                <p><strong>Institutional:</strong> For organizations and institutional entities</p>
              </div>
            </div>

            {/* Mock Document Upload */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Required Documents
              </label>
              <div className="space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    onClick={() => mockUploadFile('passport.pdf')}
                    className="h-16 flex flex-col items-center justify-center gap-1"
                    disabled={documents.some(d => d.name === 'passport.pdf')}
                  >
                    <Upload className="h-4 w-4" />
                    <span className="text-xs">ID Document</span>
                    {documents.some(d => d.name === 'passport.pdf') && (
                      <CheckCircle className="h-3 w-3 text-green-500" />
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => mockUploadFile('proof_of_address.pdf')}
                    className="h-16 flex flex-col items-center justify-center gap-1"
                    disabled={documents.some(d => d.name === 'proof_of_address.pdf')}
                  >
                    <Upload className="h-4 w-4" />
                    <span className="text-xs">Proof of Address</span>
                    {documents.some(d => d.name === 'proof_of_address.pdf') && (
                      <CheckCircle className="h-3 w-3 text-green-500" />
                    )}
                  </Button>
                </div>

                {investorType === InvestorType.ACCREDITED && (
                  <Button
                    variant="outline"
                    onClick={() => mockUploadFile('accreditation_proof.pdf')}
                    className="w-full h-16 flex flex-col items-center justify-center gap-1"
                    disabled={documents.some(d => d.name === 'accreditation_proof.pdf')}
                  >
                    <Upload className="h-4 w-4" />
                    <span className="text-xs">Accreditation Certificate</span>
                    {documents.some(d => d.name === 'accreditation_proof.pdf') && (
                      <CheckCircle className="h-3 w-3 text-green-500" />
                    )}
                  </Button>
                )}
              </div>

              {documents.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Uploaded Files:</p>
                  <div className="space-y-1">
                    {documents.map((doc, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>{doc.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Document Hash (auto-filled from mock upload) */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Document Hash (IPFS)
              </label>
              <Input
                value={documentHash}
                onChange={(e) => setDocumentHash(e.target.value)}
                placeholder="Document hash will be generated after upload"
                className="font-mono text-sm"
              />
              <p className="text-xs text-gray-500">
                In production, this would be automatically generated when uploading to IPFS
              </p>
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={!documentHash.trim() || isPending || isConfirming}
              className="w-full"
              size="lg"
            >
              {isPending ? 'Preparing...' :
               isConfirming ? 'Submitting...' :
               'Submit KYC Application'}
            </Button>

            {/* Status Messages */}
            {isConfirmed && (
              <div className="flex items-center gap-2 text-green-600 text-sm">
                <CheckCircle className="h-4 w-4" />
                <span>KYC application submitted successfully! You will be notified when it's reviewed.</span>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>Submission failed. Please try again.</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Pending Status */}
      {status === KYCStatus.PENDING && (
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <Clock className="h-12 w-12 mx-auto mb-4 text-orange-500" />
              <h3 className="text-lg font-semibold mb-2">Application Under Review</h3>
              <p className="text-gray-600 mb-4">
                Your KYC application is being reviewed by our compliance team.
              </p>
              <p className="text-sm text-gray-500">
                Submitted on: {record?.submittedAt ? new Date(Number(record.submittedAt) * 1000).toLocaleDateString() : 'Unknown'}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}