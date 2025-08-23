import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { DiscrepancyResultsModal } from './DiscrepancyResultsModal'

// Mock data for testing
const mockDiscrepancies = [
 {
  id: '1',
  rowNumber: 1,
  drugName: 'Test Drug 1',
  issueType: 'UNIT_PRICE_OVER_THRESHOLD',
  description: 'Unit price is 15% over reference price',
  severity: 'HIGH',
  referenceData: {
   unitPrice: 10.00,
   formulation: 'Tablet',
   strength: '100mg'
  },
  invoiceData: {
   unitPrice: 11.50,
   formulation: 'Tablet',
   strength: '100mg'
  }
 },
 {
  id: '2',
  rowNumber: 5,
  drugName: 'Test Drug 2',
  issueType: 'FORMULATION_MISMATCH',
  description: 'Formulation mismatch: Tablet vs Capsule',
  severity: 'MEDIUM',
  referenceData: {
   unitPrice: 15.00,
   formulation: 'Tablet',
   strength: '200mg'
  },
  invoiceData: {
   unitPrice: 15.00,
   formulation: 'Capsule',
   strength: '200mg'
  }
 }
]

const defaultProps = {
 isOpen: true,
 onClose: vi.fn(),
 validationId: 'test-validation-123',
 filename: 'test-invoice.xlsx',
 totalDiscrepancies: 2,
 processingTimeMs: 1500,
 discrepancies: mockDiscrepancies,
 showValidateAnother: false
}

