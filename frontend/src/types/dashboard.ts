/**
 * Dashboard types
 */

export interface OverviewStats {
  total_plants: number;
  plants_by_type: Record<string, number>;
  plants_by_location: Record<string, number>;
  active_treatments: number;
}

export interface DueWateringTask {
  id: string;
  plant_id: string;
  next_date: string;
  frequency_days: number;
}

export interface DueFertilizationTask {
  id: string;
  plant_id: string;
  next_date: string;
  frequency_days: number;
}

export interface DueTasks {
  due_watering: DueWateringTask[];
  due_fertilization: DueFertilizationTask[];
}

export interface ActiveTreatment {
  id: string;
  plant_id: string;
  issue_type: string;
  issue_name: string;
  treatment_type: string;
  product_name: string | null;
  status: string;
  start_date: string;
  end_date: string | null;
}

export interface RecentActivity {
  id: string;
  type: string;
  plant_id: string;
  description: string;
  date: string;
}

export interface CalendarEvent {
  id: string;
  type: string;
  plant_id: string;
  title: string;
  date: string;
  details: Record<string, any>;
}
