/**
 * Plant TypeScript types
 */

export interface PlantBase {
  name: string;
  scientific_name?: string | null;
  type: 'indoor' | 'outdoor';
  category: 'flower' | 'tree' | 'grass' | 'other';
  species?: string | null;
  location_id?: string | null;
  acquisition_date?: string | null;
  notes?: string | null;
  extra_data?: Record<string, any> | null;
}

export interface PlantCreate extends PlantBase {}

export interface PlantUpdate {
  name?: string;
  scientific_name?: string | null;
  type?: 'indoor' | 'outdoor';
  category?: 'flower' | 'tree' | 'grass' | 'other';
  species?: string | null;
  location_id?: string | null;
  acquisition_date?: string | null;
  notes?: string | null;
  extra_data?: Record<string, any> | null;
}

export interface Plant extends PlantBase {
  id: string;
  created_at: string;
  updated_at: string;
}

export interface PlantWithLocation extends Plant {
  location_name?: string | null;
  location_type?: string | null;
}
