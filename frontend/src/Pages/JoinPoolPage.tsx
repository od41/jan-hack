import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '../components/common/Layout';
import { JoinPoolForm } from '../components/pool/JoinPoolForm';
import { usePool } from '../hooks/usePool';
import type { Pool } from '../types/wallet.types';

export const JoinPoolPage: React.FC = () => {
  const { poolId } = useParams<{ poolId: string }>();
  const navigate = useNavigate();
  const { getPoolById } = usePool();
  const [pool, setPool] = useState<Pool | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPool = async () => {
      if (!poolId) {
        navigate('/pools');
        return;
      }

      const poolData = await getPoolById(poolId);
      if (!poolData) {
        navigate('/pools');
        return;
      }

      setPool(poolData);
      setLoading(false);
    };

    fetchPool();
  }, [poolId, navigate, getPoolById]);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  if (!pool) {
    return null;
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <JoinPoolForm pool={pool} />
      </div>
    </Layout>
  );
};