/**
 * Dashboard API service
 */

import type {
  OverviewStats,
  DueTasks,
  ActiveTreatment,
  RecentActivity,
  CalendarEvent,
} from '@/types/dashboard';

const API_BASE_URL = 'http://localhost:8000/api/v1';

export const dashboardService = {
  /**
   * Get overview statistics
   */
  getOverview: async (): Promise<OverviewStats> => {
    const response = await fetch(`${API_BASE_URL}/dashboard/overview`);
    if (!response.ok) {
      throw new Error('Failed to fetch overview statistics');
    }
    return response.json();
  },

  /**
   * Get due tasks (watering and fertilization)
   */
  getDueTasks: async (): Promise<DueTasks> => {
    const response = await fetch(`${API_BASE_URL}/dashboard/tasks`);
    if (!response.ok) {
      throw new Error('Failed to fetch due tasks');
    }
    return response.json();
  },

  /**
   * Get active treatments
   */
  getActiveTreatments: async (): Promise<ActiveTreatment[]> => {
    const response = await fetch(`${API_BASE_URL}/dashboard/treatments/active`);
    if (!response.ok) {
      throw new Error('Failed to fetch active treatments');
    }
    return response.json();
  },

  /**
   * Get recent activities
   */
  getRecentActivities: async (limit: number = 10): Promise<RecentActivity[]> => {
    const response = await fetch(
      `${API_BASE_URL}/dashboard/activities/recent?limit=${limit}`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch recent activities');
    }
    return response.json();
  },

  /**
   * Get calendar events for a date range
   */
  getCalendarEvents: async (
    startDate: string,
    endDate: string
  ): Promise<CalendarEvent[]> => {
    const response = await fetch(
      `${API_BASE_URL}/dashboard/calendar?start_date=${startDate}&end_date=${endDate}`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch calendar events');
    }
    return response.json();
  },
};
