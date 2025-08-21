import * as XLSX from 'xlsx';
import { DrugRow, ExcelFile } from '../types/validation';
import { createError } from '../middleware/errorHandler';

export class ExcelService {
  /**
   * Parse Excel file and extract drug data
   */
  static async parseExcelFile(buffer: Buffer, filename: string): Promise<ExcelFile> {
    try {
      // Read the Excel file
      const workbook = XLSX.read(buffer, { type: 'buffer' });
      
      // Get the first sheet
      const sheetName = workbook.SheetNames[0];
      if (!sheetName) {
        throw createError('No sheets found in Excel file', 400);
      }
      
      const worksheet = workbook.Sheets[sheetName];
      
      // Convert sheet to JSON
      const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      // Remove header row and empty rows
      const dataRows = rawData.slice(1).filter(row => 
        row && Array.isArray(row) && row.some(cell => cell !== null && cell !== undefined)
      );
      
      // Map raw data to DrugRow objects
      const drugRows: DrugRow[] = dataRows.map((row: any[], index: number) => {
        try {
          return {
            drugName: this.sanitizeString(row[0]),
            strength: this.sanitizeString(row[1]),
            formulation: this.sanitizeString(row[2]),
            doseInstructions: this.sanitizeString(row[3]) || '',
            payer: this.normalizePayer(row[4]),
            quantity: this.parseNumber(row[5]),
            unitPrice: this.parseNumber(row[6]),
            total: this.parseNumber(row[7]),
          };
        } catch (error) {
          throw createError(
            `Error parsing row ${index + 2}: ${error instanceof Error ? error.message : 'Unknown error'}`,
            400
          );
        }
      });
      
      if (drugRows.length === 0) {
        throw createError('No valid drug data found in Excel file', 400);
      }
      
      return { rows: drugRows };
      
    } catch (error) {
      if (error instanceof Error && 'statusCode' in error) {
        throw error;
      }
      throw createError(`Failed to parse Excel file: ${error instanceof Error ? error.message : 'Unknown error'}`, 400);
    }
  }
  
  /**
   * Sanitize string values
   */
  private static sanitizeString(value: any): string {
    if (value === null || value === undefined) {
      throw new Error('Value is required');
    }
    
    const stringValue = String(value).trim();
    if (stringValue.length === 0) {
      throw new Error('Value cannot be empty');
    }
    
    return stringValue;
  }
  
  /**
   * Parse and validate number values
   */
  private static parseNumber(value: any): number {
    if (value === null || value === undefined) {
      throw new Error('Value is required');
    }
    
    const num = Number(value);
    if (isNaN(num) || num <= 0) {
      throw new Error('Value must be a positive number');
    }
    
    return num;
  }
  
  /**
   * Normalize payer values
   */
  private static normalizePayer(value: any): 'medicaid' | 'medicare' {
    const payer = this.sanitizeString(value).toLowerCase();
    
    if (payer === 'medicaid' || payer === 'medicare') {
      return payer;
    }
    
    throw new Error('Payer must be either medicaid or medicare');
  }
  
  /**
   * Validate Excel file structure
   */
  static validateExcelStructure(buffer: Buffer): boolean {
    try {
      const workbook = XLSX.read(buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      
      if (!sheetName) {
        return false;
      }
      
      const worksheet = workbook.Sheets[sheetName];
      const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
      
      // Check if we have at least 8 columns (drug data structure)
      return range.e.c >= 7; // 0-indexed, so 7 means 8 columns
      
    } catch (error) {
      return false;
    }
  }
}
