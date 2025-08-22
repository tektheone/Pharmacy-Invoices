export interface ValidationResult {
  id: string
  filename: string
  status: string
  totalDiscrepancies: number
  processingTimeMs: number
  createdAt: string
  updatedAt: string
  results?: DiscrepancyResult[]
}

export interface DiscrepancyResult {
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

export interface SearchFilters {
  query?: string
  startDate?: string
  endDate?: string
  discrepancyType?: string
  page?: number
  limit?: number
}
