/**
 * GrowthTimeline component for displaying growth logs
 */

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import type { GrowthLog } from '@/types/growthLog';

interface GrowthTimelineProps {
  growthLogs: GrowthLog[];
  onDelete?: (growthLogId: string) => void;
}

function getHealthStatusBadgeVariant(
  status: string
): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case 'excellent':
      return 'default';
    case 'good':
      return 'secondary';
    case 'fair':
      return 'outline';
    case 'poor':
      return 'destructive';
    default:
      return 'outline';
  }
}

export function GrowthTimeline({ growthLogs, onDelete }: GrowthTimelineProps) {
  if (growthLogs.length === 0) {
    return (
      <Card className="p-6 text-center text-muted-foreground">
        <p>No growth logs recorded yet.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {growthLogs.map((log) => (
        <Card key={log.id} className="p-4">
          <div className="space-y-3">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium">
                  {format(new Date(log.measured_at), 'PPp')}
                </p>
                {log.health_status && (
                  <Badge variant={getHealthStatusBadgeVariant(log.health_status)} className="mt-2">
                    {log.health_status.charAt(0).toUpperCase() + log.health_status.slice(1)}
                  </Badge>
                )}
              </div>
              {onDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(log.id)}
                  className="text-destructive"
                >
                  Delete
                </Button>
              )}
            </div>

            {/* Measurements */}
            {(log.height_cm || log.width_cm) && (
              <div className="flex gap-4 text-sm">
                {log.height_cm && (
                  <div>
                    <span className="text-muted-foreground">Height:</span>{' '}
                    <span className="font-medium">{log.height_cm} cm</span>
                  </div>
                )}
                {log.width_cm && (
                  <div>
                    <span className="text-muted-foreground">Width:</span>{' '}
                    <span className="font-medium">{log.width_cm} cm</span>
                  </div>
                )}
              </div>
            )}

            {/* Notes */}
            {log.notes && (
              <p className="text-sm text-muted-foreground border-t pt-2">
                {log.notes}
              </p>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
