export interface PoolJoinRequest {
    poolId: string;
    userAddress: string;
    amount: string;
  }

  export interface Pool {
    id: string;
    name: string;
    entryFee: string;
    totalParticipants: number;
    currentParticipants: number;
    description: string;
    deadline: Date;
    multiplierEnabled: boolean; // For nearby users feature
    multiplierRate: number; // How much the reward increases when walking together
  }
  
  export interface PoolParticipant {
    userId: string;
    poolId: string;
    joinedAt: Date;
    steps: number;
    nearbyWalks: {
      userId: string;
      duration: number; // in minutes
      timestamp: Date;
    }[];
  }