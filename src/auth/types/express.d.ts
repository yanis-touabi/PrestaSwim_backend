import { Request } from 'express';
import { User } from '../../user/entities/user.entity';

declare module 'express' {
  interface Request {
    sessionId?: string;
    user?: User;
  }
}
