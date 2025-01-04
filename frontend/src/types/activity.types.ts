import type { NearbyUser } from "./location.types";

export interface ActivityStats {
    steps: number;
    distance: number; // in meters
    startTime: number;
    nearbyUsers: NearbyUser[];
  }