import { Router, Request, Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import GameSession from '../models/GameSession';
import Pool from '../models/Pool';

const router = Router();

// Create pool metadata
// @ts-ignore
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

    // Validate dates
    const startDate = new Date(metadata.start_date);
    const endDate = new Date(metadata.end_date);
    
    if (startDate >= endDate) {
      return res.status(400).json({ 
        message: 'End date must be after start date' 
      });
    }

    // Calculate duration in days
    const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));

    // Create new pool record
    const pool = await Pool.create({
      pool_id,
      metadata: {
        ...metadata,
        created_at: new Date(),
        duration
      },
      rules,
      status: 'pending'
    });

    res.status(201).json(pool);
  } catch (error) {
    console.error('Error creating pool:', error);
    res.status(500).json({ message: 'Error creating pool metadata' });
  }
});

// Get pool details
// @ts-ignore
router.get('/:poolId', async (req: Request, res: Response) => {
  try {
    const { poolId } = req.params;

    const pool = await Pool.findOne({ pool_id: poolId });
    if (!pool) {
      return res.status(404).json({ message: 'Pool not found' });
    }

    // Check if pool should be marked as completed
    if (pool.status !== 'completed' && new Date() > new Date(pool.metadata.end_date)) {
      pool.status = 'completed';
      await pool.save();
    }

    res.json(pool);
  } catch (error) {
    console.error('Error fetching pool:', error);
    res.status(500).json({ message: 'Error fetching pool details' });
  }
});

// Get pool performance stats
// @ts-ignore
router.get('/:poolId/stats', async (req: AuthRequest, res: Response) => {
  try {
    const { poolId } = req.params;

    // Verify pool exists
    const pool = await Pool.findOne({ pool_id: poolId });
    if (!pool) {
      return res.status(404).json({ message: 'Pool not found' });
    }

    // Fetch all completed sessions for this pool
    const sessions = await GameSession.find({ 
      pool_id: poolId,
      activity_status: 'completed' 
    });

    // Initialize stats with pool rules for comparison
    const stats = {
      pool_rules: pool.rules,
      total_distance: 0,
      total_steps: 0,
      total_sessions: 0,
      participants: new Set<string>(),
      achievements: {
        distance_goal_met: 0,
        steps_goal_met: 0
      }
    };

    // Aggregate stats
    sessions.forEach(session => {
      stats.total_distance += session.movement_data.distance;
      stats.total_steps += session.movement_data.steps;
      stats.total_sessions += 1;
      stats.participants.add(session.user_id);

      // Track achievement of goals
      if (session.movement_data.distance >= pool.rules.min_distance) {
        stats.achievements.distance_goal_met += 1;
      }
      if (session.movement_data.steps >= pool.rules.min_steps) {
        stats.achievements.steps_goal_met += 1;
      }
    });

    res.json({
      pool_id: poolId,
      pool_status: pool.status,
      stats: {
        ...stats,
        unique_participants: stats.participants.size,
        participants: Array.from(stats.participants),
        average_distance: stats.total_distance / stats.total_sessions || 0,
        average_steps: stats.total_steps / stats.total_sessions || 0,
        completion_rate: {
          distance: (stats.achievements.distance_goal_met / stats.total_sessions) * 100 || 0,
          steps: (stats.achievements.steps_goal_met / stats.total_sessions) * 100 || 0
        }
      }
    });
  } catch (error) {
    console.error('Error fetching pool stats:', error);
    res.status(500).json({ message: 'Error fetching pool statistics' });
  }
});

export default router; 