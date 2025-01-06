import { Request, Response, NextFunction } from 'express';

export interface AuthRequest extends Request {
  wallet_address?: string;
  group_id?: string;
}

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1. Check if session exists
    if (!req.session) {
      return res.status(401).json({ message: 'No session found' });
    }

    // 2. Check if session is valid (not expired)
    if (req.session.cookie.expires && new Date() > req.session.cookie.expires) {
      // Destroy the invalid session
      await new Promise<void>((resolve) => {
        req.session.destroy((err) => {
          if (err) console.error('Session destruction error:', err);
          resolve();
        });
      });
      return res.status(401).json({ message: 'Session expired' });
    }

    // 3. Verify SIWE session data exists and is valid
    if (!req.session.siwe?.data.address || 
        !req.session.siwe?.data.chainId) {
      return res.status(401).json({ message: 'Invalid session data' });
    }

    // 4. Optional: Verify chain ID matches your expected network
    if (req.session.siwe?.data.chainId !== Number(process.env.EXPECTED_CHAIN_ID!)) {
      return res.status(401).json({ message: 'Invalid network' });
    }

    // 5. Optional but recommended: Refresh session expiry
    req.session.touch();

    // Merge session data with existing body params
    const existingBody = { ...req.body };
    req.body = {
      ...existingBody,
      wallet_address: req.session.siwe.data.address
    };
    
    next();
  } catch (error) {
    console.error('Session verification error:', error);
    return res.status(401).json({ message: 'Session verification failed' });
  }
};

export default authMiddleware; 