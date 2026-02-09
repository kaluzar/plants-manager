/**
 * Card component for displaying treatment information
 */

import { format } from 'date-fns';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Treatment, TreatmentStatus, IssueType, TreatmentType } from '@/types/treatment';

interface TreatmentCardProps {
  treatment: Treatment;
  onEdit?: (treatment: Treatment) => void;
  onDelete?: (treatmentId: string) => void;
  onViewApplications?: (treatmentId: string) => void;
}

// Helper function to get status badge variant
function getStatusVariant(status: TreatmentStatus): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case 'active':
      return 'default';
    case 'completed':
      return 'secondary';
    case 'cancelled':
      return 'destructive';
    default:
      return 'outline';
  }
}

// Helper function to format issue type
function formatIssueType(issueType: IssueType): string {
  return issueType.charAt(0).toUpperCase() + issueType.slice(1);
}

// Helper function to format treatment type
function formatTreatmentType(treatmentType: TreatmentType): string {
  return treatmentType.charAt(0).toUpperCase() + treatmentType.slice(1);
}

export function TreatmentCard({
  treatment,
  onEdit,
  onDelete,
  onViewApplications,
}: TreatmentCardProps) {
  return (
    <Card className="p-4">
      <div className="space-y-3">
        {/* Header: Issue Name and Status */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="font-semibold text-lg">{treatment.issue_name}</h3>
            <p className="text-sm text-muted-foreground">
              {formatIssueType(treatment.issue_type)}
            </p>
          </div>
          <Badge variant={getStatusVariant(treatment.status)}>
            {treatment.status.charAt(0).toUpperCase() + treatment.status.slice(1)}
          </Badge>
        </div>

        {/* Treatment Details */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Treatment Type:</span>
            <span className="font-medium">{formatTreatmentType(treatment.treatment_type)}</span>
          </div>

          {treatment.product_name && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Product:</span>
              <span className="font-medium">{treatment.product_name}</span>
            </div>
          )}

          <div className="flex justify-between">
            <span className="text-muted-foreground">Start Date:</span>
            <span className="font-medium">{format(new Date(treatment.start_date), 'MMM d, yyyy')}</span>
          </div>

          {treatment.end_date && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">End Date:</span>
              <span className="font-medium">{format(new Date(treatment.end_date), 'MMM d, yyyy')}</span>
            </div>
          )}
        </div>

        {/* Notes */}
        {treatment.notes && (
          <div className="pt-2 border-t">
            <p className="text-sm text-muted-foreground">{treatment.notes}</p>
          </div>
        )}

        {/* Actions */}
        {(onEdit || onDelete || onViewApplications) && (
          <div className="flex gap-2 pt-2">
            {onViewApplications && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewApplications(treatment.id)}
                className="flex-1"
              >
                View Applications
              </Button>
            )}
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(treatment)}
              >
                Edit
              </Button>
            )}
            {onDelete && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(treatment.id)}
              >
                Delete
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
