import axios from 'axios';
import { config } from '../config/environment';
import { createError } from '../middleware/errorHandler';

export interface ReferenceDrug {
  id: string;
  drugName: string;
  strength: string;
  formulation: string;
  unitPrice: number;
  payer: 'medicaid' | 'medicare';
  createdAt: string;
  updatedAt: string;
}

export class MockApiService {
  private static readonly baseUrl = config.mockApiUrl;
  private static readonly timeout = 10000; // 10 seconds
  
  /**
   * Fetch reference drug data from MockAPI
   */
  static async fetchReferenceDrugs(): Promise<ReferenceDrug[]> {
    try {
      console.log(`🔗 Fetching reference drugs from: ${this.baseUrl}`);
      
      const response = await axios.get(this.baseUrl, {
        timeout: this.timeout,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.status !== 200) {
        throw createError(`MockAPI returned status ${response.status}`, 500);
      }
      
      const drugs = response.data;
      
      if (!Array.isArray(drugs)) {
        throw createError('MockAPI response is not an array', 500);
      }
      
      // Validate and transform the response
      const validatedDrugs = drugs.map((drug, index) => {
        try {
          return this.validateReferenceDrug(drug, index);
        } catch (error) {
          console.warn(`⚠️  Skipping invalid drug at index ${index}:`, error);
          return null;
        }
      }).filter(Boolean) as ReferenceDrug[];
      
      console.log(`✅ Fetched ${validatedDrugs.length} valid reference drugs`);
      return validatedDrugs;
      
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          throw createError('MockAPI request timeout', 500);
        }
        if (error.response) {
          throw createError(`MockAPI error: ${error.response.status} - ${error.response.statusText}`, 500);
        }
        if (error.request) {
          throw createError('MockAPI network error - no response received', 500);
        }
      }
      
      throw createError(`Failed to fetch reference drugs: ${error instanceof Error ? error.message : 'Unknown error'}`, 500);
    }
  }
  
  /**
   * Fetch a specific drug by name and strength
   */
  static async fetchDrugByName(drugName: string, strength: string): Promise<ReferenceDrug | null> {
    try {
      const allDrugs = await this.fetchReferenceDrugs();
      
      // Find matching drug (case-insensitive)
      const matchingDrug = allDrugs.find(drug => 
        drug.drugName.toLowerCase() === drugName.toLowerCase() &&
        drug.strength.toLowerCase() === strength.toLowerCase()
      );
      
      return matchingDrug || null;
      
    } catch (error) {
      console.error('Error fetching drug by name:', error);
      return null;
    }
  }
  
  /**
   * Validate reference drug data structure
   */
  private static validateReferenceDrug(drug: any, index: number): ReferenceDrug {
    if (!drug || typeof drug !== 'object') {
      throw new Error('Drug must be an object');
    }
    
    if (!drug.id || typeof drug.id !== 'string') {
      throw new Error('Drug ID is required and must be a string');
    }
    
    if (!drug.drugName || typeof drug.drugName !== 'string') {
      throw new Error('Drug name is required and must be a string');
    }
    
    if (!drug.strength || typeof drug.strength !== 'string') {
      throw new Error('Drug strength is required and must be a string');
    }
    
    if (!drug.formulation || typeof drug.formulation !== 'string') {
      throw new Error('Drug formulation is required and must be a string');
    }
    
    if (typeof drug.unitPrice !== 'number' || drug.unitPrice <= 0) {
      throw new Error('Drug unit price is required and must be a positive number');
    }
    
    if (!drug.payer || !['medicaid', 'medicare'].includes(drug.payer)) {
      throw new Error('Drug payer is required and must be medicaid or medicare');
    }
    
    return {
      id: drug.id,
      drugName: drug.drugName,
      strength: drug.strength,
      formulation: drug.formulation,
      unitPrice: drug.unitPrice,
      payer: drug.payer,
      createdAt: drug.createdAt || new Date().toISOString(),
      updatedAt: drug.updatedAt || new Date().toISOString(),
    };
  }
  
  /**
   * Test MockAPI connectivity
   */
  static async testConnectivity(): Promise<boolean> {
    try {
      await this.fetchReferenceDrugs();
      return true;
    } catch (error) {
      console.error('MockAPI connectivity test failed:', error);
      return false;
    }
  }
}
