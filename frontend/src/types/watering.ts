/**
 * TypeScript types for watering functionality
 */

// Watering Schedule Types
export interface WateringScheduleBase {
  frequency_days: number
  amount?: string | null
  time_of_day?: string | null
  start_date: string  // ISO date string
  end_date?: string | null  // ISO date string
  is_active: boolean
  notes?: string | null
}

export interface WateringScheduleCreate extends WateringScheduleBase {
  plant_id: string
}

export interface WateringScheduleUpdate {
  frequency_days?: number
  amount?: string | null
  time_of_day?: string | null
  start_date?: string
  end_date?: string | null
  is_active?: boolean
  notes?: string | null
}

export interface WateringSchedule extends WateringScheduleBase {
  id: string
  plant_id: string
  created_at: string  // ISO datetime string
  updated_at: string  // ISO datetime string
}

export interface WateringScheduleWithNextDate extends WateringSchedule {
  next_watering_date?: string | null  // ISO date string
}

// Watering Log Types
export interface WateringLogBase {
  watered_at: string  // ISO datetime string
  amount?: string | null
  notes?: string | null
}

export interface WateringLogCreate extends WateringLogBase {
  plant_id: string
  watering_schedule_id?: string | null
}

export interface WateringLog extends WateringLogBase {
  id: string
  plant_id: string
  watering_schedule_id?: string | null
  created_at: string  // ISO datetime string
}
