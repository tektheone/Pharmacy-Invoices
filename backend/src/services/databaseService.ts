import { PrismaClient } from '@prisma/client';
import { ValidationResult, DiscrepancyResult } from '../types/validation';

export class DatabaseService {
  private static prisma: PrismaClient | null = null;

  private static async initialize() {
    if (!this.prisma) {
      this.prisma = new PrismaClient({
        datasources: {
          db: {
            url: process.env.DATABASE_URL,
          },
        },
      });
    }
  }

  private static getClient(): PrismaClient {
    if (!this.prisma) {
      throw new Error('Database service not initialized');
    }
    return this.prisma!;
  }

  /**
   * Initialize database connection
   */
  static async connect() {
    await this.initialize();
    try {
      await this.prisma!.$connect();
      console.log('✅ Connected to database');
    } catch (error) {
      console.error('❌ Failed to connect to database:', error);
      throw new Error(`Failed to connect to database: ${error instanceof Error ? error.message : 'Database error'}`);
    }
  }

  /**
   * Close database connection
   */
  static async disconnect() {
    if (this.prisma) {
      await this.prisma.$disconnect();
      this.prisma = null;
      console.log('✅ Disconnected from database');
    }
  }

  /**
   * Create a new validation record
   */
  static async createValidation(filename: string): Promise<ValidationResult> {
    try {
      const validation = await this.getClient().validation.create({
        data: {
          filename,
          status: 'pending',
          totalDiscrepancies: 0,
          processingTimeMs: 0,
          totalRows: 0, // Add missing field
        },
      });

      return {
        id: validation.id,
        filename: validation.filename,
        status: validation.status,
        totalDiscrepancies: validation.totalDiscrepancies,
        processingTimeMs: validation.processingTimeMs || 0,
        createdAt: validation.createdAt.toISOString(),
        updatedAt: validation.uploadedAt.toISOString(),
      };
    } catch (error) {
      console.error('❌ Failed to create validation:', error);
      throw new Error(`Failed to create validation: ${error instanceof Error ? error.message : 'Database error'}`);
    }
  }

  /**
   * Update validation status
   */
  static async updateValidationStatus(
    id: string, 
    status: string, 
    totalDiscrepancies: number, 
    processingTimeMs: number
  ): Promise<ValidationResult> {
    try {
      const validation = await this.getClient().validation.update({
        where: { id },
        data: {
          status,
          totalDiscrepancies,
          processingTimeMs,
        },
      });

      return {
        id: validation.id,
        filename: validation.filename,
        status: validation.status,
        totalDiscrepancies: validation.totalDiscrepancies,
        processingTimeMs: validation.processingTimeMs || 0,
        createdAt: validation.createdAt.toISOString(),
        updatedAt: validation.uploadedAt.toISOString(),
      };
    } catch (error) {
      console.error('❌ Failed to update validation status:', error);
      throw new Error(`Failed to update validation status: ${error instanceof Error ? error.message : 'Database error'}`);
    }
  }

  /**
   * Get validation by ID
   */
  static async getValidation(id: string): Promise<ValidationResult | null> {
    try {
      const validation = await this.getClient().validation.findUnique({
        where: { id },
      });

      if (!validation) {
        return null;
      }

      return {
        id: validation.id,
        filename: validation.filename,
        status: validation.status,
        totalDiscrepancies: validation.totalDiscrepancies,
        processingTimeMs: validation.processingTimeMs || 0,
        createdAt: validation.createdAt.toISOString(),
        updatedAt: validation.uploadedAt.toISOString(),
      };
    } catch (error) {
      console.error('❌ Failed to get validation:', error);
      throw new Error(`Failed to get validation: ${error instanceof Error ? error.message : 'Database error'}`);
    }
  }

