import { PrismaClient } from '@prisma/client';
import { ValidationResult } from './validationService';
import { DiscrepancyResult } from '../types/validation';
import { createError } from '../middleware/errorHandler';

export class DatabaseService {
  private static prisma: PrismaClient | null = null;
  
  /**
   * Initialize Prisma client
   */
  static initialize() {
    if (!this.prisma) {
      this.prisma = new PrismaClient({
        datasources: {
          db: {
            url: process.env.DATABASE_URL || 'postgresql://admin:password@localhost:5433/pharmacy_invoices',
          },
        },
      });
    }
    return this.prisma;
  }
  
  /**
   * Get Prisma client instance
   */
  static getClient(): PrismaClient {
    if (!this.prisma) {
      this.initialize();
    }
    return this.prisma!;
  }
  
  /**
   * Save validation result to database
   */
  static async saveValidationResult(validationResult: ValidationResult): Promise<string> {
    try {
      const prisma = this.getClient();
      
      // Create validation record
      const validation = await prisma.validation.create({
        data: {
          id: validationResult.validationId,
          filename: validationResult.filename,
          status: 'completed',
          processingTimeMs: validationResult.processingTime,
          totalDiscrepancies: validationResult.totalDiscrepancies,
          createdAt: validationResult.createdAt,
        },
      });
      
      // Create validation results for each discrepancy
      if (validationResult.discrepancies.length > 0) {
        const resultsData = validationResult.discrepancies.map(discrepancy => ({
          validationId: validation.id,
          drugName: discrepancy.drugName,
          discrepancyType: discrepancy.discrepancyType,
          recordedValue: discrepancy.recordedValue,
          expectedValue: discrepancy.expectedValue || '',
          details: discrepancy.details || '',
          severity: discrepancy.severity,
          createdAt: discrepancy.createdAt,
        }));
        
        await prisma.validationResult.createMany({
          data: resultsData,
        });
      }
      
      console.log(`💾 Saved validation ${validation.id} to database`);
      return validation.id;
      
    } catch (error) {
      console.error('❌ Failed to save validation result:', error);
      throw createError(
        `Failed to save validation result: ${error instanceof Error ? error.message : 'Database error'}`,
        500
      );
    }
  }
  
  /**
   * Get validation by ID
   */
  static async getValidationById(id: string) {
    try {
      const prisma = this.getClient();
      
      const validation = await prisma.validation.findUnique({
        where: { id },
        include: {
          results: true,
        },
      });
      
      if (!validation) {
        throw createError('Validation not found', 404);
      }
      
      return validation;
      
    } catch (error) {
      if (error instanceof Error && 'statusCode' in error) {
        throw error;
      }
      throw createError(
        `Failed to get validation: ${error instanceof Error ? error.message : 'Database error'}`,
        500
      );
    }
  }
  
