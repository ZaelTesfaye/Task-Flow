// types/express.d.ts
import type { JwtPayload } from './jwt.ts';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}