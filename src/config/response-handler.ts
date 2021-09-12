import { NextFunction, Request, Response } from 'express';

export interface ErrorCustom {
  code?: string,
  statusCode?: number;
  messages?: any,
};

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  next(new BaseErrors('not_found', 404, 'Not Found'))
};

export const errorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
  const code = error.code ? error.code : 'server_error';
  const statusCode = error.statusCode ? error.statusCode : 500;
  const messages = error.messages ? error.messages : 'Internal server error';
  return res.status(statusCode).json({
    code,
    statusCode,
    messages,
  });
};

export const responseSuccess = (res: Response, data: any) => {
  return res.json({
    code: 'success',
    statusCode: 200,
    data,
  });
};

export class BaseErrors extends Error {
  code: string;
  statusCode: number;
  messages: any;
  constructor(code = 'server_error', status = 500, message = 'Internal server error') {
    super();
    this.code = code;
    this.statusCode = status;
    this.messages = message;
  }
}
