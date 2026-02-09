/**
 * Growth log types
 */

export type HealthStatus = 'excellent' | 'good' | 'fair' | 'poor';

export interface GrowthLog {
  id: string;
  plant_id: string;
  photo_id: string | null;
  measured_at: string;
  height_cm: number | null;
  width_cm: number | null;
  health_status: HealthStatus | null;
  notes: string | null;
  created_at: string;
}

export interface GrowthLogCreate {
  plant_id: string;
  photo_id?: string;
  measured_at: string;
  height_cm?: number;
  width_cm?: number;
  health_status?: HealthStatus;
  notes?: string;
}

export interface GrowthLogUpdate {
  measured_at?: string;
  height_cm?: number;
  width_cm?: number;
  health_status?: HealthStatus;
  notes?: string;
  photo_id?: string;
}
