import { Router, Request, Response } from 'express';
import { ethers } from 'ethers';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import {AuthRequest} from '../middleware/authMiddleware';
import { generateNonce, SiweMessage } from 'siwe';

const router = Router();

// @ts-ignore
router.get('/nonce', async(req:Request, res:Response) => {
  const nonce = generateNonce();
  res.setHeader('Content-Type', 'text/plain');
  return res.send(nonce);
})

router.post('/verify', async (req: AuthRequest, res: any) => {
  const { message, signature } = req.body;
    const siweMessage = new SiweMessage(message);
    try {
        const siwe = await siweMessage.verify({ signature });
        if (siwe.success) {
          // @ts-ignore
          req.session.siwe = siwe;
          await req.session.save()
          console.log('sess', req.session, req.session.siwe)
          return res.json({ok: true});
        } else {
          return res.send(false)
        }
    } catch {
        return res.send(false);
    }
});



router.get('/session', async (req: AuthRequest, res: any) => {
  console.log('sess get', req.session, req.session.siwe)

  // @ts-ignore
  if (!req.session.siwe) {
    return res.status(404).send(` user not found`);
  } else {
  // @ts-ignore
    const walletAddress = req.session.siwe.data.address
  // @ts-ignore
    const chainId = req.session.siwe.data.chainId
    // Find or create user
    let user = await User.findOne({ wallet_address: walletAddress });
    if(!user) {
      user = await User.create({
        wallet_address: walletAddress,
        username: walletAddress
      });
    }
    // Generate JWT
    const token = jwt.sign(
      { wallet_address: user.wallet_address },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    return res.status(200).json({user, token, ok: true, address: walletAddress, chainId});
  }
});

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
        return res.status(404).json({ message: 'User not found' });
    }

    // Generate JWT
    const token = jwt.sign(
      { wallet_address: user.wallet_address },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    res.status(201).json({ token, user });
  } catch (error) {
    console.error("error", error)
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/register', async (req: Request, res: any) => {
  try {
    const { wallet_address, username, name, signature, message } = req.body;

    // Verify signature
    const signerAddr = ethers.verifyMessage(message, signature);
    
    if (signerAddr.toLowerCase() !== wallet_address.toLowerCase()) {
      return res.status(401).json({ message: 'Invalid signature' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [
        { wallet_address },
        { username }
      ]
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: existingUser.wallet_address === wallet_address ? 
          'Wallet address already registered' : 
          'Username already taken'
      });
    }

    // Create new user
    const user = await User.create({
      wallet_address,
      username,
      name
    });

    // Generate JWT
    const token = jwt.sign(
      { wallet_address: user.wallet_address },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    res.status(201).json({ token, user });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


export default router; 