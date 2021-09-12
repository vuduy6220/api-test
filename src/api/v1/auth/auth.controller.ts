import { Request, Response } from 'express';
import { responseSuccess } from 'src/config/response-handler';

const getAuth = (req: Request) => {
  return { test: true }
};

export default {
  getAuth,
};
