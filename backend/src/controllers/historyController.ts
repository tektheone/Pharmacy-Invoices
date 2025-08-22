import { Request, Response, NextFunction } from 'express';
import { DatabaseService } from '../services/databaseService';
import { createError } from '../middleware/errorHandler';

export const historyController = {
  /**
   * Get validation history with pagination
   */
  async getValidationHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      
      const history = await DatabaseService.getValidationHistory(page, limit);
      
      res.status(200).json(history);

    } catch (error) {
      next(error);
    }
  },

  /**
   * Get validation by ID
   */
  async getValidationById(req: Request, res: Response, next: NextFunction) {
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
        results: validation.results,
      });

    } catch (error) {
      next(error);
    }
  },

  /**
   * Search validations
   */
  async searchValidations(req: Request, res: Response, next: NextFunction) {
    try {
      const { query, startDate, endDate, discrepancyType, page, limit } = req.query;
      
      const searchResults = await DatabaseService.searchValidations(
        query as string,
        startDate as string,
        endDate as string,
        discrepancyType as string,
        parseInt(page as string) || 1,
        parseInt(limit as string) || 20
      );
      
      res.status(200).json(searchResults);

    } catch (error) {
      next(error);
    }
  },

  /**
   * Delete validation
   */
  async deleteValidation(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      
      await DatabaseService.deleteValidation(id);
      
      res.status(200).json({
        id,
        message: 'Validation deleted successfully',
      });

    } catch (error) {
      next(error);
    }
  },
};
