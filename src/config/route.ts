import { Application, NextFunction, Request, Response } from 'express';
import { Schema } from 'joi';
import { BaseErrors, errorHandler, notFoundHandler, responseSuccess } from './response-handler';
import { HttpMethod } from 'src/commons/constants';
import { logger } from 'src/helpers/default.logger';
import { authRoute } from '../api/v1/auth/auth.route';
import { signToken, verifyToken } from 'src/helper/authenticate';

interface Validate {
  headers?: Schema,
  params?: Schema,
  query?: Schema,
  body?: Schema,
};

interface FunctionHandler {
  (req: Request): Promise<any> | any;
}

interface FunctionValidation {
  (req: Request): Promise<any>
}

export interface Route {
  method: HttpMethod,
  path: string,
  handler: FunctionHandler,
  config?: {
    validate?: Validate,
    auth?: boolean,
    // role
  },
  plugins?: {
    requestValidation?: FunctionValidation,
  },
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

const _authenticate = (auth: boolean = true) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!auth) return next();
    try {
      verifyToken(req);
      next()
    } catch (error) {
      // logger.error(error);
      next(new BaseErrors('unauthorized', 401, 'Unauthorized'));
    }
  }
};

const _requestValidation = (func?: FunctionValidation) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!func) return next();
    func(req)
      .then(() => next())
      .catch(error => {
        logger.error(error);
        throw error;
      });
  };
};

const _handleFunction = (func: FunctionHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await func(req);
      responseSuccess(res, data);
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };
};

export const initRoute = (app: Application) => {
  _routesV1.forEach((route: Route) => {
    app[route.method](
      `/v1/${route.path}`,
      _handleValidate(route.config?.validate),
      _authenticate(route.config?.auth),
      _requestValidation(route.plugins?.requestValidation),
      _handleFunction(route.handler),
    );
  });
  app.use(notFoundHandler);
  app.use(errorHandler);
};

