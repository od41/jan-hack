export interface User {
    id: string;
    address: string;
    depositAmount: number;
    currentRewards: number;
    groupMultiplier: number;
  }
  
  export interface Activity {
    id: string;
    userId: string;
    startTime: Date;
    endTime?: Date;
    steps: number;
    gpsData: {
      latitude: number;
      longitude: number;
      timestamp: number;
    }[];
    validated: boolean;
  }
  