import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/app.error.js';

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
      description: err.description
    });
  }

  // Erros genéricos não tratados
  console.error('Unexpected error:', err);
  return res.status(500).json({
    error: 'Internal server error',
    description: 'An unexpected error occurred'
  });
}