  /**
   * Get validation history with pagination
   */
  static async getValidationHistory(page: number = 1, limit: number = 20): Promise<{
    validations: ValidationResult[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    try {
      const skip = (page - 1) * limit;

      const [validations, total] = await Promise.all([
        this.getClient().validation.findMany({
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
        }),
        this.getClient().validation.count(),
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        validations: validations.map(validation => ({
          id: validation.id,
          filename: validation.filename,
          status: validation.status,
          totalDiscrepancies: validation.totalDiscrepancies,
          processingTimeMs: validation.processingTimeMs || 0,
          createdAt: validation.createdAt.toISOString(),
          updatedAt: validation.uploadedAt.toISOString(),
        })),
        total,
        page,
        limit,
        totalPages,
      };
    } catch (error) {
      console.error('❌ Failed to get validation history:', error);
      throw new Error(`Failed to get validation history: ${error instanceof Error ? error.message : 'Database error'}`);
    }
  }

  /**
   * Search validations with enhanced search capabilities
   */
  static async searchValidations(query: string, page: number = 1, limit: number = 20): Promise<{
    validations: ValidationResult[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    try {
      const skip = (page - 1) * limit;

      // Parse query for different search types
      const searchQuery = query.trim().toLowerCase();
      
      // Check if query looks like a date
      const isDateQuery = /^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}$/.test(searchQuery) || 
                         /^\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}$/.test(searchQuery) ||
                         /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i.test(searchQuery);

      // Build search conditions with proper Prisma types
      const searchConditions: any = {
        OR: [
          // Filename search (partial match)
          { filename: { contains: searchQuery, mode: 'insensitive' } },
          
          // Status search (partial match)
          { status: { contains: searchQuery, mode: 'insensitive' } },
        ],
      };

      // If it's a date query, also search in date ranges
      if (isDateQuery) {
        // Try to parse the date and search around it
        try {
          const parsedDate = new Date(searchQuery);
          if (!isNaN(parsedDate.getTime())) {
            const startDate = new Date(parsedDate);
            startDate.setHours(0, 0, 0, 0);
            const endDate = new Date(parsedDate);
            endDate.setHours(23, 59, 59, 999);
            
            searchConditions.OR.push({
              createdAt: {
                gte: startDate,
                lte: endDate,
              }
            });
          }
        } catch (e) {
          // Ignore date parsing errors
        }
      }

      const [validations, total] = await Promise.all([
        this.getClient().validation.findMany({
          where: searchConditions,
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
        }),
        this.getClient().validation.count({
          where: searchConditions,
        }),
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        validations: validations.map(validation => ({
          id: validation.id,
          filename: validation.filename,
          status: validation.status,
          totalDiscrepancies: validation.totalDiscrepancies,
          processingTimeMs: validation.processingTimeMs || 0,
          createdAt: validation.createdAt.toISOString(),
          updatedAt: validation.uploadedAt.toISOString(),
        })),
        total,
        page,
        limit,
        totalPages,
      };
    } catch (error) {
      console.error('❌ Failed to search validations:', error);
      throw new Error(`Failed to search validations: ${error instanceof Error ? error.message : 'Database error'}`);
    }
  }

  /**
   * Create discrepancy results for a validation
   */
  static async createDiscrepancyResults(
    validationId: string, 
    discrepancies: Omit<DiscrepancyResult, 'id' | 'validationId' | 'createdAt'>[]
  ): Promise<DiscrepancyResult[]> {
    try {
      const results = await this.getClient().validationResult.createMany({
        data: discrepancies.map(discrepancy => ({
          validationId,
          drugName: discrepancy.drugName,
          discrepancyType: discrepancy.discrepancyType,
          actualValue: discrepancy.actualValue, // Changed from recordedValue
          expectedValue: discrepancy.expectedValue,
          message: discrepancy.message, // Changed from details
          severity: discrepancy.severity,
          unitPrice: discrepancy.unitPrice, // Added missing field
          strength: discrepancy.strength, // Added missing field
          formulation: discrepancy.formulation, // Added missing field
          payer: discrepancy.payer, // Added missing field
          quantity: discrepancy.quantity, // Added missing field
        })),
      });

      // Fetch the created results to return them
      const createdResults = await this.getClient().validationResult.findMany({
        where: { validationId },
        orderBy: { createdAt: 'asc' },
      });

      return createdResults.map(result => ({
        id: result.id,
        validationId: result.validationId,
        drugName: result.drugName,
        discrepancyType: result.discrepancyType,
        actualValue: result.actualValue, // Changed from recordedValue
        expectedValue: result.expectedValue,
        message: result.message, // Changed from details
        severity: result.severity,
        unitPrice: result.unitPrice, // Added missing field
        strength: result.strength, // Added missing field
        formulation: result.formulation, // Added missing field
        payer: result.payer, // Added missing field
        quantity: result.quantity, // Added missing field
        createdAt: result.createdAt.toISOString(),
      }));
    } catch (error) {
      console.error('❌ Failed to create discrepancy results:', error);
      throw new Error(`Failed to create discrepancy results: ${error instanceof Error ? error.message : 'Database error'}`);
    }
  }

  /**
   * Get discrepancy results for a validation
   */
  static async getDiscrepancyResults(validationId: string): Promise<DiscrepancyResult[]> {
    try {
      const results = await this.getClient().validationResult.findMany({
        where: { validationId },
        orderBy: { createdAt: 'asc' },
      });

      return results.map(result => ({
        id: result.id,
        validationId: result.validationId,
        drugName: result.drugName,
        discrepancyType: result.discrepancyType,
        actualValue: result.actualValue,
        expectedValue: result.expectedValue,
        message: result.message,
        severity: result.severity,
        unitPrice: result.unitPrice,
        strength: result.strength,
        formulation: result.formulation,
        payer: result.payer,
        quantity: result.quantity,
        createdAt: result.createdAt.toISOString(),
      }));
    } catch (error) {
      console.error('❌ Failed to get discrepancy results:', error);
      throw new Error(`Failed to get discrepancy results: ${error instanceof Error ? error.message : 'Database error'}`);
    }
  }

  /**
   * Cache reference drug data
   */
  static async cacheReferenceDrug(drugData: {
    drugName: string;
    strength: string;
    formulation: string;
    unitPrice: number;
    payer: string;
    lastUpdated: string;
  }): Promise<void> {
    try {
      await this.getClient().referenceDrugCache.upsert({
        where: {
          drugName_strength_formulation: {
            drugName: drugData.drugName,
            strength: drugData.strength,
            formulation: drugData.formulation,
          },
        },
        update: {
          unitPrice: drugData.unitPrice,
          payer: drugData.payer,
          lastUpdated: new Date(drugData.lastUpdated),
        },
        create: {
          drugName: drugData.drugName,
          strength: drugData.strength,
          formulation: drugData.formulation,
          unitPrice: drugData.unitPrice,
          payer: drugData.payer,
          lastUpdated: new Date(drugData.lastUpdated),
        },
      });
    } catch (error) {
      console.error('❌ Failed to cache reference drug:', error);
      // Don't throw error for caching failures - just log them
    }
  }

  /**
   * Get cached reference drug data
   */
  static async getCachedReferenceDrug(
    drugName: string, 
    strength: string, 
    formulation: string, 
    payer: string
  ): Promise<{ unitPrice: number; lastUpdated: Date } | null> {
    try {
      const cached = await this.getClient().referenceDrugCache.findUnique({
        where: {
          drugName_strength_formulation: {
            drugName,
            strength,
            formulation,
          },
        },
      });

      if (!cached) {
        return null;
      }

      // Check if cache is still valid (24 hours)
      const cacheAge = Date.now() - cached.lastUpdated.getTime();
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

      if (cacheAge > maxAge) {
        // Cache expired, remove it
        await this.getClient().referenceDrugCache.delete({
          where: { id: cached.id },
        });
        return null;
      }

      return {
        unitPrice: Number(cached.unitPrice),
        lastUpdated: cached.lastUpdated,
      };
    } catch (error) {
      console.error('❌ Failed to get cached reference drug:', error);
      return null;
    }
  }

  /**
   * Clean up old cache entries
   */
  static async cleanupExpiredCache(): Promise<void> {
    try {
      const cutoffDate = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago

      await this.getClient().referenceDrugCache.deleteMany({
        where: {
          lastUpdated: {
            lt: cutoffDate,
          },
        },
      });

      console.log('✅ Cleaned up expired cache entries');
    } catch (error) {
      console.error('❌ Failed to cleanup expired cache:', error);
      // Don't throw error for cleanup failures
    }
  }

  /**
   * Clean up old validation data (older than 3 months)
   */
  static async cleanupOldValidations(): Promise<void> {
    try {
      const cutoffDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000); // 90 days ago

      // Delete old validation results first (due to foreign key constraint)
      await this.getClient().validationResult.deleteMany({
        where: {
          validation: {
            createdAt: {
              lt: cutoffDate,
            },
          },
        },
      });

      // Delete old validations
      await this.getClient().validation.deleteMany({
        where: {
          createdAt: {
            lt: cutoffDate,
          },
        },
      });

      console.log('✅ Cleaned up old validation data');
    } catch (error) {
      console.error('❌ Failed to cleanup old validations:', error);
      // Don't throw error for cleanup failures
    }
  }

  /**
   * Delete validation by ID
   */
  static async deleteValidation(id: string): Promise<boolean> {
    try {
      // Delete validation results first (due to foreign key constraint)
      await this.getClient().validationResult.deleteMany({
        where: { validationId: id },
      });

      // Delete the validation
      const deletedValidation = await this.getClient().validation.delete({
        where: { id },
      });

      console.log(`✅ Deleted validation: ${deletedValidation.filename} (ID: ${id})`);
      return true;
    } catch (error) {
      console.error('❌ Failed to delete validation:', error);
      return false;
    }
  }
}
