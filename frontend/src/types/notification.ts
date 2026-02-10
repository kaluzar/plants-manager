/**
 * Notification types
 */

export type NotificationType =
  | 'watering_due'
  | 'watering_overdue'
  | 'fertilization_due'
  | 'fertilization_overdue'
  | 'treatment_reminder';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  plant_id: string | null;
  plant_name: string | null;
  is_read: boolean;
  created_at: string; // ISO datetime string
  read_at: string | null; // ISO datetime string
}

export interface NotificationStats {
  total: number;
  unread: number;
}
