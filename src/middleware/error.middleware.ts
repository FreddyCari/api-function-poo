import { NextFunction, Request, Response } from 'express';
import { HttpResponse } from '../shared/http.response';

class AppError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = Error.name;
    this.statusCode = statusCode;
    Error.captureStackTrace(this);
  }
}

export const errorMiddleware = [
  (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.log(`error ${err.message}`);
    next(err); // calling next middleware
  },
  (err: AppError, req: Request, res: Response, next: NextFunction) => {
    res.header('Content-Type', 'application/json');
    HttpResponse.BadRequest(res, [{ errorMsg: 'Formato JSON no es correcto' }]);
  },
  (req: Request, res: Response, next: NextFunction) => {
    HttpResponse.NotFound(res, [{ errorMsg: 'Ruta no encontrada' }]);
  },
];
