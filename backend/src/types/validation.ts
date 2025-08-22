import { z } from 'zod';

// File upload validation schema
export const FileUploadSchema = z.object({
  file: z.any().refine((file) => file, 'File is required'),
});

export type FileUpload = z.infer<typeof FileUploadSchema>;

// Drug data schema for Excel parsing
export const DrugDataSchema = z.object({
  drugName: z.string().min(1, 'Drug name is required'),
  strength: z.string().min(1, 'Strength is required'),
  formulation: z.string().min(1, 'Formulation is required'),
  unitPrice: z.number().positive('Unit price must be positive'),
  payer: z.string().min(1, 'Payer is required'),
  quantity: z.number().positive('Quantity must be positive'),
  rowNumber: z.number().positive('Row number is required'),
});

export type DrugData = z.infer<typeof DrugDataSchema>;

// Validation result schema
export const ValidationResultSchema = z.object({
  id: z.string(),
  filename: z.string(),
  status: z.string(),
  totalDiscrepancies: z.number().int().min(0),
  processingTimeMs: z.number().int().min(0),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type ValidationResult = z.infer<typeof ValidationResultSchema>;

// Discrepancy result schema
export const DiscrepancyResultSchema = z.object({
  id: z.string(),
  validationId: z.string(),
  drugName: z.string(),
  strength: z.string().nullable(),
  formulation: z.string().nullable(),
  unitPrice: z.number(),
  payer: z.string().nullable(),
  quantity: z.number().nullable(),
  discrepancyType: z.string(),
  severity: z.string(),
  expectedValue: z.string().nullable(),
  actualValue: z.string(),
  message: z.string(),
  createdAt: z.string(),
});

export type DiscrepancyResult = z.infer<typeof DiscrepancyResultSchema>;

// Search filters schema
export const SearchFiltersSchema = z.object({
  query: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  discrepancyType: z.string().optional(),
  page: z.number().int().min(1).optional(),
  limit: z.number().int().min(1).max(100).optional(),
});

export type SearchFilters = z.infer<typeof SearchFiltersSchema>;

// Export format schema
export const ExportFormatSchema = z.enum(['pdf', 'excel', 'csv']);

export type ExportFormat = z.infer<typeof ExportFormatSchema>;
