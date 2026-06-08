import { Response } from 'express';

export function sendSuccess<T>(
  res: Response,
  data: T,
  statusCode = 200,
  message?: string
) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

export function sendError(
  res: Response,
  message: string,
  statusCode = 400,
  error?: unknown
) {
  return res.status(statusCode).json({
    success: false,
    message,
    error:
      error instanceof Error
        ? error.message
        : typeof error === 'string'
        ? error
        : undefined,
  });
}
