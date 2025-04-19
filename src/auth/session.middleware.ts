import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import './types/express';

@Injectable()
export class SessionMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Check for existing session cookie
    let sessionId = req.cookies?.sessionId;

    // Generate new session ID if none exists
    if (!sessionId) {
      sessionId = uuidv4();
      // Set cookie with 30 day expiration
      res.cookie('sessionId', sessionId, {
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });
    }

    // Attach session ID to request object
    req.sessionId = sessionId;
    next();
  }
}
