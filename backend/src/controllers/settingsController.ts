import { Request, Response, NextFunction } from 'express';
import { DatabaseService } from '../services/databaseService';
import { createError } from '../middleware/errorHandler';

export const settingsController = {
  /**
   * Get current settings
   */
  async getSettings(req: Request, res: Response, next: NextFunction) {
    try {
      const settings = await DatabaseService.getSettings();
      
      res.status(200).json({
        message: 'Settings retrieved successfully',
        settings,
      });

    } catch (error) {
      next(error);
    }
  },

  /**
   * Update settings
   */
  async updateSettings(req: Request, res: Response, next: NextFunction) {
    try {
      const settings = req.body;
      
      const updatedSettings = await DatabaseService.updateSettings(settings);
      
      res.status(200).json({
        message: 'Settings updated successfully',
        settings: updatedSettings,
      });

    } catch (error) {
      next(error);
    }
  },

  /**
   * Reset settings to defaults
   */
  async resetSettings(req: Request, res: Response, next: NextFunction) {
    try {
      const defaultSettings = await DatabaseService.resetSettings();
      
      res.status(200).json({
        message: 'Settings reset to defaults successfully',
        settings: defaultSettings,
      });

    } catch (error) {
      next(error);
    }
  },
};
