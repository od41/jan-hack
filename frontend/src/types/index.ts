export interface Group {
  id: string;
  name: string;
  description: string;
  minStake: string;
  maxMembers: number;
  frequency: string;
  currentMembers: number;
  totalStaked: string;
}

export interface Activity {
  id: string;
  timestamp: number;
  distance: number;
  duration: number;
  steps: number;
  groupId: string;
}

export interface User {
  address: string;
  groups: string[];
  activities: Activity[];
}
  