import { useState, useEffect, useCallback } from 'react';
import type { Pool } from '../types/wallet.types';

// Mock data - replace with actual API calls
const mockPools: Pool[] = [
  {
    id: '1',
    name: 'Early Bird Pool',
    entryFee: '0.1',
    totalParticipants: 100,
    currentParticipants: 45,
    description: 'Join early for better rewards!',
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: '2',
    name: 'Premium Pool',
    entryFee: '0.5',
    totalParticipants: 50,
    currentParticipants: 20,
    description: 'Higher stakes, higher rewards!',
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
  },
];

export const usePool = () => {
  const [pools, setPools] = useState<Pool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchPools = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setPools(mockPools);
      setLoading(false);
    };

    fetchPools();
  }, []);

  const getPoolById = useCallback(async (id: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockPools.find((pool) => pool.id === id) || null;
  }, []);

  return {
    pools,
    loading,
    getPoolById,
  };
};