/**
 * Location card component for displaying location information
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { LocationWithPlantsCount } from '@/types/location';

interface LocationCardProps {
  location: LocationWithPlantsCount;
  onEdit?: (location: LocationWithPlantsCount) => void;
  onDelete?: (id: string) => void;
  onViewPlants?: (locationId: string) => void;
}

export function LocationCard({ location, onEdit, onDelete, onViewPlants }: LocationCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{location.name}</CardTitle>
            <CardDescription>
              {location.type === 'indoor' ? '🏠 Indoor' : '🌳 Outdoor'}
              {location.zone && ` • ${location.zone}`}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {onEdit && (
              <Button variant="outline" size="sm" onClick={() => onEdit(location)}>
                Edit
              </Button>
            )}
            {onDelete && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(location.id)}
              >
                Delete
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {location.description && (
          <p className="text-sm text-muted-foreground mb-4">{location.description}</p>
        )}
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">
            {location.plants_count} {location.plants_count === 1 ? 'plant' : 'plants'}
          </p>
          {onViewPlants && location.plants_count > 0 && (
            <Button variant="link" size="sm" onClick={() => onViewPlants(location.id)}>
              View plants
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
