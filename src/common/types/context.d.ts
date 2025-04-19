import { Request, Response } from 'express';

declare global {
  namespace Express {
    interface Request {
      'token-id'?: String;
    }
  }
  interface Context {
    req: Request;
    res: Response;
  }
}

export {};
