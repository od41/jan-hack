import { Router, Request, Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import GameSession from '../models/ActivitySession';
import Group from '../models/Group';

const router = Router();

// Create group metadata
// @ts-ignore
router.post('/create', async (req: AuthRequest, res: Response) => {
  try {
    const { 
      group_id,
      metadata,
      rules 
    } = req.body;

    // Enhanced validation
    if (!group_id || !metadata || !rules) {
      return res.status(400).json({ 
        message: 'Missing required fields: group_id, metadata, or rules' 
      });
    }

    // Validate metadata fields
    if (!metadata.name || !metadata.description) {
      return res.status(400).json({
        message: 'Missing required metadata fields'
      });
    }

    // Validate rules fields
    if (!rules.min_stake || !rules.max_members || !rules.frequency || !rules.min_distance || !rules.min_steps) {
      return res.status(400).json({
        message: 'Missing required rules fields'
      });
    }

    // Create new group record
    const group = await Group.create({
      group_id,
      metadata: {
        ...metadata,
        created_at: new Date(),
      },
      rules,
      status: 'pending'
    });

    res.status(201).json(group);
  } catch (error) {
    console.error('Error creating group:', error);
    res.status(500).json({ message: 'Error creating group metadata' });
  }
});

// Get group details
// @ts-ignore
router.get('/:groupId', async (req: Request, res: Response) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findOne({ group_id: groupId });
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // const today = new Date();
    // const endDate = new Date(group.metadata.end_date);

    // const hasEndDatePassed = today > endDate;

    // // Check if group should be marked as completed
    // if (group.status !== 'completed' && hasEndDatePassed) {
    //   group.status = 'completed';
    //   await group.save();
    // }

    res.json(group);
  } catch (error) {
    console.error('Error fetching group:', error);
    res.status(500).json({ message: 'Error fetching group details' });
  }
});

// Get group performance stats
// @ts-ignore
router.get('/:groupId/stats', async (req: AuthRequest, res: Response) => {
  try {
    const { groupId } = req.params;

    // Verify group exists
    const group = await Group.findOne({ group_id: groupId });
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Fetch all completed sessions for this group
    const sessions = await GameSession.find({ 
      group_id: groupId,
      activity_status: 'completed' 
    });

    // Initialize stats with group rules for comparison
    const stats = {
      group_rules: group.rules,
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
      if (session.movement_data.distance >= group.rules.min_distance) {
        stats.achievements.distance_goal_met += 1;
      }
      if (session.movement_data.steps >= group.rules.min_steps) {
        stats.achievements.steps_goal_met += 1;
      }
    });

    res.json({
      group_id: groupId,
      group_status: group.status,
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
    console.error('Error fetching group stats:', error);
    res.status(500).json({ message: 'Error fetching group statistics' });
  }
});

export default router; 