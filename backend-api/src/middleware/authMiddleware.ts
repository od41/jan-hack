import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
    wallet_address: string;
    signature: string;
    message: string;
    pool_id?: string;
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: 'Authentication token required' });
        }

        const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
        if (!token) {
            return res.status(401).json({ message: 'Invalid token format' });
        }

        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            console.error('JWT_SECRET is not defined');
            return res.status(500).json({ message: 'Server configuration error' });
        }

        const decoded = jwt.verify(token, jwtSecret) as { id: string; role: string };
        req.body = decoded;
        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(403).json({ message: 'Invalid token' });
        } else if (error instanceof jwt.TokenExpiredError) {
            return res.status(403).json({ message: 'Token has expired' });
        }
        console.error('Token verification error:', error);
        return res.status(500).json({ message: 'Error processing authentication' });
    }
};

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'Authentication token required' });
    }

    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      wallet_address: string;
    };
    // Preserve existing request body params
    const existingBody = { ...req.body };
    
    // Merge decoded token data with existing body params
    req.body = {
      ...existingBody,
      wallet_address: decoded.wallet_address
    };
    
    // req.body = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export default authMiddleware; 