/**
 * Location TypeScript types
 */

export interface LocationBase {
  name: string;
  type: 'indoor' | 'outdoor';
  description?: string | null;
  zone?: string | null;
  extra_data?: Record<string, any> | null;
}

export interface LocationCreate extends LocationBase {}

export interface LocationUpdate {
  name?: string;
  type?: 'indoor' | 'outdoor';
  description?: string | null;
  zone?: string | null;
  extra_data?: Record<string, any> | null;
}

export interface Location extends LocationBase {
  id: string;
  created_at: string;
}

export interface LocationWithPlantsCount extends Location {
  plants_count: number;
}
