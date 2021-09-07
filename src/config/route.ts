import { Application, NextFunction, Request, Response } from 'express';
import { Schema } from 'joi';
import { BaseErrors, errorHandler, notFoundHandler } from './response-handler';
import { HttpMethod } from 'src/commons/constants';
import { logger } from 'src/helpers/default.logger';
import { authRoute } from '../api/v1/auth/auth.route';

interface Validate {
  headers?: Schema,
  params?: Schema,
  query?: Schema,
  body?: Schema,
};

interface FunctionHandler {
  (req: Request, res: Response): void;
}

export interface Route {
  method: HttpMethod,
  path: string,
  handler: FunctionHandler,
  config?: {
    validate?: Validate,
    auth?: boolean,
    // role
  }
};

const _routesV1 = [
  ...authRoute,
];

const _validateSchema = (data: any, schema: Schema) => {
  const result = schema.validate(data, {
    abortEarly: false,
  });

  if (result.error) {
    throw new BaseErrors('bad_request', 400, result.error.message);
  }

  return result.value;
};

const _handleValidate = (validate?: Validate) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!validate) return next();
    try {
      if (validate.headers) {
        req.headers = _validateSchema(req.headers, validate.headers.options({ allowUnknown: true }));
      }
      if (validate.params) {
        req.params = _validateSchema(req.params, validate.params);
      }
      if (validate.query) {
        req.query = _validateSchema(req.query, validate.query);
      }
      if (validate.body) {
        req.body = _validateSchema(req.body, validate.body);
      }
      return next();
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };
};

const _handleFunction = (func: FunctionHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      func(req, res);
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };
}

export const initRoute = (app: Application) => {
  _routesV1.forEach((route: Route) => {
    app[route.method](`/v1/${route.path}`, _handleValidate(route.config?.validate), _handleFunction(route.handler));
  });
  app.use(notFoundHandler);
  app.use(errorHandler);
};

