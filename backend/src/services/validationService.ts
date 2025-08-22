import { DrugRow, DiscrepancyResult } from '../types/validation';
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
    drugRows: DrugRow[],
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
    drugRow: DrugRow,
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
          drugName: drugRow.drugName,
          discrepancyType: 'formulation',
          recordedValue: `${drugRow.strength} ${drugRow.formulation}`,
          expectedValue: undefined,
          details: 'No matching reference drug found in database',
          severity: 'high',
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
      
    } catch (error) {
      console.error(`Error validating row ${rowNumber}:`, error);
      discrepancies.push({
        id: `disc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        drugName: drugRow.drugName,
        discrepancyType: 'formulation',
        recordedValue: 'Error during validation',
        expectedValue: undefined,
        details: `Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        severity: 'high',
        createdAt: new Date().toISOString(),
      });
    }
    
    return discrepancies;
  }
  
  /**
   * Find matching reference drug using fuzzy matching
   */
  private static findMatchingReferenceDrug(
    drugRow: DrugRow,
    referenceDrugs: ReferenceDrug[]
  ): ReferenceDrug | null {
    // First try exact match on drug name and strength
    let exactMatch = referenceDrugs.find(drug => 
      drug.drugName.toLowerCase() === drugRow.drugName.toLowerCase() &&
      drug.strength.toLowerCase() === drugRow.strength.toLowerCase()
    );
    
    if (exactMatch) {
      return exactMatch;
    }
    
    // Try fuzzy matching on drug name (case-insensitive)
    const fuzzyMatches = referenceDrugs.filter(drug => {
      const drugNameSimilarity = this.calculateSimilarity(
        drug.drugName.toLowerCase(),
        drugRow.drugName.toLowerCase()
      );
      
      const strengthSimilarity = this.calculateSimilarity(
        drug.strength.toLowerCase(),
        drugRow.strength.toLowerCase()
      );
      
      // Consider it a match if both name and strength have >70% similarity
      return drugNameSimilarity > 0.7 && strengthSimilarity > 0.7;
    });
    
    if (fuzzyMatches.length > 0) {
      // Return the best match
      return fuzzyMatches.sort((a, b) => {
        const aScore = this.calculateSimilarity(a.drugName.toLowerCase(), drugRow.drugName.toLowerCase());
        const bScore = this.calculateSimilarity(b.drugName.toLowerCase(), drugRow.drugName.toLowerCase());
        return bScore - aScore;
      })[0];
    }
    
    return null;
  }
  
  /**
   * Calculate string similarity using Levenshtein distance
   */
  private static calculateSimilarity(str1: string, str2: string): number {
    const maxLength = Math.max(str1.length, str2.length);
    if (maxLength === 0) return 1.0;
    
    const distance = this.levenshteinDistance(str1, str2);
    return (maxLength - distance) / maxLength;
  }
  
  /**
   * Calculate Levenshtein distance between two strings
   */
  private static levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
    
    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1, // deletion
          matrix[j - 1][i] + 1, // insertion
          matrix[j - 1][i - 1] + indicator // substitution
        );
      }
    }
    
    return matrix[str2.length][str1.length];
  }
  
  /**
   * Validate unit price against reference price
   */
  private static validateUnitPrice(
    drugRow: DrugRow,
    referenceDrug: ReferenceDrug,
    rowNumber: number
  ): DiscrepancyResult | null {
    const threshold = config.unitPriceThreshold / 100; // Convert percentage to decimal
    const priceDifference = (drugRow.unitPrice - referenceDrug.unitPrice) / referenceDrug.unitPrice;
    
    if (priceDifference > threshold) {
      return {
        id: `disc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        drugName: drugRow.drugName,
        discrepancyType: 'unit_price',
        recordedValue: `$${drugRow.unitPrice.toFixed(2)}`,
        expectedValue: `$${referenceDrug.unitPrice.toFixed(2)}`,
        details: `Unit price ${(priceDifference * 100).toFixed(1)}% above reference price (threshold: ${config.unitPriceThreshold}%)`,
        severity: priceDifference > threshold * 2 ? 'high' : 'medium',
        createdAt: new Date().toISOString(),
      };
    }
    
    return null;
  }
  
  /**
   * Validate formulation
   */
  private static validateFormulation(
    drugRow: DrugRow,
    referenceDrug: ReferenceDrug,
    rowNumber: number
  ): DiscrepancyResult | null {
    if (drugRow.formulation.toLowerCase() !== referenceDrug.formulation.toLowerCase()) {
      return {
        id: `disc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        drugName: drugRow.drugName,
        discrepancyType: 'formulation',
        recordedValue: drugRow.formulation,
        expectedValue: referenceDrug.formulation,
        details: 'Formulation does not match reference data',
        severity: 'medium',
        createdAt: new Date().toISOString(),
      };
    }
    
    return null;
  }
  
  /**
   * Validate strength
   */
  private static validateStrength(
    drugRow: DrugRow,
    referenceDrug: ReferenceDrug,
    rowNumber: number
  ): DiscrepancyResult | null {
    if (drugRow.strength.toLowerCase() !== referenceDrug.strength.toLowerCase()) {
      return {
        id: `disc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        drugName: drugRow.drugName,
        discrepancyType: 'strength',
        recordedValue: drugRow.strength,
        expectedValue: referenceDrug.strength,
        details: 'Strength does not match reference data',
        severity: 'medium',
        createdAt: new Date().toISOString(),
      };
    }
    
    return null;
  }
  
  /**
   * Validate payer
   */
  private static validatePayer(
    drugRow: DrugRow,
    referenceDrug: ReferenceDrug,
    rowNumber: number
  ): DiscrepancyResult | null {
    if (drugRow.payer !== referenceDrug.payer) {
      return {
        id: `disc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        drugName: drugRow.drugName,
        discrepancyType: 'payer',
        recordedValue: drugRow.payer,
        expectedValue: referenceDrug.payer,
        details: 'Payer does not match reference data',
        severity: 'low',
        createdAt: new Date().toISOString(),
      };
    }
    
    return null;
  }
}

