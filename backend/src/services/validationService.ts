import { DrugData, DiscrepancyResult } from '../types/validation';
import { MockApiService, ReferenceDrug } from './mockApiService';
import { config } from '../config/environment';
import { createError } from '../middleware/errorHandler';

export interface ValidationResult {
  validationId: string;
  filename: string;
  totalRows: number;
  totalDiscrepancies: number;
  discrepancies: DiscrepancyResult[];
  processingTime: number;
  createdAt: Date;
}

export class ValidationService {
  /**
   * Validate Excel data against reference drug data
   */
  static async validateExcelData(
    drugRows: DrugData[],
    filename: string
  ): Promise<ValidationResult> {
    const startTime = Date.now();
    
    try {
      console.log(`🔍 Starting validation for ${drugRows.length} drug rows`);
      
      // Fetch reference drug data
      const referenceDrugs = await MockApiService.fetchReferenceDrugs();
      console.log(`📚 Fetched ${referenceDrugs.length} reference drugs`);
      
      // Validate each drug row
      const discrepancies: DiscrepancyResult[] = [];
      
      for (let i = 0; i < drugRows.length; i++) {
        const drugRow = drugRows[i];
        const rowDiscrepancies = await this.validateDrugRow(drugRow, referenceDrugs, i + 1);
        discrepancies.push(...rowDiscrepancies);
      }
      
      const processingTime = Date.now() - startTime;
      
      const result: ValidationResult = {
        validationId: `val_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        filename,
        totalRows: drugRows.length,
        totalDiscrepancies: discrepancies.length,
        discrepancies,
        processingTime,
        createdAt: new Date(),
      };
      
      console.log(`✅ Validation completed in ${processingTime}ms`);
      console.log(`📊 Found ${discrepancies.length} discrepancies out of ${drugRows.length} rows`);
      
      return result;
      
    } catch (error) {
      console.error('❌ Validation failed:', error);
      throw createError(
        `Validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        500
      );
    }
  }
  
