import { Request, Response, NextFunction } from 'express';
import { ExcelService } from '../services/excelService';
import { ValidationService } from '../services/validationService';
import { DatabaseService } from '../services/databaseService';
import { createError } from '../middleware/errorHandler';

export const validationController = {
  /**
   * Upload and validate Excel file
   */
  async uploadAndValidate(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        throw createError('No file uploaded', 400);
      }

      console.log(`📁 Processing file: ${req.file.originalname} (${req.file.size} bytes)`);

      // Parse Excel file
      const excelData = await ExcelService.parseExcelFile(req.file.buffer, req.file.originalname);
      console.log(`📊 Parsed ${excelData.rows.length} drug rows`);

      // Validate the data against reference drug data
      const validationResult = await ValidationService.validateExcelData(
        excelData.rows,
        req.file.originalname
      );

      // Save validation result to database
      const savedValidationId = await DatabaseService.saveValidationResult(validationResult);

      const response = {
        id: savedValidationId,
        filename: req.file.originalname,
        status: 'completed',
        totalDiscrepancies: validationResult.totalDiscrepancies,
        totalRows: validationResult.totalRows,
        processingTime: validationResult.processingTime,
        message: 'File validated successfully',
        createdAt: validationResult.createdAt.toISOString(),
      };

      console.log(`✅ File validated successfully: ${savedValidationId}`);
      res.status(200).json(response);

    } catch (error) {
      next(error);
    }
  },

  /**
   * Get validation status
   */
  async getValidationStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      
      const validation = await DatabaseService.getValidationById(id);
      
      res.status(200).json({
        id: validation.id,
        filename: validation.filename,
        status: validation.status,
        totalDiscrepancies: validation.totalDiscrepancies,
        processingTime: validation.processingTimeMs,
        createdAt: validation.createdAt,
      });

    } catch (error) {
      next(error);
    }
  },

  /**
   * Get validation results
   */
  async getValidationResults(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      
      const validation = await DatabaseService.getValidationById(id);
      
      res.status(200).json({
        id: validation.id,
        filename: validation.filename,
        status: validation.status,
        totalDiscrepancies: validation.totalDiscrepancies,
        processingTime: validation.processingTimeMs,
        createdAt: validation.createdAt,
        results: validation.results.map(result => ({
          id: result.id,
          drugName: result.drugName,
          discrepancyType: result.discrepancyType,
          recordedValue: result.recordedValue,
          expectedValue: result.expectedValue,
          details: result.details,
          severity: result.severity,
          createdAt: result.createdAt,
        })),
      });

    } catch (error) {
      next(error);
    }
  },

  /**
   * Cancel validation
   */
  async cancelValidation(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      
      // Mock response for now
      // In Phase 4, this will actually cancel the validation
      res.status(200).json({
        id,
        status: 'cancelled',
        message: 'Validation cancelled successfully',
      });

    } catch (error) {
      next(error);
    }
  },
};
