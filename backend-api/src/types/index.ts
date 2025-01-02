export interface MovementData {
  gps_logs: Array<{
    lat: number;
    lon: number;
    timestamp: Date;
  }>;
  steps: number;
  distance: number;
}

export interface ProofSubmission {
  session_id: string;
  proof_hash: string;
  pool_id: string;
  user_id: string;
} 