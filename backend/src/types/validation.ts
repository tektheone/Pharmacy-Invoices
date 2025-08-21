import { z } from 'zod';

// Drug row schema for Excel data
export const DrugRowSchema = z.object({
  drugName: z.string().min(1, 'Drug name is required'),
  strength: z.string().min(1, 'Strength is required'),
  formulation: z.string().min(1, 'Formulation is required'),
  doseInstructions: z.string().optional(),
  payer: z.enum(['medicaid', 'medicare'], {
    errorMap: () => ({ message: 'Payer must be either medicaid or medicare' })
  }),
  quantity: z.number().int().positive('Quantity must be a positive integer'),
  unitPrice: z.number().positive('Unit price must be positive'),
  total: z.number().positive('Total must be positive'),
});

// Excel file schema
export const ExcelFileSchema = z.object({
  rows: z.array(DrugRowSchema).min(1, 'At least one drug row is required'),
});

// Validation request schema
export const ValidationRequestSchema = z.object({
  filename: z.string().min(1, 'Filename is required'),
  fileSize: z.number().positive('File size must be positive'),
});

// Validation response schema
export const ValidationResponseSchema = z.object({
  id: z.string(),
  filename: z.string(),
  status: z.enum(['pending', 'processing', 'completed', 'failed']),
  totalDiscrepancies: z.number().int().min(0),
  createdAt: z.string().datetime(),
});

// Discrepancy result schema
export const DiscrepancyResultSchema = z.object({
  id: z.string(),
  drugName: z.string(),
  discrepancyType: z.enum(['unit_price', 'formulation', 'strength', 'payer']),
  recordedValue: z.string(),
  expectedValue: z.string().optional(),
  details: z.string().optional(),
  severity: z.enum(['low', 'medium', 'high']),
  createdAt: z.string().datetime(),
});

// Validation results schema
export const ValidationResultsSchema = z.object({
  validation: ValidationResponseSchema,
  results: z.array(DiscrepancyResultSchema),
});

// Settings schema
export const SettingsSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']),
  unitPriceThreshold: z.number().int().min(1).max(50),
  cacheDurationHours: z.number().int().min(1).max(168),
  fileSizeLimitBytes: z.number().int().min(1048576).max(104857600), // 1MB to 100MB
  defaultExportFormat: z.enum(['pdf', 'excel', 'csv']),
});

// Search query schema
export const SearchQuerySchema = z.object({
  query: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  discrepancyType: z.enum(['unit_price', 'formulation', 'strength', 'payer']).optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

// Export request schema
export const ExportRequestSchema = z.object({
  validationIds: z.array(z.string()).min(1, 'At least one validation ID is required'),
  format: z.enum(['pdf', 'excel', 'csv']),
  includeMetadata: z.boolean().default(true),
});

// Types derived from schemas
export type DrugRow = z.infer<typeof DrugRowSchema>;
export type ExcelFile = z.infer<typeof ExcelFileSchema>;
export type ValidationRequest = z.infer<typeof ValidationRequestSchema>;
export type ValidationResponse = z.infer<typeof ValidationResponseSchema>;
export type DiscrepancyResult = z.infer<typeof DiscrepancyResultSchema>;
export type ValidationResults = z.infer<typeof ValidationResultsSchema>;
export type Settings = z.infer<typeof SettingsSchema>;
export type SearchQuery = z.infer<typeof SearchQuerySchema>;
export type ExportRequest = z.infer<typeof ExportRequestSchema>;
