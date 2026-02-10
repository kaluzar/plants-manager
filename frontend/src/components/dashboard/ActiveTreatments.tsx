/**
 * ActiveTreatments component for displaying active treatments
 */

import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import type { ActiveTreatment } from '@/types/dashboard';

interface ActiveTreatmentsProps {
  treatments: ActiveTreatment[];
}

function getStatusBadgeVariant(
  status: string
): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case 'in_progress':
      return 'default';
    case 'planned':
      return 'secondary';
    case 'completed':
      return 'outline';
    default:
      return 'outline';
  }
}

export function ActiveTreatments({ treatments }: ActiveTreatmentsProps) {
  if (treatments.length === 0) {
    return (
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Active Treatments</h2>
        <p className="text-muted-foreground text-center py-8">
          No active treatments. Your plants are healthy! 🌱
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Active Treatments</h2>
        <Badge variant="destructive">{treatments.length} active</Badge>
      </div>

      <div className="space-y-3">
        {treatments.map((treatment) => (
          <Link key={treatment.id} to={`/plants/${treatment.plant_id}`}>
            <Card className="p-4 hover:bg-accent cursor-pointer transition-colors">
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5" />
                    <div>
                      <p className="font-medium">{treatment.issue_name}</p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {treatment.issue_type} • {treatment.treatment_type}
                      </p>
                    </div>
                  </div>
                  <Badge variant={getStatusBadgeVariant(treatment.status)}>
                    {treatment.status.replace('_', ' ')}
                  </Badge>
                </div>

                {treatment.product_name && (
                  <p className="text-sm">
                    <span className="text-muted-foreground">Product:</span>{' '}
                    {treatment.product_name}
                  </p>
                )}

                <p className="text-xs text-muted-foreground">
                  Started: {format(parseISO(treatment.start_date), 'MMM d, yyyy')}
                  {treatment.end_date &&
                    ` • Ends: ${format(parseISO(treatment.end_date), 'MMM d, yyyy')}`}
                </p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </Card>
  );
}
