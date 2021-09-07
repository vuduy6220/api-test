import { Request, Response } from 'express';
import { responseSuccess } from 'src/config/response-handler';

const getAuth = (req: Request, res: Response) => {
  return responseSuccess(res, { test: true });
};

export default {
  getAuth,
};
