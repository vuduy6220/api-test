import Joi from 'joi';
import { HttpMethod } from 'src/commons/constants';
import { Route } from 'src/config/route';
import authController from './auth.controller';

export const authRoute: Route[] = [
  {
    method: HttpMethod.GET,
    path: 'user',
    handler: authController.getAuth,
    config: {
      validate: {
        headers: Joi.object({
          authorization: Joi.string().required()
        })
      }
    }
  }
];
