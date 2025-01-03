import { Router, Response, Request } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import GameSession from '../models/GameSession';
import { calculateDistance, generateProofHash, validateMovement } from '../utils/movementUtils';

const router = Router();

// Start new session
router.post('/start', async (req: AuthRequest, res: any) => {
    console.log("pool_id",req.body)
  try {
    const { pool_id } = req.body;
    const wallet_address = req.body.wallet_address;

    const session = await GameSession.create({
      user_id: wallet_address,
      pool_id,
      start_time: new Date(),
      activity_status: 'active'
    });

    res.status(201).json(session);
  } catch (error) {
    console.error("error m",error)
    res.status(500).json({ message: 'Error starting session' });
  }
});

// Update session with movement data
router.post('/:sessionId/movement', async (req: AuthRequest, res: any) => {
  try {
    const { sessionId } = req.params;
    const { gps_logs, steps } = req.body;
    
    const session = await GameSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Validate movement data
    if (!validateMovement(gps_logs)) {
      return res.status(400).json({ message: 'Invalid movement data' });
    }

    // Calculate distance from GPS logs
    const distance = calculateDistance(gps_logs);

    // Update session with new data
    session.movement_data.gps_logs.push(...gps_logs);
    session.movement_data.steps += steps;
    session.movement_data.distance += distance;

    await session.save();
    
    res.json(session);
  } catch (error) {
    console.error("error",error)
    res.status(500).json({ message: 'Error updating movement data' });
  }
});

// End session
router.post('/:sessionId/end', async (req: AuthRequest, res: any) => {
  try {
    const { sessionId } = req.params;
    
    const session = await GameSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    session.end_time = new Date();
    session.activity_status = 'completed';
    
    // Generate proof hash from movement data
    session.proof_hash = generateProofHash(session.movement_data);
    
    await session.save();
    
    res.json(session);
  } catch (error) {
    res.status(500).json({ message: 'Error ending session' });
  }
});

// Get user's sessions
router.get('/user/:userId', async (req: AuthRequest, res: any) => {
  try {
    const { userId } = req.params;
    const sessions = await GameSession.find({ user_id: userId });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sessions' });
  }
});

export default router; 