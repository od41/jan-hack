export interface WalletState {
    isConnected: boolean;
    address: string | null;
    balance: string | null;
  }
  
  export interface Pool {
    id: string;
    name: string;
    entryFee: string;
    totalParticipants: number;
    currentParticipants: number;
    description: string;
    deadline: Date;
  }
  
  export interface User {
    id: string;
    email: string;
    walletAddress?: string;
  }
  