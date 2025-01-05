import 'express-session';
import { Request } from 'express';

export interface AuthRequest extends Request {
  wallet_address?: string;
  signature?: string;
  message?: string;
}


declare module 'express-session' {
  interface SessionData {
    siwe?: {
      data: {
        address: string;
        chainId: number;
      };
    };
  }
}

declare global {
  type AuthRequest = AuthRequest;
}