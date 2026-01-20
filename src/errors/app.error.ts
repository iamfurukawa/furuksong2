export class AppError extends Error {
  public readonly statusCode: number;
  public readonly description: string;

  constructor(statusCode: number, message: string, description?: string) {
    super(message);
    this.statusCode = statusCode;
    this.description = description || message;
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, description?: string) {
    super(400, message, description);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends AppError {
  constructor(message: string, description?: string) {
    super(404, message, description);
    this.name = 'NotFoundError';
  }
}

export class InternalServerError extends AppError {
  constructor(message: string, description?: string) {
    super(500, message, description);
    this.name = 'InternalServerError';
  }
}
