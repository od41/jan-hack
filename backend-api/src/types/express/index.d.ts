import { Request } from 'express';

export interface AuthRequest extends Request {
  wallet_address?: string;
  signature?: string;
  message?: string;
}

declare global {
  type AuthRequest = AuthRequest;
}