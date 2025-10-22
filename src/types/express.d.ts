// types/express.d.ts
import type { JwtPayload } from './jwt.js';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}