import { Request } from 'express';
import { UserRole } from 'src/constants';
import * as express from 'express';

declare global {
  interface Request {
    user?: {
      id: number;
      role: UserRole;
    };
  }
}
