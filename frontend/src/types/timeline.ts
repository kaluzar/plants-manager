/**
 * Timeline types for plant activity aggregation
 */

export type TimelineItemType =
  | 'watering'
  | 'fertilization'
  | 'treatment_application'
  | 'treatment_start'
  | 'treatment_end'
  | 'growth_log'
  | 'photo';

export interface TimelineItem {
  id: string;
  type: TimelineItemType;
  timestamp: string; // ISO datetime string
  title: string;
  description: string;
  details: Record<string, any>;
}
