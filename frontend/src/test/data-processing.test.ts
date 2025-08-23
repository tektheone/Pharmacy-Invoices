import { describe, it, expect } from 'vitest'

// Mock data processing functions
interface ExcelRow {
  [key: string]: string | number
}

interface ProcessedRow {
  drugName: string
  unitPrice: number
  formulation: string
  strength: string
  rowNumber: number
}

function processExcelRow(row: ExcelRow, headers: string[]): ProcessedRow | null {
  try {
    // Find column indices
    const drugNameIndex = headers.findIndex(h => 
      h.toLowerCase().includes('drug') || h.toLowerCase().includes('name')
    )
    const priceIndex = headers.findIndex(h => 
      h.toLowerCase().includes('price') || h.toLowerCase().includes('cost')
    )
    const formulationIndex = headers.findIndex(h => 
      h.toLowerCase().includes('formulation') || h.toLowerCase().includes('form')
    )
    const strengthIndex = headers.findIndex(h => 
      h.toLowerCase().includes('strength') || h.toLowerCase().includes('dose')
    )

    if (drugNameIndex === -1 || priceIndex === -1) {
      return null
    }

    const drugName = String(row[headers[drugNameIndex]] || '').trim()
    const unitPrice = parseFloat(String(row[headers[priceIndex]] || '0'))
    const formulation = String(row[headers[formulationIndex]] || '').trim()
    const strength = String(row[headers[strengthIndex]] || '').trim()

    if (!drugName || isNaN(unitPrice) || unitPrice <= 0) {
      return null
    }

    return {
      drugName,
      unitPrice,
      formulation,
      strength,
      rowNumber: parseInt(String(row['__rowNumber__'] || '0'))
    }
  } catch (error) {
    return null
  }
}

function calculatePriceDifference(invoicePrice: number, referencePrice: number): number {
  if (referencePrice <= 0) return 0
  return ((invoicePrice - referencePrice) / referencePrice) * 100
}

function formatProcessingTime(ms: number): string {
  if (ms < 1000) {
    return `${(ms / 1000).toFixed(1)}s`
  }
  return `${(ms / 1000).toFixed(1)}s`
}

function sanitizeDrugName(name: string): string {
  return name
    .replace(/[^\w\s-]/g, ' ') // Replace special characters with spaces
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim()
}

describe('Data Processing', () => {
  describe('Excel Row Processing', () => {
    const headers = ['Drug Name', 'Unit Price', 'Formulation', 'Strength', '__rowNumber__']

    it('should process valid Excel row', () => {
      const row: ExcelRow = {
        'Drug Name': 'Aspirin 100mg',
        'Unit Price': '15.50',
        'Formulation': 'Tablet',
        'Strength': '100mg',
        '__rowNumber__': '1'
      }

      const result = processExcelRow(row, headers)
      expect(result).toEqual({
        drugName: 'Aspirin 100mg',
        unitPrice: 15.50,
        formulation: 'Tablet',
        strength: '100mg',
        rowNumber: 1
      })
    })

    it('should handle missing optional columns', () => {
      const row: ExcelRow = {
        'Drug Name': 'Paracetamol',
        'Unit Price': '12.00',
        '__rowNumber__': '2'
      }

      const result = processExcelRow(row, headers)
      expect(result).toEqual({
        drugName: 'Paracetamol',
        unitPrice: 12.00,
        formulation: '',
        strength: '',
        rowNumber: 2
      })
    })

    it('should return null for invalid data', () => {
      const row: ExcelRow = {
        'Drug Name': '',
        'Unit Price': 'invalid',
        '__rowNumber__': '3'
      }

      const result = processExcelRow(row, headers)
      expect(result).toBeNull()
    })

    it('should handle case-insensitive header matching', () => {
      const customHeaders = ['drug name', 'unit price', 'formulation', 'strength', '__rowNumber__']
      const row: ExcelRow = {
        'drug name': 'Ibuprofen',
        'unit price': '18.75',
        '__rowNumber__': '4'
      }

      const result = processExcelRow(row, customHeaders)
      expect(result?.drugName).toBe('Ibuprofen')
      expect(result?.unitPrice).toBe(18.75)
    })
  })

  describe('Price Calculations', () => {
    it('should calculate price difference correctly', () => {
      expect(calculatePriceDifference(11.00, 10.00)).toBe(10)
      expect(calculatePriceDifference(9.00, 10.00)).toBe(-10)
      expect(calculatePriceDifference(15.00, 10.00)).toBe(50)
    })

    it('should handle edge cases', () => {
      expect(calculatePriceDifference(10.00, 0)).toBe(0)
      expect(calculatePriceDifference(0, 10.00)).toBe(-100)
    })
  })

  describe('Formatting Functions', () => {
    it('should format processing time correctly', () => {
      expect(formatProcessingTime(500)).toBe('0.5s')
      expect(formatProcessingTime(1500)).toBe('1.5s')
      expect(formatProcessingTime(100)).toBe('0.1s')
    })

    it('should sanitize drug names', () => {
      expect(sanitizeDrugName('Aspirin@100mg!')).toBe('Aspirin 100mg')
      expect(sanitizeDrugName('  Paracetamol  500mg  ')).toBe('Paracetamol 500mg')
      expect(sanitizeDrugName('Ibuprofen-200mg')).toBe('Ibuprofen-200mg')
    })
  })
})
