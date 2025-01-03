import { Router, Request, Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import GameSession from '../models/GameSession';

const router = Router();

// Create pool metadata
router.post('/create', async (req: AuthRequest, res: Response) => {
  try {
    const { 
      pool_id,
      metadata,
      rules 
    } = req.body;

    // Validate required fields
    if (!pool_id || !metadata || !rules) {
      return res.status(400).json({ 
        message: 'Missing required fields: pool_id, metadata, or rules' 
      });
    }

    // Create new pool record
    const pool = {
      pool_id,
      metadata: {
        ...metadata,
        created_at: new Date(),
      },
      rules,
      status: 'pending'
    };

    // Store pool data
    // await Pool.create(pool);  // Uncomment when model is ready

    res.status(201).json(pool);
  } catch (error) {
    console.error('Error creating pool:', error);
    res.status(500).json({ message: 'Error creating pool metadata' });
  }
});

// Get pool details
router.get('/:poolId', async (req: Request, res: Response) => {
  try {
    const { poolId } = req.params;

    // Fetch pool data
    // const pool = await Pool.findOne({ pool_id: poolId });
    // if (!pool) {
    //   return res.status(404).json({ message: 'Pool not found' });
    // }

    // Temporary mock response
    const pool = {
      pool_id: poolId,
      metadata: {
        name: "Test Pool",
        description: "Test Description",
        created_at: new Date(),
        start_date: new Date(),
        end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        duration: 7
      },
      rules: {
        min_distance: 5,
        min_steps: 10000,
        frequency: 'daily'
      },
      status: 'active'
    };

    res.json(pool);
  } catch (error) {
    console.error('Error fetching pool:', error);
    res.status(500).json({ message: 'Error fetching pool details' });
  }
});

// Get pool performance stats
router.get('/:poolId/stats', async (req: Request, res: Response) => {
  try {
    const { poolId } = req.params;

    // Fetch all sessions for this pool
    const sessions = await GameSession.find({ 
      pool_id: poolId,
      activity_status: 'completed' 
    });

    // Aggregate stats
    const stats = sessions.reduce((acc, session) => {
      return {
        total_distance: acc.total_distance + session.movement_data.distance,
        total_steps: acc.total_steps + session.movement_data.steps,
        total_sessions: acc.total_sessions + 1,
        participants: acc.participants.add(session.user_id)
      };
    }, {
      total_distance: 0,
      total_steps: 0,
      total_sessions: 0,
      participants: new Set()
    });

    res.json({
      pool_id: poolId,
      stats: {
        ...stats,
        unique_participants: stats.participants.size,
        participants: Array.from(stats.participants)
      }
    });
  } catch (error) {
    console.error('Error fetching pool stats:', error);
    res.status(500).json({ message: 'Error fetching pool statistics' });
  }
});

export default router; 