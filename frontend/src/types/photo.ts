/**
 * Photo types
 */

export interface Photo {
  id: string;
  plant_id: string;
  file_path: string;
  thumbnail_path: string | null;
  original_filename: string;
  file_size: number;
  mime_type: string;
  width: number | null;
  height: number | null;
  caption: string | null;
  taken_at: string | null;
  created_at: string;
}

export interface PhotoCreate {
  plant_id: string;
  caption?: string;
  taken_at?: string;
}

export interface PhotoUpdate {
  caption?: string;
  taken_at?: string;
}
