/**
 * TypeScript types for fertilization functionality
 */

// Fertilization Schedule Types
export interface FertilizationScheduleBase {
  frequency_days: number
  fertilizer_type?: string | null
  amount?: string | null
  start_date: string  // ISO date string
  end_date?: string | null  // ISO date string
  is_active: boolean
  notes?: string | null
}

export interface FertilizationScheduleCreate extends FertilizationScheduleBase {
  plant_id: string
}

export interface FertilizationScheduleUpdate {
  frequency_days?: number
  fertilizer_type?: string | null
  amount?: string | null
  start_date?: string
  end_date?: string | null
  is_active?: boolean
  notes?: string | null
}

export interface FertilizationSchedule extends FertilizationScheduleBase {
  id: string
  plant_id: string
  created_at: string  // ISO datetime string
  updated_at: string  // ISO datetime string
}

export interface FertilizationScheduleWithNextDate extends FertilizationSchedule {
  next_fertilization_date?: string | null  // ISO date string
}

// Fertilization Log Types
export interface FertilizationLogBase {
  fertilized_at: string  // ISO datetime string
  fertilizer_type?: string | null
  amount?: string | null
  notes?: string | null
}

export interface FertilizationLogCreate extends FertilizationLogBase {
  plant_id: string
  fertilization_schedule_id?: string | null
}

export interface FertilizationLog extends FertilizationLogBase {
  id: string
  plant_id: string
  fertilization_schedule_id?: string | null
  created_at: string  // ISO datetime string
}
