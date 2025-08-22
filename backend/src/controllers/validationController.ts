import { Request, Response, NextFunction } from 'express';
import { ValidationService } from '../services/validationService';
import { ExcelService } from '../services/excelService';
import { DatabaseService } from '../services/databaseService';
import { createError } from '../middleware/errorHandler';

export const validationController = {
  /**
   * Upload and validate Excel file
   */
  async uploadFile(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        return next(createError('No file uploaded', 400));
      }

      const filename = req.file.originalname;
      console.log(`📁 Processing file: ${filename}`);

      // Create validation record
      const validation = await DatabaseService.createValidation(filename);

      try {
        // Parse Excel file
        const excelData = await ExcelService.parseExcelFile(req.file.buffer, filename);
        console.log(`📊 Parsed ${excelData.rows.length} drug rows`);

        // Validate the data against reference drug data
        const validationResult = await ValidationService.validateExcelData(
          excelData.rows,
          filename
        );

        // Update validation status
        await DatabaseService.updateValidationStatus(
          validation.id,
          'completed',
          validationResult.totalDiscrepancies,
          validationResult.processingTime
        );

        // Save discrepancy results
        if (validationResult.discrepancies.length > 0) {
          await DatabaseService.createDiscrepancyResults(validation.id, validationResult.discrepancies);
        }

        console.log(`✅ Validation ${validation.id} completed with ${validationResult.totalDiscrepancies} discrepancies`);

        res.json({
          success: true,
          message: 'File validated successfully',
          data: {
            validationId: validation.id,
            filename: validation.filename,
            status: 'completed',
            totalDiscrepancies: validationResult.totalDiscrepancies,
            processingTimeMs: validationResult.processingTime,
          },
        });
      } catch (error) {
        console.error(`❌ Validation ${validation.id} failed:`, error);
        await DatabaseService.updateValidationStatus(validation.id, 'failed', 0, 0);
        
        throw error;
      }
    } catch (error) {
      next(createError(
        `Failed to validate file: ${error instanceof Error ? error.message : 'Validation error'}`,
        500
      ));
    }
  },

  /**
   * Get validation status
   */
  async getValidationStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const validation = await DatabaseService.getValidation(id);

      if (!validation) {
        return next(createError('Validation not found', 404));
      }

      res.json({
        success: true,
        message: 'Validation status retrieved successfully',
        data: {
          id: validation.id,
          filename: validation.filename,
          status: validation.status,
          totalDiscrepancies: validation.totalDiscrepancies,
          processingTimeMs: validation.processingTimeMs,
          createdAt: validation.createdAt,
        },
      });
    } catch (error) {
      next(createError(
        `Failed to get validation status: ${error instanceof Error ? error.message : 'Database error'}`,
        500
      ));
    }
  },

  /**
   * Get validation results
   */
  async getValidationResults(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const validation = await DatabaseService.getValidation(id);

      if (!validation) {
        return next(createError('Validation not found', 404));
      }

      if (validation.status !== 'completed') {
        return next(createError('Validation not completed yet', 400));
      }

      const results = await DatabaseService.getDiscrepancyResults(id);

      res.json({
        success: true,
        message: 'Validation results retrieved successfully',
        data: {
          validation: {
            id: validation.id,
            filename: validation.filename,
            status: validation.status,
            totalDiscrepancies: validation.totalDiscrepancies,
            processingTimeMs: validation.processingTimeMs,
            createdAt: validation.createdAt,
          },
          results,
        },
      });
    } catch (error) {
      next(createError(
        `Failed to get validation results: ${error instanceof Error ? error.message : 'Database error'}`,
        500
      ));
    }
  },
};
