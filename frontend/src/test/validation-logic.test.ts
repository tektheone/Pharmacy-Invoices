import { describe, it, expect } from 'vitest'

// Mock validation logic functions
interface ValidationResult {
  isValid: boolean
  errors: string[]
}

function validateDrugName(drugName: string): ValidationResult {
  const errors: string[] = []
  
  if (!drugName || drugName.trim().length === 0) {
    errors.push('Drug name is required')
  }
  
  if (drugName && drugName.length > 100) {
    errors.push('Drug name is too long (max 100 characters)')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

function validateUnitPrice(price: number, referencePrice: number): ValidationResult {
  const errors: string[] = []
  
  if (price <= 0) {
    errors.push('Unit price must be greater than 0')
  }
  
  if (referencePrice <= 0) {
    errors.push('Reference price must be greater than 0')
  }
  
  if (price > 0 && referencePrice > 0) {
    const difference = Math.abs(price - referencePrice)
    const percentage = (difference / referencePrice) * 100
    
    if (percentage > 10) {
      errors.push(`Unit price is ${percentage.toFixed(1)}% different from reference price`)
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

function validateFormulation(formulation: string, referenceFormulation: string): ValidationResult {
  const errors: string[] = []
  
  if (!formulation || !referenceFormulation) {
    errors.push('Both formulation and reference formulation are required')
  }
  
  if (formulation && referenceFormulation && 
      formulation.toLowerCase() !== referenceFormulation.toLowerCase()) {
    errors.push(`Formulation mismatch: ${formulation} vs ${referenceFormulation}`)
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

describe('Validation Logic', () => {
  describe('Drug Name Validation', () => {
    it('should validate empty drug name', () => {
      const result = validateDrugName('')
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Drug name is required')
    })

    it('should validate valid drug name', () => {
      const result = validateDrugName('Aspirin 100mg')
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should validate drug name that is too long', () => {
      const longName = 'A'.repeat(101)
      const result = validateDrugName(longName)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Drug name is too long (max 100 characters)')
    })
  })

  describe('Unit Price Validation', () => {
    it('should validate price within acceptable range', () => {
      const result = validateUnitPrice(10.50, 10.00)
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should validate price over threshold', () => {
      const result = validateUnitPrice(12.00, 10.00)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Unit price is 20.0% different from reference price')
    })

    it('should validate invalid prices', () => {
      const result1 = validateUnitPrice(0, 10.00)
      expect(result1.isValid).toBe(false)
      expect(result1.errors).toContain('Unit price must be greater than 0')

      const result2 = validateUnitPrice(10.00, 0)
      expect(result2.isValid).toBe(false)
      expect(result2.errors).toContain('Reference price must be greater than 0')
    })
  })

  describe('Formulation Validation', () => {
    it('should validate matching formulations', () => {
      const result = validateFormulation('Tablet', 'Tablet')
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should validate case-insensitive matching', () => {
      const result = validateFormulation('tablet', 'Tablet')
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should validate formulation mismatch', () => {
      const result = validateFormulation('Tablet', 'Capsule')
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Formulation mismatch: Tablet vs Capsule')
    })

    it('should validate missing formulations', () => {
      const result = validateFormulation('', 'Tablet')
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Both formulation and reference formulation are required')
    })
  })
})