  /**
   * Get validation history with pagination
   */
  static async getValidationHistory(page: number = 1, limit: number = 20) {
    try {
      const prisma = this.getClient();
      
      const skip = (page - 1) * limit;
      
      const [validations, total] = await Promise.all([
        prisma.validation.findMany({
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: {
            _count: {
              select: { results: true },
            },
          },
        }),
        prisma.validation.count(),
      ]);
      
      return {
        validations: validations.map(v => ({
          ...v,
          totalDiscrepancies: v._count.results,
        })),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
      
    } catch (error) {
      console.error('❌ Failed to get validation history:', error);
      throw createError(
        `Failed to get validation history: ${error instanceof Error ? error.message : 'Database error'}`,
        500
      );
    }
  }
  
  /**
   * Search validations
   */
  static async searchValidations(
    query?: string,
    startDate?: string,
    endDate?: string,
    discrepancyType?: string,
    page: number = 1,
    limit: number = 20
  ) {
    try {
      const prisma = this.getClient();
      
      const skip = (page - 1) * limit;
      
      // Build where clause
      const where: any = {};
      
      if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) where.createdAt.gte = new Date(startDate);
        if (endDate) where.createdAt.lte = new Date(endDate);
      }
      
      if (discrepancyType) {
        where.results = {
          some: {
            discrepancyType: discrepancyType as any,
          },
        };
      }
      
      const [validations, total] = await Promise.all([
        prisma.validation.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: {
            _count: {
              select: { results: true },
            },
            results: query ? {
              where: {
                OR: [
                  { drugName: { contains: query, mode: 'insensitive' } },
                  { details: { contains: query, mode: 'insensitive' } },
                ],
              },
            } : false,
          },
        }),
        prisma.validation.count({ where }),
      ]);
      
      return {
        validations: validations.map(v => ({
          ...v,
          totalDiscrepancies: v._count.results,
        })),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        query,
        startDate,
        endDate,
        discrepancyType,
      };
      
    } catch (error) {
      console.error('❌ Failed to search validations:', error);
      throw createError(
        `Failed to search validations: ${error instanceof Error ? error.message : 'Database error'}`,
        500
      );
    }
  }
  
  /**
   * Delete validation and its results
   */
  static async deleteValidation(id: string) {
    try {
      const prisma = this.getClient();
      
      // Delete validation results first (due to foreign key constraint)
      await prisma.validationResult.deleteMany({
        where: { validationId: id },
      });
      
      // Delete validation
      await prisma.validation.delete({
        where: { id },
      });
      
      console.log(`🗑️  Deleted validation ${id} from database`);
      
    } catch (error) {
      console.error('❌ Failed to delete validation:', error);
      throw createError(
        `Failed to delete validation: ${error instanceof Error ? error.message : 'Database error'}`,
        500
      );
    }
  }
  
  /**
   * Get settings
   */
  static async getSettings() {
    try {
      const prisma = this.getClient();
      
      let settings = await prisma.setting.findFirst();
      
      if (!settings) {
        // Create default settings if none exist
        settings = await prisma.setting.create({
          data: {
            theme: 'system',
            unitPriceThreshold: 10,
            cacheDurationHours: 24,
            fileSizeLimitBytes: 104857600, // 100MB
            defaultExportFormat: 'pdf',
          },
        });
      }
      
      return settings;
      
    } catch (error) {
      console.error('❌ Failed to get settings:', error);
      throw createError(
        `Failed to get settings: ${error instanceof Error ? error.message : 'Database error'}`,
        500
      );
    }
  }
  
  /**
   * Update settings
   */
  static async updateSettings(newSettings: any) {
    try {
      const prisma = this.getClient();
      
      let settings = await prisma.setting.findFirst();
      
      if (settings) {
        settings = await prisma.setting.update({
          where: { id: settings.id },
          data: newSettings,
        });
      } else {
        settings = await prisma.setting.create({
          data: newSettings,
        });
      }
      
      return settings;
      
    } catch (error) {
      console.error('❌ Failed to update settings:', error);
      throw createError(
        `Failed to update settings: ${error instanceof Error ? error.message : 'Database error'}`,
        500
      );
    }
  }
  
  /**
   * Reset settings to defaults
   */
  static async resetSettings() {
    try {
      const prisma = this.getClient();
      
      const defaultSettings = {
        theme: 'system',
        unitPriceThreshold: 10,
        cacheDurationHours: 24,
        fileSizeLimitBytes: 104857600, // 100MB
        defaultExportFormat: 'pdf',
      };
      
      let settings = await prisma.setting.findFirst();
      
      if (settings) {
        settings = await prisma.setting.update({
          where: { id: settings.id },
          data: defaultSettings,
        });
      } else {
        settings = await prisma.setting.create({
          data: defaultSettings,
        });
      }
      
      return settings;
      
    } catch (error) {
      console.error('❌ Failed to reset settings:', error);
      throw createError(
        `Failed to reset settings: ${error instanceof Error ? error.message : 'Database error'}`,
        500
      );
    }
  }
  
  /**
   * Clean up old validations (older than 3 months)
   */
  static async cleanupOldValidations() {
    try {
      const prisma = this.getClient();
      
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      
      // Get old validations
      const oldValidations = await prisma.validation.findMany({
        where: {
          createdAt: {
            lt: threeMonthsAgo,
          },
        },
        select: { id: true },
      });
      
      if (oldValidations.length === 0) {
        console.log('🧹 No old validations to clean up');
        return { deletedCount: 0 };
      }
      
      // Delete validation results first
      await prisma.validationResult.deleteMany({
        where: {
          validationId: {
            in: oldValidations.map(v => v.id),
          },
        },
      });
      
      // Delete validations
      await prisma.validation.deleteMany({
        where: {
          id: {
            in: oldValidations.map(v => v.id),
          },
        },
      });
      
      console.log(`🧹 Cleaned up ${oldValidations.length} old validations`);
      return { deletedCount: oldValidations.length };
      
    } catch (error) {
      console.error('❌ Failed to cleanup old validations:', error);
      throw createError(
        `Failed to cleanup old validations: ${error instanceof Error ? error.message : 'Database error'}`,
        500
      );
    }
  }
  
  /**
   * Close database connection
   */
  static async disconnect() {
    if (this.prisma) {
      await this.prisma.$disconnect();
      this.prisma = null;
    }
  }
}
