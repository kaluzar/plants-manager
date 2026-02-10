/**
 * Notification API service
 */

import type { Notification, NotificationStats } from '@/types/notification';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const notificationService = {
  /**
   * Get all notifications
   */
  async getAll(unreadOnly: boolean = false): Promise<Notification[]> {
    const params = new URLSearchParams();
    if (unreadOnly) params.append('unread_only', 'true');

    const url = `${API_BASE_URL}/api/v1/notifications/${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch notifications: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Get notification statistics
   */
  async getStats(): Promise<NotificationStats> {
    const response = await fetch(`${API_BASE_URL}/api/v1/notifications/stats`);

    if (!response.ok) {
      throw new Error(`Failed to fetch notification stats: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Mark a notification as read
   */
  async markAsRead(id: string): Promise<Notification> {
    const response = await fetch(`${API_BASE_URL}/api/v1/notifications/${id}/read`, {
      method: 'POST',
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Notification not found');
      }
      throw new Error(`Failed to mark notification as read: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/api/v1/notifications/read-all`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error(`Failed to mark all notifications as read: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Delete a notification
   */
  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/v1/notifications/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Notification not found');
      }
      throw new Error(`Failed to delete notification: ${response.statusText}`);
    }
  },
};
