import React, { useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/atoms/Card'
import { Button } from '@/components/atoms/Button'
import { Upload, FileText, AlertCircle, CheckCircle, XCircle, Loader2, Eye, X } from 'lucide-react'
import { DiscrepancyResult } from '@/types'
import { useValidation } from '@/contexts/ValidationContext'
import { DiscrepancyResultsModal } from '@/components/molecules/DiscrepancyResultsModal'

export function ValidationPage() {
  const { incrementValidationCount } = useValidation()

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [statusMessage, setStatusMessage] = useState('')
  const [uploadProgress, setUploadProgress] = useState(0)
  const [validationStep, setValidationStep] = useState<'idle' | 'uploading' | 'processing' | 'complete'>('idle')

  // New state for immediate results display
  const [showResults, setShowResults] = useState(false)
  const [validationResults, setValidationResults] = useState<{
    validationId: string
    totalDiscrepancies: number
    processingTimeMs: number
    discrepancies: DiscrepancyResult[]
  } | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.name.match(/\.(xlsx|xls)$/i)) {
        setStatusMessage('Please select a valid Excel file (.xlsx or .xls)')
        setUploadStatus('error')
        setValidationStep('idle')
        return
      }

      // Validate file size (100MB limit)
      if (file.size > 100 * 1024 * 1024) {
        setStatusMessage('File size must be less than 100MB')
        setUploadStatus('error')
        setValidationStep('idle')
        return
      }

      setSelectedFile(file)
      setUploadStatus('idle')
      setStatusMessage('')
      setValidationStep('idle')
      setUploadProgress(0)
    }
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
  }

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault()
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file) {
      // Validate file type
      if (!file.name.match(/\.(xlsx|xls)$/i)) {
        setStatusMessage('Please select a valid Excel file (.xlsx or .xls)')
        setUploadStatus('error')
        setValidationStep('idle')
        return
      }

      // Validate file size (100MB limit)
      if (file.size > 100 * 1024 * 1024) {
        setStatusMessage('File size must be less than 100MB')
        setUploadStatus('error')
        setValidationStep('idle')
        return
      }

      setSelectedFile(file)
      setUploadStatus('idle')
      setStatusMessage('')
      setValidationStep('idle')
      setUploadProgress(0)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setIsUploading(true)
    setUploadStatus('idle')
    setStatusMessage('')
    setValidationStep('uploading')
    setUploadProgress(0)

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      const formData = new FormData()
      formData.append('file', selectedFile)

      const response = await fetch('http://localhost:3001/api/v1/validation/upload', {
        method: 'POST',
        body: formData,
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (response.ok) {
        try {
          const result = await response.json()
          const validationId = result.data?.validationId

          if (validationId) {
            // Fetch validation results immediately
            try {
              const resultsResponse = await fetch(`http://localhost:3001/api/v1/history/${validationId}/discrepancies`)
              if (resultsResponse.ok) {
                const resultsData = await resultsResponse.json()
                setValidationResults({
                  validationId,
                  totalDiscrepancies: result.data?.totalDiscrepancies || 0,
                  processingTimeMs: result.data?.processingTimeMs || 0,
                  discrepancies: resultsData.data || []
                })
                setShowResults(true)
              }
            } catch (error) {
              console.error('Failed to fetch validation results:', error)
            }
          }

          setValidationStep('complete')
          setUploadStatus('success')
          setStatusMessage('')

          // Increment validation count to signal new data to HistoryPage
          incrementValidationCount()
        } catch (parseError) {
          throw new Error('Invalid response format from server')
        }
      } else {
        setValidationStep('idle')
        setUploadStatus('error')

        try {
          const errorData = await response.json()
          // Extract the actual error message from the backend
          const errorMessage = errorData.error?.message || errorData.message || 'Unknown error'
          setStatusMessage(`Upload failed: ${errorMessage}`)
        } catch (parseError) {
          setStatusMessage(`Upload failed: HTTP ${response.status} - ${response.statusText}`)
        }
      }
    } catch (error) {
      setValidationStep('idle')
      setUploadStatus('error')
      setStatusMessage(`Network error: ${error instanceof Error ? error.message : 'Failed to connect to server'}`)
    } finally {
      setIsUploading(false)
    }
  }

  const removeFile = () => {
    setSelectedFile(null)
    setUploadStatus('idle')
    setStatusMessage('')
    setValidationStep('idle')
    setUploadProgress(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getValidationStepIcon = () => {
    switch (validationStep) {
      case 'uploading':
        return <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
      case 'processing':
        return <Loader2 className="h-6 w-6 animate-spin text-purple-500" />
      case 'complete':
        return <CheckCircle className="h-6 w-6 text-green-500" />
      default:
        return <Upload className="h-6 w-6 text-gray-400" />
    }
  }

  const getValidationStepText = () => {
    switch (validationStep) {
      case 'uploading':
        return 'Uploading file...'
      case 'processing':
        return 'Processing validation...'
      case 'complete':
        return 'Ready to upload'
      default:
        return 'Ready to upload'
    }
  }

  return (
    <div className="space-y-8">
      {/* Header Section - Colorful */}
      <div className="text-center space-y-6 animate-fade-in">
        <div className="relative">
          {/* Colorful background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl"></div>
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-teal-400/20 to-green-400/20 rounded-full blur-xl"></div>
          </div>

          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
            Upload Invoice
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mt-4">
            Upload your Excel invoice file to validate it against reference drug data
          </p>
        </div>
      </div>

      {/* File Upload Card - Colorful */}
      <Card className="gradient-card max-w-3xl mx-auto animate-scale-in hover-lift colorful-shadow">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl">File Upload</CardTitle>
          </div>
          <CardDescription className="text-lg">
            Select an Excel file (.xlsx or .xls) to begin validation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* File Input - Enhanced */}
          <div className="space-y-3">
            <label htmlFor="file-upload" className="block text-sm font-medium text-center">
              Choose File
            </label>
            <input
              ref={fileInputRef}
              id="file-upload"
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileSelect}
              className="block w-full text-sm text-muted-foreground file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gradient-to-r file:from-blue-500 file:to-purple-600 file:text-white hover:file:from-blue-600 hover:file:to-purple-700 file:transition-all file:duration-300 file:cursor-pointer"
            />
          </div>

          {/* Drag & Drop Area - Colorful */}
          <div
            className={`border-2 border-dashed rounded-xl p-10 text-center transition-all duration-300 ${selectedFile
              ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-blue-50'
              : 'border-gray-300 hover:border-purple-400 hover:bg-gradient-to-br hover:from-purple-50/50 hover:to-blue-50/50'
              }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 inline-block mb-4 shadow-lg">
              <Upload className="h-16 w-16 text-white" />
            </div>
            <p className="text-base text-muted-foreground mb-2">
              Drag and drop your Excel file here, or click "Choose File" above
            </p>
            <p className="text-sm text-muted-foreground">
              Supports .xlsx and .xls files up to 100MB
            </p>
          </div>

          {/* File Display - Colorful */}
          {selectedFile && (
            <div className="flex items-center justify-between p-4 bg-gradient-to-br from-green-50 to-teal-50 rounded-xl border border-green-200 animate-scale-in">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-teal-600 shadow-lg">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-lg">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={removeFile}
                disabled={isUploading}
                className="hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-200"
              >
                Remove
              </Button>
            </div>
          )}

          {/* Validation Progress */}
          {validationStep !== 'idle' && (
            <div className="space-y-4 p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200">
              <div className="flex items-center space-x-3">
                {getValidationStepIcon()}
                <div className="flex-1">
                  <p className="font-medium text-blue-800">{getValidationStepText()}</p>
                  {validationStep === 'uploading' && (
                    <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Status Message - Colorful */}
          {statusMessage && (
            <div className={`flex items-center space-x-3 p-4 rounded-xl border animate-scale-in ${uploadStatus === 'success'
              ? 'bg-gradient-to-r from-green-50 to-teal-50 text-green-800 border-green-300'
              : 'bg-gradient-to-r from-red-50 to-pink-50 text-red-800 border-red-300'
              }`}>
              {uploadStatus === 'success' ? (
                <div className="p-2 rounded-full bg-gradient-to-br from-green-500 to-teal-600">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
              ) : (
                <div className="p-2 rounded-full bg-gradient-to-br from-red-500 to-pink-600">
                  <AlertCircle className="h-5 w-5 text-white" />
                </div>
              )}
              <span className="text-base font-medium">{statusMessage}</span>
            </div>
          )}

          {/* Upload Button - Colorful */}
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:shadow-xl transition-all duration-300"
            size="lg"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-6 w-6 mr-3 animate-spin" />
                {validationStep === 'uploading' ? 'Uploading...' : 'Processing...'}
              </>
            ) : (
              <>
                <Upload className="h-6 w-6 mr-3" />
                Start Validation
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Instructions Card - Colorful */}
      <Card className="gradient-card max-w-4xl mx-auto animate-slide-up colorful-shadow">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl flex items-center justify-center space-x-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <span>How to prepare your Excel file</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-4">
              <h4 className="font-semibold text-lg text-center mb-4">Required Columns</h4>
              <div className="space-y-3">
                {[
                  'Drug Name', 'Strength', 'Formulation',
                  'Unit Price', 'Payer (Medicaid/Medicare)', 'Quantity'
                ].map((column, index) => (
                  <div
                    key={column}
                    className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 transition-all duration-200 border border-blue-100"
                  >
                    <div className="w-3 h-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full"></div>
                    <span className="text-sm font-medium">{column}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-lg text-center mb-4">File Requirements</h4>
              <div className="space-y-3">
                {[
                  'Excel format (.xlsx or .xls)',
                  'Maximum size: 100MB',
                  'First row should be headers',
                  'Data starts from second row'
                ].map((requirement, index) => (
                  <div
                    key={requirement}
                    className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-teal-50 to-green-50 hover:from-teal-100 hover:to-green-100 transition-all duration-200 border border-teal-100"
                  >
                    <div className="w-3 h-3 bg-gradient-to-br from-teal-500 to-green-600 rounded-full"></div>
                    <span className="text-sm">{requirement}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Modal - Colorful */}
      <DiscrepancyResultsModal
        isOpen={showResults}
        onClose={() => setShowResults(false)}
        validationId={validationResults?.validationId || ''}
        filename={selectedFile?.name}
        totalDiscrepancies={validationResults?.totalDiscrepancies || 0}
        processingTimeMs={validationResults?.processingTimeMs || 0}
        discrepancies={validationResults?.discrepancies || []}
        showValidateAnother={true}
        onValidateAnother={() => {
          setShowResults(false)
          // Reset form for next validation
          setSelectedFile(null)
          setValidationStep('idle')
          setUploadProgress(0)
          if (fileInputRef.current) {
            fileInputRef.current.value = ''
          }
          setValidationResults(null)
        }}
      />
    </div>
  )
}
