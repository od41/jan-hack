import { Router, Request, Response } from 'express';
import { ethers } from 'ethers';
import jwt from 'jsonwebtoken';
import User from '../models/User';


interface AuthRequest extends Request {
      wallet_address: string;
      signature: string;
      message: string;
  }


const router = Router();

router.post('/login', async (req: AuthRequest, res: any) => {
  try {
    const { signature, message, wallet_address } = req.body;
    
    // Verify signature
    const signerAddr = ethers.verifyMessage(message, signature);
    
    if (signerAddr.toLowerCase() !== wallet_address.toLowerCase()) {
      return res.status(401).json({ message: 'Invalid signature' });
    }

    // Find or create user
    let user = await User.findOne({ wallet_address });
    if (!user) {
      user = await User.create({ wallet_address });
    }

    // Generate JWT
    const token = jwt.sign(
      { wallet_address: user.wallet_address },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    res.status(201).json({ token, user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 