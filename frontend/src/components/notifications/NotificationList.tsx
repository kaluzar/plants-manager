/**
 * NotificationList component - Displays list of notifications
 */

import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import { Bell, Check, CheckCheck, Droplet, Sprout, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  useNotifications,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
  useDeleteNotification,
} from '@/hooks/useNotifications';
import type { Notification } from '@/types/notification';

interface NotificationListProps {
  onClose?: () => void;
}

const ICON_MAP = {
  watering_due: Droplet,
  watering_overdue: Droplet,
  fertilization_due: Sprout,
  fertilization_overdue: Sprout,
  treatment_reminder: Bell,
};

const COLOR_MAP = {
  watering_due: 'text-blue-600',
  watering_overdue: 'text-red-600',
  fertilization_due: 'text-green-600',
  fertilization_overdue: 'text-orange-600',
  treatment_reminder: 'text-purple-600',
};

export function NotificationList({ onClose }: NotificationListProps) {
  const { data: notifications = [], isLoading } = useNotifications();
  const markAsReadMutation = useMarkNotificationAsRead();
  const markAllAsReadMutation = useMarkAllNotificationsAsRead();
  const deleteMutation = useDeleteNotification();

  const handleMarkAsRead = (id: string) => {
    markAsReadMutation.mutate(id);
  };

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.is_read) {
      handleMarkAsRead(notification.id);
    }
    if (onClose) {
      onClose();
    }
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <p className="text-sm text-muted-foreground">Loading notifications...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-semibold">Notifications</h3>
        {notifications.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleMarkAllAsRead}
            disabled={markAllAsReadMutation.isPending}
          >
            <CheckCheck className="h-4 w-4 mr-1" />
            Mark all read
          </Button>
        )}
      </div>

      {/* Notification list */}
      {notifications.length === 0 ? (
        <div className="p-8 text-center">
          <Bell className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
          <p className="text-sm text-muted-foreground">No notifications</p>
        </div>
      ) : (
        <ScrollArea className="h-[400px]">
          <div className="divide-y">
            {notifications.map((notification) => {
              const Icon = ICON_MAP[notification.type] || Bell;
              const colorClass = COLOR_MAP[notification.type] || 'text-gray-600';

              return (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-muted/50 transition-colors ${
                    !notification.is_read ? 'bg-blue-50/50' : ''
                  }`}
                >
                  <div className="flex gap-3">
                    <div className={`mt-1 ${colorClass}`}>
                      <Icon className="h-5 w-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          {notification.plant_id ? (
                            <Link
                              to={`/plants/${notification.plant_id}`}
                              className="font-medium text-sm hover:underline"
                              onClick={() => handleNotificationClick(notification)}
                            >
                              {notification.title}
                            </Link>
                          ) : (
                            <p className="font-medium text-sm">{notification.title}</p>
                          )}

                          <p className="text-sm text-muted-foreground mt-1">
                            {notification.message}
                          </p>

                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDistanceToNow(new Date(notification.created_at), {
                              addSuffix: true,
                            })}
                          </p>
                        </div>

                        <div className="flex gap-1">
                          {!notification.is_read && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => handleMarkAsRead(notification.id)}
                              title="Mark as read"
                            >
                              <Check className="h-3 w-3" />
                            </Button>
                          )}

                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleDelete(notification.id)}
                            title="Delete"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
