import { Request } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import { BaseErrors } from 'src/config/response-handler';
import { logger } from 'src/helpers/default.logger';
import { environment } from '../config/env';

declare global {
  namespace Express {
    interface Request {
      auth?: {
        credentials?: Payload | undefined
      }
    }
  }
}

interface Payload {
  userId: string
}

export const signToken = (payload: Payload, options: SignOptions) => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, environment.tokenSecretKey, options, ((error, encoded) => {
      if (error) {
        // logger.error(error);
        reject(new BaseErrors());
      }
      resolve(encoded);
    }));
  })

};

export const verifyToken = (req: Request) => {
  const token = _getToken(req);
  if (!token) {
    throw new BaseErrors('unauthorized', 401, 'Unauthorized');
  }
  jwt.verify(token, environment.tokenSecretKey, ((error, decoded) => {
    if (error) {
      throw error;
    }
    req.auth = {
      ...req.auth || {},
      credentials: {
        userId: decoded?.userId
      },
    }
  }));
};

const _getToken = (req: Request): string | undefined => {
  const splitAuth: string[] | undefined | null = req.headers.authorization?.split(' ');
  if (!splitAuth || splitAuth.length != 2) return;
  return splitAuth[1];
};
