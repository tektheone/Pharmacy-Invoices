import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/atoms/Card'
import { Button } from '@/components/atoms/Button'
import { CheckCircle, X, Eye } from 'lucide-react'
import { DiscrepancyResult } from '@/types'

interface DiscrepancyResultsModalProps {
 isOpen: boolean
 onClose: () => void
 validationId: string
 filename?: string
 totalDiscrepancies: number
 processingTimeMs: number
 discrepancies: DiscrepancyResult[]
 showValidateAnother?: boolean
 onValidateAnother?: () => void
}

export function DiscrepancyResultsModal({
 isOpen,
 onClose,
 validationId,
 filename,
 totalDiscrepancies,
 processingTimeMs,
 discrepancies,
 showValidateAnother = false,
 onValidateAnother
}: DiscrepancyResultsModalProps) {
 if (!isOpen) return null

 return (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
   <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
    {/* Modal Header */}
    <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
     <div className="flex items-center justify-between">
      <div>
       <h2 className="text-2xl font-bold">Validation Results</h2>
       <p className="text-purple-100 mt-1">
        {filename && `File: ${filename} | `}ID: {validationId}
       </p>
      </div>
      <Button
       variant="ghost"
       size="sm"
       onClick={onClose}
       className="text-white hover:bg-white/20"
      >
       <X className="h-6 w-6" />
      </Button>
     </div>
    </div>

    {/* Modal Content */}
    <div className="p-6 overflow-y-auto max-h-[60vh]">
     {/* Summary Stats */}
     <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="text-center p-4 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200">
       <div className="text-2xl font-bold text-blue-700">{totalDiscrepancies}</div>
       <div className="text-sm text-blue-600">Total Discrepancies</div>
      </div>
      <div className="text-center p-4 rounded-xl bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200">
       <div className="text-2xl font-bold text-purple-700">
        {processingTimeMs < 1000
         ? `${processingTimeMs}ms`
         : `${(processingTimeMs / 1000).toFixed(2)}s`}
       </div>
       <div className="text-sm text-purple-600">Processing Time</div>
      </div>
      <div className="text-center p-4 rounded-xl bg-gradient-to-r from-green-50 to-green-100 border border-green-200">
       <div className="text-2xl font-bold text-green-700">
        {discrepancies.length > 0 ? 'Issues Found' : 'No Issues'}
       </div>
       <div className="text-sm text-green-600">Status</div>
      </div>
     </div>

     {/* Discrepancies List */}
     {discrepancies.length > 0 ? (
      <div className="space-y-4">
       <h3 className="text-lg font-semibold text-gray-800">Discrepancy Details</h3>
       {discrepancies.map((discrepancy) => (
        <div
         key={discrepancy.id}
         className="p-4 rounded-lg border border-gray-200 bg-gradient-to-r from-red-50 to-pink-50"
        >
         <div className="flex items-start justify-between">
          <div className="flex-1">
           <div className="flex items-center space-x-2 mb-2">
            <span className="font-semibold text-gray-800">{discrepancy.drugName}</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${discrepancy.severity === 'high' ? 'bg-red-100 text-red-800' :
              discrepancy.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
               'bg-blue-100 text-blue-800'
             }`}>
             {discrepancy.severity.toUpperCase()}
            </span>
           </div>
           <div className="text-sm text-gray-600 space-y-1">
            <div><strong>Type:</strong> {discrepancy.discrepancyType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
            <div><strong>Message:</strong> {discrepancy.message}</div>
            {discrepancy.actualValue && (
             <div><strong>Actual Value:</strong> {discrepancy.actualValue}</div>
            )}
            {discrepancy.expectedValue && (
             <div><strong>Expected Value:</strong> {discrepancy.expectedValue}</div>
            )}
            {discrepancy.strength && (
             <div><strong>Strength:</strong> {discrepancy.strength}</div>
            )}
            {discrepancy.formulation && (
             <div><strong>Formulation:</strong> {discrepancy.formulation}</div>
            )}
            {discrepancy.unitPrice && (
             <div><strong>Unit Price:</strong> ${discrepancy.unitPrice.toFixed(2)}</div>
            )}
            {discrepancy.payer && (
             <div><strong>Payer:</strong> {discrepancy.payer}</div>
            )}
            {discrepancy.quantity && (
             <div><strong>Quantity:</strong> {discrepancy.quantity}</div>
            )}
           </div>
          </div>
         </div>
        </div>
       ))}
      </div>
     ) : (
      <div className="text-center py-8">
       <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
       <h3 className="text-xl font-semibold text-gray-800 mb-2">No Discrepancies Found!</h3>
       <p className="text-gray-600">Your invoice data passed all validation checks.</p>
      </div>
     )}
    </div>

    {/* Modal Footer */}
    <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
     <Button
      variant="outline"
      onClick={onClose}
      className="hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-600 hover:text-white hover:border-purple-500 transition-all duration-300"
     >
      Close
     </Button>
     {showValidateAnother && onValidateAnother && (
      <Button
       onClick={onValidateAnother}
       className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 transition-all duration-300"
      >
       Validate Another File
      </Button>
     )}
    </div>
   </div>
  </div>
 )
}