  /**
   * Validate a single drug row against reference data
   */
  private static async validateDrugRow(
    drugRow: DrugData,
    referenceDrugs: ReferenceDrug[],
    rowNumber: number
  ): Promise<DiscrepancyResult[]> {
    const discrepancies: DiscrepancyResult[] = [];
    
    try {
      // Find matching reference drug using fuzzy matching
      const referenceDrug = this.findMatchingReferenceDrug(drugRow, referenceDrugs);
      
      if (!referenceDrug) {
        // No reference drug found
        discrepancies.push({
          id: `disc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          validationId: '', // Will be set when saving to database
          drugName: drugRow.drugName,
          discrepancyType: 'reference_not_found',
          actualValue: `${drugRow.strength} ${drugRow.formulation}`,
          expectedValue: null,
          message: 'No matching reference drug found in database',
          severity: 'high',
          unitPrice: drugRow.unitPrice,
          strength: drugRow.strength,
          formulation: drugRow.formulation,
          payer: drugRow.payer,
          quantity: drugRow.quantity,
          createdAt: new Date().toISOString(),
        });
        return discrepancies;
      }
      
      // Validate unit price
      const unitPriceDiscrepancy = this.validateUnitPrice(drugRow, referenceDrug, rowNumber);
      if (unitPriceDiscrepancy) {
        discrepancies.push(unitPriceDiscrepancy);
      }
      
      // Validate formulation
      const formulationDiscrepancy = this.validateFormulation(drugRow, referenceDrug, rowNumber);
      if (formulationDiscrepancy) {
        discrepancies.push(formulationDiscrepancy);
      }
      
      // Validate strength
      const strengthDiscrepancy = this.validateStrength(drugRow, referenceDrug, rowNumber);
      if (strengthDiscrepancy) {
        discrepancies.push(strengthDiscrepancy);
      }
      
      // Validate payer
      const payerDiscrepancy = this.validatePayer(drugRow, referenceDrug, rowNumber);
      if (payerDiscrepancy) {
        discrepancies.push(payerDiscrepancy);
      }
      
      return discrepancies;
      
    } catch (error) {
      console.error(`❌ Error validating row ${rowNumber}:`, error);
      
      // Add error discrepancy
      discrepancies.push({
        id: `disc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        validationId: '', // Will be set when saving to database
        drugName: drugRow.drugName,
        discrepancyType: 'reference_not_found',
        actualValue: `${drugRow.strength} ${drugRow.formulation}`,
        expectedValue: null,
        message: `Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        severity: 'high',
        unitPrice: drugRow.unitPrice,
        strength: drugRow.strength,
        formulation: drugRow.formulation,
        payer: drugRow.payer,
        quantity: drugRow.quantity,
        createdAt: new Date().toISOString(),
      });
      
      return discrepancies;
    }
  }
  
  /**
   * Find matching reference drug using fuzzy matching
   */
  private static findMatchingReferenceDrug(
    drugRow: DrugData,
    referenceDrugs: ReferenceDrug[]
  ): ReferenceDrug | null {
    let bestMatch: ReferenceDrug | null = null;
    let bestScore = 0;
    
    for (const refDrug of referenceDrugs) {
      // Check if payer matches (case-insensitive)
      if (refDrug.payer && refDrug.payer.toLowerCase() !== drugRow.payer.toLowerCase()) {
        continue;
      }
      
      // Calculate similarity score for drug name
      const nameScore = this.calculateSimilarity(drugRow.drugName, refDrug.drugName);
      
      // Calculate similarity score for strength
      const strengthScore = this.calculateSimilarity(drugRow.strength, refDrug.strength || '');
      
      // Calculate similarity score for formulation
      const formulationScore = this.calculateSimilarity(drugRow.formulation, refDrug.formulation || '');
      
      // Combined score (weighted) - More lenient matching
      const totalScore = (nameScore * 0.4) + (strengthScore * 0.4) + (formulationScore * 0.2);
      
      // Lower threshold to catch more potential matches (60% instead of 70%)
      if (totalScore > bestScore && totalScore > 0.6) {
        bestScore = totalScore;
        bestMatch = refDrug;
      }
    }
    
    return bestMatch;
  }
  
  /**
   * Calculate similarity between two strings using Levenshtein distance
   */
  private static calculateSimilarity(str1: string, str2: string): number {
    if (str1 === str2) return 1;
    if (str1.length === 0) return str2.length === 0 ? 1 : 0;
    if (str2.length === 0) return 0;
    
    const matrix = [];
    
    // Initialize matrix
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    // Fill matrix
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            matrix[i][j - 1] + 1,     // insertion
            matrix[i - 1][j] + 1      // deletion
          );
        }
      }
    }
    
    // Calculate similarity as 1 - (distance / max length)
    const distance = matrix[str2.length][str1.length];
    const maxLength = Math.max(str1.length, str2.length);
    return 1 - (distance / maxLength);
  }
  
  /**
   * Validate unit price
   */
  private static validateUnitPrice(
    drugRow: DrugData,
    referenceDrug: ReferenceDrug,
    rowNumber: number
  ): DiscrepancyResult | null {
    if (!referenceDrug.unitPrice) {
      return null;
    }
    
    // Calculate if invoice price is >10% HIGHER than reference price
    const priceDifference = drugRow.unitPrice - referenceDrug.unitPrice;
    const percentageDifference = (priceDifference / referenceDrug.unitPrice) * 100;
    
    // Only flag if price is HIGHER than threshold (not lower)
    if (percentageDifference > config.unitPriceThreshold) {
      return {
        id: `disc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        validationId: '', // Will be set when saving to database
        drugName: drugRow.drugName,
        discrepancyType: 'unit_price_high',
        actualValue: `$${drugRow.unitPrice.toFixed(2)}`,
        expectedValue: `$${referenceDrug.unitPrice.toFixed(2)}`,
        message: `Unit price is ${percentageDifference.toFixed(1)}% higher than reference price`,
        severity: percentageDifference > 20 ? 'high' : 'medium',
        unitPrice: drugRow.unitPrice,
        strength: drugRow.strength,
        formulation: drugRow.formulation,
        payer: drugRow.payer,
        quantity: drugRow.quantity,
        createdAt: new Date().toISOString(),
      };
    }
    
    return null;
  }
  
  /**
   * Validate formulation
   */
  private static validateFormulation(
    drugRow: DrugData,
    referenceDrug: ReferenceDrug,
    rowNumber: number
  ): DiscrepancyResult | null {
    if (!referenceDrug.formulation) {
      return null;
    }
    
    if (drugRow.formulation.toLowerCase() !== referenceDrug.formulation.toLowerCase()) {
      return {
        id: `disc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        validationId: '', // Will be set when saving to database
        drugName: drugRow.drugName,
        discrepancyType: 'formulation_mismatch',
        actualValue: drugRow.formulation,
        expectedValue: referenceDrug.formulation,
        message: 'Formulation does not match reference data',
        severity: 'medium',
        unitPrice: drugRow.unitPrice,
        strength: drugRow.strength,
        formulation: drugRow.formulation,
        payer: drugRow.payer,
        quantity: drugRow.quantity,
        createdAt: new Date().toISOString(),
      };
    }
    
    return null;
  }
  
  /**
   * Validate strength
   */
  private static validateStrength(
    drugRow: DrugData,
    referenceDrug: ReferenceDrug,
    rowNumber: number
  ): DiscrepancyResult | null {
    if (!referenceDrug.strength) {
      return null;
    }
    
    if (drugRow.strength.toLowerCase() !== referenceDrug.strength.toLowerCase()) {
      return {
        id: `disc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        validationId: '', // Will be set when saving to database
        drugName: drugRow.drugName,
        discrepancyType: 'strength_mismatch',
        actualValue: drugRow.strength,
        expectedValue: referenceDrug.strength,
        message: 'Strength does not match reference data',
        severity: 'medium',
        unitPrice: drugRow.unitPrice,
        strength: drugRow.strength,
        formulation: drugRow.formulation,
        payer: drugRow.payer,
        quantity: drugRow.quantity,
        createdAt: new Date().toISOString(),
      };
    }
    
    return null;
  }
  
  /**
   * Validate payer
   */
  private static validatePayer(
    drugRow: DrugData,
    referenceDrug: ReferenceDrug,
    rowNumber: number
  ): DiscrepancyResult | null {
    if (!referenceDrug.payer) {
      return null;
    }
    
    if (drugRow.payer.toLowerCase() !== referenceDrug.payer.toLowerCase()) {
      return {
        id: `disc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        validationId: '', // Will be set when saving to database
        drugName: drugRow.drugName,
        discrepancyType: 'payer_mismatch',
        actualValue: drugRow.payer,
        expectedValue: referenceDrug.payer,
        message: 'Payer does not match reference data',
        severity: 'low',
        unitPrice: drugRow.unitPrice,
        strength: drugRow.strength,
        formulation: drugRow.formulation,
        payer: drugRow.payer,
        quantity: drugRow.quantity,
        createdAt: new Date().toISOString(),
      };
    }
    
    return null;
  }
}

