import { Request, Response, NextFunction } from 'express';
import { DatabaseService } from '../services/databaseService';
import { createError } from '../middleware/errorHandler';

export const historyController = {
  /**
   * Get validation history with pagination
   */
  async getHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const result = await DatabaseService.getValidationHistory(page, limit);

      res.json({
        success: true,
        message: 'History retrieved successfully',
        data: result,
      });
    } catch (error) {
      next(createError(
        `Failed to get history: ${error instanceof Error ? error.message : 'Database error'}`,
        500
      ));
    }
  },

  /**
   * Get validation by ID
   */
  async getValidationById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const validation = await DatabaseService.getValidation(id);

      if (!validation) {
        return next(createError('Validation not found', 404));
      }

      res.json({
        success: true,
        message: 'Validation retrieved successfully',
        data: validation,
      });
    } catch (error) {
      next(createError(
        `Failed to get validation: ${error instanceof Error ? error.message : 'Database error'}`,
        500
      ));
    }
  },

  /**
   * Search validations
   */
  async searchValidations(req: Request, res: Response, next: NextFunction) {
    try {
      const { query, page, limit } = req.query;

      if (!query || typeof query !== 'string') {
        return next(createError('Search query is required', 400));
      }

      const pageNum = parseInt(page as string) || 1;
      const limitNum = parseInt(limit as string) || 20;

      const result = await DatabaseService.searchValidations(query, pageNum, limitNum);

      res.json({
        success: true,
        message: 'Search completed successfully',
        data: result,
      });
    } catch (error) {
      next(createError(
        `Failed to search validations: ${error instanceof Error ? error.message : 'Database error'}`,
        500
      ));
    }
  },

  /**
   * Get discrepancy results for a validation
   */
  async getValidationDiscrepancies(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const discrepancies = await DatabaseService.getDiscrepancyResults(id);

      res.json({
        success: true,
        message: 'Discrepancy results retrieved successfully',
        data: discrepancies,
      });
    } catch (error) {
      next(createError(
        `Failed to get discrepancy results: ${error instanceof Error ? error.message : 'Database error'}`,
        500
      ));
    }
  },

  /**
   * Delete validation by ID
   */
  async deleteValidation(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const success = await DatabaseService.deleteValidation(id);

      if (!success) {
        return next(createError('Validation not found', 404));
      }

      res.json({
        success: true,
        message: 'Validation deleted successfully',
        data: { id },
      });
    } catch (error) {
      next(createError(
        `Failed to delete validation: ${error instanceof Error ? error.message : 'Database error'}`,
        500
      ));
    }
  },
};
