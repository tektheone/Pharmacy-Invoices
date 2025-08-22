import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/atoms/Card'
import { Button } from '@/components/atoms/Button'
import { Input } from '../atoms/Input'
import { History, Search, FileText, Clock, AlertCircle, CheckCircle, XCircle, X, Eye, Info, Trash2 } from 'lucide-react'
import { ValidationResult } from '@/types'
import { useValidation } from '@/contexts/ValidationContext'
import { DiscrepancyResultsModal } from '@/components/molecules/DiscrepancyResultsModal'

// Add interface for discrepancy results
interface DiscrepancyResult {
  id: string
  validationId: string
  drugName: string
  strength: string | null
  formulation: string | null
  unitPrice: number
  payer: string | null
  quantity: number | null
  discrepancyType: string
  severity: string
  expectedValue: string | null
  actualValue: string
  message: string
  createdAt: string
}

export function HistoryPage() {
  const { validationCount, decrementValidationCount } = useValidation()

  const [validations, setValidations] = useState<ValidationResult[]>([])
  const [allValidations, setAllValidations] = useState<ValidationResult[]>([]) // Store all data locally
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [error, setError] = useState('')
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null)

  // New state for details modal
  const [selectedValidation, setSelectedValidation] = useState<ValidationResult | null>(null)
  const [discrepancyResults, setDiscrepancyResults] = useState<DiscrepancyResult[]>([])
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)

  // New state for delete functionality
  const [deletingValidation, setDeletingValidation] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<ValidationResult | null>(null)

  // State to track if data needs to be refreshed
  const [lastValidationCount, setLastValidationCount] = useState<number>(0)
  const [hasDataChanged, setHasDataChanged] = useState<boolean>(true)

  useEffect(() => {
    // Only fetch data if it has changed or it's the first load
    if (hasDataChanged) {
      fetchAllValidations()
    }
  }, [hasDataChanged]) // Fetch when hasDataChanged becomes true

  // Monitor validation count changes to detect new validations
  useEffect(() => {
    // If validation count increased, we have new data to fetch
    if (validationCount > lastValidationCount) {
      setHasDataChanged(true)
    }
  }, [validationCount, lastValidationCount])

  // Load all validations once and store locally
  const fetchAllValidations = async () => {
    try {
      setLoading(true)
      // Fetch a large number to get all data (adjust limit as needed)
      const response = await fetch(`http://localhost:3001/api/v1/history?page=1&limit=1000`)

      if (response.ok) {
        const data = await response.json()
        const allData = data.data.validations
        setAllValidations(allData) // Store all data locally
        setValidations(allData) // Initially show all data
        setTotalPages(Math.ceil(allData.length / pageSize)) // Calculate pages based on local data
        setLastValidationCount(allData.length) // Track current validation count
        setHasDataChanged(false) // Mark data as up-to-date
        setError('')
      } else {
        setError('Failed to fetch validation history')
      }
    } catch (error) {
      setError('Network error: Failed to connect to server')
    } finally {
      setLoading(false)
    }
  }

  // New function to handle View Details
  const handleViewDetails = async (validation: ValidationResult) => {
    try {
      setSelectedValidation(validation)
      setShowDetailsModal(true)
      setLoadingDetails(true)
      setDiscrepancyResults([])

      // Fetch discrepancy results for this validation
      const response = await fetch(`http://localhost:3001/api/v1/history/${validation.id}/discrepancies`)

      if (response.ok) {
        const data = await response.json()
        setDiscrepancyResults(data.data || [])
      } else {
        console.error('Failed to fetch discrepancy results')
        setDiscrepancyResults([])
      }
    } catch (error) {
      console.error('Error fetching details:', error)
      setDiscrepancyResults([])
    } finally {
      setLoadingDetails(false)
    }
  }

  // Function to close details modal
  const closeDetailsModal = () => {
    setShowDetailsModal(false)
    setSelectedValidation(null)
    setDiscrepancyResults([])
  }

  // Function to handle delete validation
  const handleDeleteValidation = async (validation: ValidationResult) => {
    try {
      setDeletingValidation(validation.id)

      const response = await fetch(`http://localhost:3001/api/v1/history/${validation.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        // Remove from local state
        setAllValidations(prev => prev.filter(v => v.id !== validation.id))
        setValidations(prev => prev.filter(v => v.id !== validation.id))

        // Close delete confirmation
        setShowDeleteConfirm(null)
        setDeletingValidation(null)

        // Decrement validation count to reflect deletion
        decrementValidationCount()

        // Show success message
        setError('') // Clear any existing errors
        // You could add a success state here if you want to show success messages
      } else {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to delete validation')
      }
    } catch (error) {
      console.error('Error deleting validation:', error)
      setError(`Failed to delete validation: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setDeletingValidation(null)
    }
  }

  // Function to show delete confirmation
  const showDeleteConfirmation = (validation: ValidationResult) => {
    setShowDeleteConfirm(validation)
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-600" />
      case 'processing':
        return <Clock className="h-5 w-5 text-yellow-600" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200'
      case 'failed':
        return 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border-red-200'
      case 'processing':
        return 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border-yellow-200'
      default:
        return 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border-gray-200'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatProcessingTime = (ms: number) => {
    if (!ms || isNaN(ms)) return 'N/A'
    if (ms < 1000) return `${ms}ms`
    return `${(ms / 1000).toFixed(1)}s`
  }

  return (
    <div className="space-y-8">
      {/* Header Section - Colorful */}
      <div className="text-center space-y-6 animate-fade-in">
        <div className="relative">
          {/* Colorful background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-xl"></div>
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-teal-400/20 to-blue-400/20 rounded-full blur-xl"></div>
          </div>

          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-600 via-pink-600 to-teal-600 bg-clip-text text-transparent">
            Validation History
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mt-4">
            View and search through your validation history and results
          </p>
        </div>
      </div>

      {/* Search Bar - Colorful */}
      <Card className="gradient-card max-w-3xl mx-auto animate-scale-in hover-lift colorful-shadow">
        <CardContent className="pt-6">
          <div className="space-y-3">
            <div className="flex space-x-3">
              <Input
                placeholder="Search by filename, status, or date (e.g., 'invoice', 'completed', '8/22/2025')"
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                className="flex-1 focus-ring-colorful"
              />
              <Button
                onClick={() => performLocalSearch(searchQuery)}
                disabled={loading}
                className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 hover:shadow-xl transition-all duration-300"
              >
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground font-medium">Show:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    const newSize = parseInt(e.target.value)
                    setPageSize(newSize)
                    setCurrentPage(1) // Reset to first page when changing page size
                    setTotalPages(Math.ceil(validations.length / newSize))
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>

            {/* Results Counter */}
            <div className="text-sm text-muted-foreground text-center">
              Showing {Math.min((currentPage - 1) * pageSize + 1, validations.length)} to {Math.min(currentPage * pageSize, validations.length)} of {validations.length} validations
            </div>

            {searchQuery && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  {searchQuery.trim().length < 2 ? (
                    <>
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span>Type at least 2 characters to search...</span>
                    </>
                  ) : (
                    <>
                      <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full animate-pulse"></div>
                      <span>Searching for: "{searchQuery}"</span>
                    </>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery('')
                    setValidations(allValidations)
                    setCurrentPage(1)
                    setTotalPages(Math.ceil(allValidations.length / pageSize))
                  }}
                  className="text-muted-foreground hover:text-gray-700"
                >
                  Clear
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 mb-6 shadow-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
          <p className="text-lg text-muted-foreground">Loading validation history...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <Card className="max-w-2xl mx-auto border-red-200 bg-gradient-to-r from-red-50 to-pink-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3 text-red-800">
              <AlertCircle className="h-6 w-6" />
              <div>
                <h3 className="font-semibold">Error</h3>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Validation List */}
      {!loading && !error && validations.length === 0 && (
        <Card className="max-w-2xl mx-auto border-gray-200 bg-gradient-to-r from-gray-50 to-slate-50">
          <CardContent className="pt-6 text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-400 to-slate-500 mx-auto mb-4">
              <History className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No validations found</h3>
            <p className="text-gray-600">Start by uploading and validating an invoice file.</p>
          </CardContent>
        </Card>
      )}

      {/* Validation Results */}
      {!loading && !error && validations.length > 0 && (
        <div className="space-y-6">
          {getPaginatedValidations().map((validation, index) => (
            <Card
              key={validation.id}
              className="group relative overflow-hidden bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-500 max-w-5xl mx-auto animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Gradient Border */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute inset-[2px] bg-white rounded-lg"></div>

              {/* Card Content */}
              <CardContent className="relative p-8">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  {/* Main Content Section */}
                  <div className="flex-1 space-y-4">
                    {/* Header with File Info */}
                    <div className="flex items-start space-x-4">
                      <div className="relative">
                        <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                          <FileText className="h-8 w-8 text-white" />
                        </div>
                        {/* Status Indicator Dot */}
                        <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${validation.status.toLowerCase() === 'completed' ? 'bg-green-500' :
                          validation.status.toLowerCase() === 'failed' ? 'bg-red-500' :
                            validation.status.toLowerCase() === 'processing' ? 'bg-yellow-500' : 'bg-gray-500'
                          }`}></div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors duration-300">
                            {validation.filename}
                          </h3>
                          {/* Status Badge */}
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${getStatusColor(validation.status)}`}>
                            <div className="flex items-center space-x-1">
                              {getStatusIcon(validation.status)}
                              <span>{validation.status}</span>
                            </div>
                          </span>
                        </div>

                        {/* Metadata */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                            <span className="font-medium">ID:</span>
                            <code className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">{validation.id.slice(0, 8)}...</code>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>Created {formatDate(validation.createdAt)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                            <span>Updated {formatDate(validation.updatedAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Metrics Cards */}
                    <div className="flex flex-wrap gap-4">
                      {/* Processing Time Metric */}
                      <div className="flex-1 min-w-[120px] p-4 rounded-xl bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-100 group-hover:from-purple-100 group-hover:to-blue-100 transition-all duration-300">
                        <div className="flex items-center space-x-2 mb-1">
                          <Clock className="h-4 w-4 text-purple-600" />
                          <span className="text-xs font-medium text-purple-700 uppercase tracking-wide">Processing</span>
                        </div>
                        <div className="text-lg font-bold text-purple-800">
                          {formatProcessingTime(validation.processingTimeMs)}
                        </div>
                      </div>

                      {/* Discrepancies Metric */}
                      <div className="flex-1 min-w-[120px] p-4 rounded-xl bg-gradient-to-br from-red-50 to-pink-50 border border-red-100 group-hover:from-red-100 group-hover:to-pink-100 transition-all duration-300">
                        <div className="flex items-center space-x-2 mb-1">
                          <AlertCircle className="h-4 w-4 text-red-600" />
                          <span className="text-xs font-medium text-red-700 uppercase tracking-wide">Issues</span>
                        </div>
                        <div className="text-lg font-bold text-red-800">
                          {validation.totalDiscrepancies}
                        </div>
                      </div>

                      {/* Success Rate Metric */}
                      <div className="flex-1 min-w-[120px] p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 group-hover:from-green-100 group-hover:to-emerald-100 transition-all duration-300">
                        <div className="flex items-center space-x-2 mb-1">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-xs font-medium text-green-700 uppercase tracking-wide">Success</span>
                        </div>
                        <div className="text-lg font-bold text-green-800">
                          {validation.totalDiscrepancies === 0 ? '100%' :
                            validation.totalDiscrepancies < 5 ? '95%' :
                              validation.totalDiscrepancies < 10 ? '85%' : '75%'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons Section */}
                  <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:min-w-[160px]">
                    <Button
                      variant="outline"
                      size="default"
                      onClick={() => handleViewDetails(validation)}
                      disabled={loadingDetails}
                      className="group/btn relative overflow-hidden border-2 border-blue-200 text-blue-700 hover:text-white hover:border-blue-500 transition-all duration-300"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
                      <div className="relative flex items-center justify-center space-x-2">
                        <Eye className="h-4 w-4" />
                        <span className="font-medium">View Details</span>
                      </div>
                    </Button>

                    <Button
                      variant="outline"
                      size="default"
                      onClick={() => showDeleteConfirmation(validation)}
                      disabled={deletingValidation === validation.id}
                      className="group/btn relative overflow-hidden border-2 border-red-200 text-red-700 hover:text-white hover:border-red-500 transition-all duration-300"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-600 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
                      <div className="relative flex items-center justify-center space-x-2">
                        {deletingValidation === validation.id ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                            <span className="font-medium">Deleting...</span>
                          </>
                        ) : (
                          <>
                            <Trash2 className="h-4 w-4" />
                            <span className="font-medium">Delete</span>
                          </>
                        )}
                      </div>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && !error && validations.length > 0 && (
        <Card className="gradient-card max-w-3xl mx-auto animate-slide-up colorful-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center space-x-2">
              {/* Previous Button */}
              <Button
                variant="outline"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white hover:border-blue-500 transition-all duration-300"
              >
                Previous
              </Button>

              {/* Page Numbers */}
              {totalPages > 0 && (
                <>
                  {/* First Page */}
                  {currentPage > 3 && totalPages > 5 && (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage(1)}
                        className="hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-600 hover:text-white hover:border-purple-500 transition-all duration-300"
                      >
                        1
                      </Button>
                      {currentPage > 4 && <span className="text-muted-foreground">...</span>}
                    </>
                  )}

                  {/* Page Numbers Around Current Page */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    if (pageNum > 0 && pageNum <= totalPages) {
                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          onClick={() => setCurrentPage(pageNum)}
                          className={
                            currentPage === pageNum
                              ? "bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white border-purple-500"
                              : "hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-600 hover:text-white hover:border-purple-500 transition-all duration-300"
                          }
                        >
                          {pageNum}
                        </Button>
                      );
                    }
                    return null;
                  })}

                  {/* Last Page */}
                  {currentPage < totalPages - 2 && totalPages > 5 && (
                    <>
                      {currentPage < totalPages - 3 && <span className="text-muted-foreground">...</span>}
                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage(totalPages)}
                        className="hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-600 hover:text-white hover:border-purple-500 transition-all duration-300"
                      >
                        {totalPages}
                      </Button>
                    </>
                  )}
                </>
              )}

              {/* Next Button */}
              <Button
                variant="outline"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-600 hover:text-white hover:border-purple-500 transition-all duration-300"
              >
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Details Modal */}
      <DiscrepancyResultsModal
        isOpen={showDetailsModal}
        onClose={closeDetailsModal}
        validationId={selectedValidation?.id || ''}
        filename={selectedValidation?.filename}
        totalDiscrepancies={selectedValidation?.totalDiscrepancies || 0}
        processingTimeMs={selectedValidation?.processingTimeMs || 0}
        discrepancies={discrepancyResults}
        showValidateAnother={false}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-red-500 to-pink-600 p-6 text-white">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-xl bg-white/20">
                  <Trash2 className="h-8 w-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Delete Validation</h2>
                  <p className="text-red-100">
                    Are you sure you want to delete this validation?
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 text-red-800">
                    <AlertCircle className="h-5 w-5" />
                    <span className="font-medium">This action cannot be undone.</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-gray-700">
                    <strong>File:</strong> {showDeleteConfirm.filename}
                  </p>
                  <p className="text-gray-700">
                    <strong>Validation ID:</strong> {showDeleteConfirm.id}
                  </p>
                  <p className="text-gray-700">
                    <strong>Created:</strong> {formatDate(showDeleteConfirm.createdAt)}
                  </p>
                  <p className="text-gray-700">
                    <strong>Discrepancies:</strong> {showDeleteConfirm.totalDiscrepancies}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(null)}
                disabled={deletingValidation === showDeleteConfirm.id}
                className="hover:bg-gray-100 transition-all duration-300"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDeleteValidation(showDeleteConfirm)}
                disabled={deletingValidation === showDeleteConfirm.id}
                className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 transition-all duration-300"
              >
                {deletingValidation === showDeleteConfirm.id ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  'Delete Validation'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  // Helper function for local search
  function performLocalSearch(query: string) {
    if (!query.trim()) {
      setValidations(allValidations)
      setCurrentPage(1)
      setTotalPages(Math.ceil(allValidations.length / pageSize))
      return
    }

    const searchTerm = query.toLowerCase()
    const filtered = allValidations.filter(validation => {
      return (
        validation.filename.toLowerCase().includes(searchTerm) ||
        validation.status.toLowerCase().includes(searchTerm) ||
        formatDate(validation.createdAt).toLowerCase().includes(searchTerm)
      )
    })

    setValidations(filtered)
    setCurrentPage(1)
    setTotalPages(Math.ceil(filtered.length / pageSize))
  }

  // Helper function to get paginated validations
  function getPaginatedValidations() {
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize
    return validations.slice(startIndex, endIndex)
  }
}

