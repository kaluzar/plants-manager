/**
 * React Query hooks for dashboard data
 */

import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services/dashboardService';

export function useOverviewStats() {
  return useQuery({
    queryKey: ['dashboard', 'overview'],
    queryFn: () => dashboardService.getOverview(),
  });
}

export function useDueTasks() {
  return useQuery({
    queryKey: ['dashboard', 'tasks'],
    queryFn: () => dashboardService.getDueTasks(),
  });
}

export function useActiveTreatments() {
  return useQuery({
    queryKey: ['dashboard', 'treatments', 'active'],
    queryFn: () => dashboardService.getActiveTreatments(),
  });
}

export function useRecentActivities(limit: number = 10) {
  return useQuery({
    queryKey: ['dashboard', 'activities', 'recent', limit],
    queryFn: () => dashboardService.getRecentActivities(limit),
  });
}

export function useCalendarEvents(startDate: string, endDate: string) {
  return useQuery({
    queryKey: ['dashboard', 'calendar', startDate, endDate],
    queryFn: () => dashboardService.getCalendarEvents(startDate, endDate),
    enabled: !!startDate && !!endDate,
  });
}
