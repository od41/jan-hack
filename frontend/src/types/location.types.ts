export interface Location {
  latitude: number;
  longitude: number;
  timestamp: number;
}

export interface UserLocation extends Location {
  userId: string;
  userName: string;
}

export interface NearbyUser {
  userId: string;
  userName: string;
  distance: number;
  location: Location;
}