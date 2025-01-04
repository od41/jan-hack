import React from 'react';
import { Layout } from '../components/common/Layout';
import { PoolCard } from '../components/pool/PoolCard';
import { usePool } from '../hooks/usePool';

export const PoolListPage: React.FC = () => {
  const { pools, loading } = usePool();

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Available Pools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pools.map((pool) => (
            <PoolCard key={pool.id} pool={pool} />
          ))}
        </div>
      </div>
    </Layout>
  );
};