describe('DiscrepancyResultsModal', () => {
 it('renders when open', () => {
  render(<DiscrepancyResultsModal {...defaultProps} />)

  expect(screen.getByText('Validation Results')).toBeInTheDocument()
  expect(screen.getByText('test-invoice.xlsx')).toBeInTheDocument()
  expect(screen.getByText('2')).toBeInTheDocument() // Total discrepancies
 })

 it('does not render when closed', () => {
  render(<DiscrepancyResultsModal {...defaultProps} isOpen={false} />)

  expect(screen.queryByText('Validation Results')).not.toBeInTheDocument()
 })

 it('displays validation summary correctly', () => {
  render(<DiscrepancyResultsModal {...defaultProps} />)

  expect(screen.getByText('test-validation-123')).toBeInTheDocument()
  expect(screen.getByText('test-invoice.xlsx')).toBeInTheDocument()
  expect(screen.getByText('2')).toBeInTheDocument() // Total discrepancies
  expect(screen.getByText('1.5s')).toBeInTheDocument() // Processing time
 })

 it('displays discrepancies list', () => {
  render(<DiscrepancyResultsModal {...defaultProps} />)

  expect(screen.getByText('Test Drug 1')).toBeInTheDocument()
  expect(screen.getByText('Test Drug 2')).toBeInTheDocument()
  expect(screen.getByText('Row 1')).toBeInTheDocument()
  expect(screen.getByText('Row 5')).toBeInTheDocument()
 })

 it('shows correct issue types and descriptions', () => {
  render(<DiscrepancyResultsModal {...defaultProps} />)

  expect(screen.getByText('Unit Price Over Threshold')).toBeInTheDocument()
  expect(screen.getByText('Formulation Mismatch')).toBeInTheDocument()
  expect(screen.getByText('Unit price is 15% over reference price')).toBeInTheDocument()
  expect(screen.getByText('Formulation mismatch: Tablet vs Capsule')).toBeInTheDocument()
 })

 it('displays severity indicators', () => {
  render(<DiscrepancyResultsModal {...defaultProps} />)

  expect(screen.getByText('HIGH')).toBeInTheDocument()
  expect(screen.getByText('MEDIUM')).toBeInTheDocument()
 })

 it('shows reference and invoice data comparison', () => {
  render(<DiscrepancyResultsModal {...defaultProps} />)

  // Reference data
  expect(screen.getByText('Reference: $10.00')).toBeInTheDocument()
  expect(screen.getByText('Reference: Tablet')).toBeInTheDocument()
  expect(screen.getByText('Reference: 100mg')).toBeInTheDocument()

  // Invoice data
  expect(screen.getByText('Invoice: $11.50')).toBeInTheDocument()
  expect(screen.getByText('Invoice: Tablet')).toBeInTheDocument()
  expect(screen.getByText('Invoice: 100mg')).toBeInTheDocument()
 })

 it('calls onClose when close button is clicked', () => {
  const onClose = vi.fn()
  render(<DiscrepancyResultsModal {...defaultProps} onClose={onClose} />)

  const closeButton = screen.getByRole('button', { name: /close/i })
  fireEvent.click(closeButton)

  expect(onClose).toHaveBeenCalledTimes(1)
 })

 it('calls onClose when clicking outside modal', () => {
  const onClose = vi.fn()
  render(<DiscrepancyResultsModal {...defaultProps} onClose={onClose} />)

  const backdrop = screen.getByTestId('modal-backdrop')
  fireEvent.click(backdrop)

  expect(onClose).toHaveBeenCalledTimes(1)
 })

 it('shows Validate Another button when showValidateAnother is true', () => {
  render(<DiscrepancyResultsModal {...defaultProps} showValidateAnother={true} />)

  expect(screen.getByText('Validate Another File')).toBeInTheDocument()
 })

 it('does not show Validate Another button when showValidateAnother is false', () => {
  render(<DiscrepancyResultsModal {...defaultProps} showValidateAnother={false} />)

  expect(screen.queryByText('Validate Another File')).not.toBeInTheDocument()
 })

 it('calls onValidateAnother when Validate Another button is clicked', () => {
  const onValidateAnother = vi.fn()
  render(
   <DiscrepancyResultsModal
    {...defaultProps}
    showValidateAnother={true}
    onValidateAnother={onValidateAnother}
   />
  )

  const validateAnotherButton = screen.getByText('Validate Another File')
  fireEvent.click(validateAnotherButton)

  expect(onValidateAnother).toHaveBeenCalledTimes(1)
 })

 it('handles empty discrepancies list', () => {
  render(
   <DiscrepancyResultsModal
    {...defaultProps}
    totalDiscrepancies={0}
    discrepancies={[]}
   />
  )

  expect(screen.getByText('0')).toBeInTheDocument() // Total discrepancies
  expect(screen.getByText('No discrepancies found')).toBeInTheDocument()
 })

 it('displays processing time in correct format', () => {
  const { rerender } = render(
   <DiscrepancyResultsModal {...defaultProps} processingTimeMs={500} />
  )
  expect(screen.getByText('0.5s')).toBeInTheDocument()

  rerender(<DiscrepancyResultsModal {...defaultProps} processingTimeMs={2000} />)
  expect(screen.getByText('2.0s')).toBeInTheDocument()

  rerender(<DiscrepancyResultsModal {...defaultProps} processingTimeMs={100} />)
  expect(screen.getByText('0.1s')).toBeInTheDocument()
 })

 it('handles different issue types correctly', () => {
  const customDiscrepancies = [
   {
    id: '3',
    rowNumber: 10,
    drugName: 'Custom Drug',
    issueType: 'STRENGTH_MISMATCH',
    description: 'Strength mismatch',
    severity: 'LOW',
    referenceData: { strength: '50mg' },
    invoiceData: { strength: '100mg' }
   }
  ]

  render(
   <DiscrepancyResultsModal
    {...defaultProps}
    discrepancies={customDiscrepancies}
    totalDiscrepancies={1}
   />
  )

  expect(screen.getByText('Strength Mismatch')).toBeInTheDocument()
  expect(screen.getByText('LOW')).toBeInTheDocument()
 })

 it('maintains accessibility attributes', () => {
  render(<DiscrepancyResultsModal {...defaultProps} />)

  const modal = screen.getByRole('dialog')
  expect(modal).toHaveAttribute('aria-modal', 'true')

  const closeButton = screen.getByRole('button', { name: /close/i })
  expect(closeButton).toBeInTheDocument()
 })
})
