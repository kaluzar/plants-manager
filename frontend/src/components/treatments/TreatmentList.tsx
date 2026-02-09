/**
 * List component for displaying treatments and their applications
 */

import { useState } from 'react';
import { format } from 'date-fns';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TreatmentCard } from './TreatmentCard';
import type { Treatment, TreatmentStatus, TreatmentApplication } from '@/types/treatment';

interface TreatmentListProps {
  treatments: Treatment[];
  applications?: Record<string, TreatmentApplication[]>;
  onEdit?: (treatment: Treatment) => void;
  onDelete?: (treatmentId: string) => void;
  onAddApplication?: (treatmentId: string) => void;
  showApplications?: boolean;
}

export function TreatmentList({
  treatments,
  applications = {},
  onEdit,
  onDelete,
  onAddApplication,
  showApplications = true,
}: TreatmentListProps) {
  const [statusFilter, setStatusFilter] = useState<TreatmentStatus | 'all'>('all');

  // Filter treatments by status
  const filteredTreatments = treatments.filter((treatment) => {
    if (statusFilter === 'all') return true;
    return treatment.status === statusFilter;
  });

  // Sort treatments by start date (most recent first)
  const sortedTreatments = [...filteredTreatments].sort(
    (a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
  );

  if (treatments.length === 0) {
    return (
      <Card className="p-6 text-center text-muted-foreground">
        <p>No treatments recorded yet.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Status:</span>
        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as TreatmentStatus | 'all')}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground ml-auto">
          {filteredTreatments.length} treatment{filteredTreatments.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Treatments List */}
      {filteredTreatments.length === 0 ? (
        <Card className="p-6 text-center text-muted-foreground">
          <p>No treatments found with this status.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {sortedTreatments.map((treatment) => (
            <div key={treatment.id} className="space-y-2">
              <TreatmentCard
                treatment={treatment}
                onEdit={onEdit}
                onDelete={onDelete}
              />

              {/* Applications Section */}
              {showApplications && (
                <div className="ml-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">Applications</h4>
                    {onAddApplication && treatment.status === 'active' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onAddApplication(treatment.id)}
                      >
                        Add Application
                      </Button>
                    )}
                  </div>

                  {applications[treatment.id]?.length ? (
                    <div className="space-y-2">
                      {applications[treatment.id]
                        .sort(
                          (a, b) =>
                            new Date(b.applied_at).getTime() - new Date(a.applied_at).getTime()
                        )
                        .map((app) => (
                          <Card key={app.id} className="p-3 text-sm">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium">
                                  {format(new Date(app.applied_at), 'PPp')}
                                </p>
                                {app.amount && (
                                  <p className="text-muted-foreground">Amount: {app.amount}</p>
                                )}
                                {app.notes && (
                                  <p className="text-muted-foreground mt-1">{app.notes}</p>
                                )}
                              </div>
                            </div>
                          </Card>
                        ))}
                    </div>
                  ) : (
                    <Card className="p-3 text-sm text-muted-foreground text-center">
                      No applications recorded yet.
                    </Card>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
