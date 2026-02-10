/**
 * PlantTimeline component for displaying plant activity timeline
 */

import { usePlantTimeline } from '@/hooks/usePlants';
import { TimelineItem } from './TimelineItem';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, History } from 'lucide-react';

interface PlantTimelineProps {
  plantId: string;
}

export function PlantTimeline({ plantId }: PlantTimelineProps) {
  const { data: timeline, isLoading, error } = usePlantTimeline(plantId);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <History className="h-4 w-4 animate-spin" />
          <p>Loading timeline...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error instanceof Error ? error.message : 'Failed to load timeline'}
        </AlertDescription>
      </Alert>
    );
  }

  if (!timeline || timeline.length === 0) {
    return (
      <div className="text-center py-12">
        <History className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
        <h3 className="text-lg font-medium mb-1">No Activity Yet</h3>
        <p className="text-sm text-muted-foreground">
          Start tracking watering, fertilization, and other activities to see them here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <History className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Activity Timeline</h2>
        <span className="text-sm text-muted-foreground">({timeline.length} events)</span>
      </div>

      <div className="space-y-0">
        {timeline.map((item) => (
          <TimelineItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
