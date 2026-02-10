/**
 * CalendarView component for displaying scheduled events
 */

import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Droplet, Sprout, AlertCircle } from 'lucide-react';
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import type { CalendarEvent } from '@/types/dashboard';

interface CalendarViewProps {
  events: CalendarEvent[];
  currentDate: Date;
}

function getEventIcon(type: string) {
  switch (type) {
    case 'watering':
      return <Droplet className="h-4 w-4 text-blue-500" />;
    case 'fertilization':
      return <Sprout className="h-4 w-4 text-green-500" />;
    case 'treatment_start':
    case 'treatment_end':
      return <AlertCircle className="h-4 w-4 text-orange-500" />;
    default:
      return null;
  }
}

function getEventBadgeVariant(
  type: string
): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (type) {
    case 'watering':
      return 'default';
    case 'fertilization':
      return 'secondary';
    case 'treatment_start':
    case 'treatment_end':
      return 'destructive';
    default:
      return 'outline';
  }
}

export function CalendarView({ events, currentDate }: CalendarViewProps) {
  // Group events by date
  const eventsByDate = useMemo(() => {
    const grouped: Record<string, CalendarEvent[]> = {};
    events.forEach((event) => {
      const dateKey = event.date.split('T')[0]; // Get just the date part
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(event);
    });
    return grouped;
  }, [events]);

  // Get all days in the current month
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  if (events.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-muted-foreground">
          No scheduled events for this month.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {daysInMonth.map((day) => {
        const dateKey = format(day, 'yyyy-MM-dd');
        const dayEvents = eventsByDate[dateKey] || [];

        if (dayEvents.length === 0) {
          return null;
        }

        return (
          <div key={dateKey} className="space-y-2">
            <h3 className="text-lg font-semibold">{format(day, 'EEEE, MMMM d')}</h3>
            <div className="space-y-2">
              {dayEvents.map((event) => (
                <Link key={event.id} to={`/plants/${event.plant_id}`}>
                  <Card className="p-4 hover:bg-accent cursor-pointer transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getEventIcon(event.type)}
                        <div>
                          <p className="font-medium">{event.title}</p>
                          <p className="text-sm text-muted-foreground">
                            Plant: {event.plant_id.slice(0, 8)}
                          </p>
                        </div>
                      </div>
                      <Badge variant={getEventBadgeVariant(event.type)}>
                        {event.type.replace('_', ' ')}
                      </Badge>
                    </div>

                    {/* Additional details */}
                    {event.details && Object.keys(event.details).length > 0 && (
                      <div className="mt-2 text-sm text-muted-foreground">
                        {event.details.frequency_days && (
                          <span>Every {event.details.frequency_days} days</span>
                        )}
                        {event.details.fertilizer_type && (
                          <span> • {event.details.fertilizer_type}</span>
                        )}
                        {event.details.product_name && (
                          <span> • {event.details.product_name}</span>
                        )}
                      </div>
                    )}
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
