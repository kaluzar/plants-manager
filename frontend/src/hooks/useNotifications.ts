/**
 * React Query hooks for notification management
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '@/services/notificationService';

const NOTIFICATIONS_QUERY_KEY = 'notifications';

/**
 * Hook to fetch all notifications
 */
export function useNotifications(unreadOnly: boolean = false) {
  return useQuery({
    queryKey: [NOTIFICATIONS_QUERY_KEY, { unreadOnly }],
    queryFn: () => notificationService.getAll(unreadOnly),
    refetchInterval: 60000, // Refetch every minute
  });
}

/**
 * Hook to fetch notification statistics
 */
export function useNotificationStats() {
  return useQuery({
    queryKey: [NOTIFICATIONS_QUERY_KEY, 'stats'],
    queryFn: () => notificationService.getStats(),
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

/**
 * Hook to mark a notification as read
 */
export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onSuccess: () => {
      // Invalidate all notification queries to refetch data
      queryClient.invalidateQueries({ queryKey: [NOTIFICATIONS_QUERY_KEY] });
    },
  });
}

/**
 * Hook to mark all notifications as read
 */
export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      // Invalidate all notification queries to refetch data
      queryClient.invalidateQueries({ queryKey: [NOTIFICATIONS_QUERY_KEY] });
    },
  });
}

/**
 * Hook to delete a notification
 */
export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationService.delete(id),
    onSuccess: () => {
      // Invalidate all notification queries to refetch data
      queryClient.invalidateQueries({ queryKey: [NOTIFICATIONS_QUERY_KEY] });
    },
  });
}
