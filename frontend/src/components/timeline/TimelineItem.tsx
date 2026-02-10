/**
 * TimelineItem component for displaying individual timeline events
 */

import { format } from 'date-fns';
import type { TimelineItem as TimelineItemType } from '@/types/timeline';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Droplet,
  Sprout,
  Pill,
  Flag,
  CheckCircle,
  Ruler,
  Camera,
} from 'lucide-react';

interface TimelineItemProps {
  item: TimelineItemType;
}

const ICON_MAP = {
  watering: Droplet,
  fertilization: Sprout,
  treatment_application: Pill,
  treatment_start: Flag,
  treatment_end: CheckCircle,
  growth_log: Ruler,
  photo: Camera,
};

const COLOR_MAP = {
  watering: 'bg-blue-100 text-blue-700',
  fertilization: 'bg-green-100 text-green-700',
  treatment_application: 'bg-purple-100 text-purple-700',
  treatment_start: 'bg-orange-100 text-orange-700',
  treatment_end: 'bg-emerald-100 text-emerald-700',
  growth_log: 'bg-teal-100 text-teal-700',
  photo: 'bg-pink-100 text-pink-700',
};

export function TimelineItem({ item }: TimelineItemProps) {
  const Icon = ICON_MAP[item.type] || Droplet;
  const colorClass = COLOR_MAP[item.type] || 'bg-gray-100 text-gray-700';

  return (
    <div className="relative pl-8 pb-6">
      {/* Timeline line */}
      <div className="absolute left-3 top-8 bottom-0 w-0.5 bg-border" />

      {/* Icon */}
      <div
        className={`absolute left-0 top-0 w-6 h-6 rounded-full ${colorClass} flex items-center justify-center`}
      >
        <Icon className="h-3 w-3" />
      </div>

      {/* Content */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <CardTitle className="text-base">{item.title}</CardTitle>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {format(new Date(item.timestamp), 'MMM d, yyyy h:mm a')}
            </span>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm text-muted-foreground mb-3">{item.description}</p>

          {/* Details */}
          {Object.keys(item.details).length > 0 && (
            <div className="space-y-1">
              {Object.entries(item.details).map(([key, value]) => {
                if (value === null || value === undefined) return null;

                return (
                  <div key={key} className="text-xs flex gap-2">
                    <span className="text-muted-foreground capitalize">
                      {key.replace(/_/g, ' ')}:
                    </span>
                    <span className="font-medium">
                      {typeof value === 'string' || typeof value === 'number'
                        ? value
                        : JSON.stringify(value)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
