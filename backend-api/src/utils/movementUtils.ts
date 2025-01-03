interface GpsLog {
  lat: number;
  lon: number;
  timestamp: Date;
}

export function calculateDistance(gpsLogs: GpsLog[]): number {
  let totalDistance = 0;
  
  for (let i = 1; i < gpsLogs.length; i++) {
    const prev = gpsLogs[i - 1];
    const curr = gpsLogs[i];
    
    totalDistance += getDistanceFromLatLonInKm(
      prev.lat, 
      prev.lon, 
      curr.lat, 
      curr.lon
    );
  }
  
  return totalDistance;
}

export function validateMovement(gpsLogs: GpsLog[]): boolean {
  if (!gpsLogs.length) return false;
  
  for (let i = 1; i < gpsLogs.length; i++) {
    const prev = gpsLogs[i - 1];
    const curr = gpsLogs[i];
    
    // Check timestamps are sequential
    if (new Date(curr.timestamp) <= new Date(prev.timestamp)) {
      return false;
    }
    
    // Check for impossible speeds (e.g., > 100 km/h)
    const timeDiff = (new Date(curr.timestamp).getTime() - new Date(prev.timestamp).getTime()) / 1000; // in seconds
    const distance = getDistanceFromLatLonInKm(prev.lat, prev.lon, curr.lat, curr.lon);
    const speed = (distance / timeDiff) * 3600; // km/h
    
    if (speed > 100) {
      return false;
    }
  }
  
  return true;
}

function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1); 
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return R * c;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI/180);
}

export function generateProofHash(movementData: any): string {
  // This is a placeholder - implement actual proof generation logic
  return Buffer.from(JSON.stringify(movementData)).toString('base64');
} 