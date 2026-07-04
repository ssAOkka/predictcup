import { Response } from 'express';
import logger from './index';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational: boolean = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const handleError = (err: any, res: Response) => {
  const { statusCode, message } = err;

  logger.error({
    statusCode,
    message,
    stack: err.stack,
  });

  res.status(statusCode || 500).json({
    status: 'error',
    statusCode: statusCode || 500,
    message: message || 'Internal Server Error',
  });
};

export const catchAsync =
  (fn: Function) => (req: any, res: Response, next: Function) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
