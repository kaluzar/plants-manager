/**
 * Plant card component for displaying plant information
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { PlantWithLocation } from '@/types/plant';

interface PlantCardProps {
  plant: PlantWithLocation;
  onEdit?: (plant: PlantWithLocation) => void;
  onDelete?: (id: string) => void;
  onViewDetails?: (plantId: string) => void;
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'flower':
      return '🌸';
    case 'tree':
      return '🌳';
    case 'grass':
      return '🌿';
    case 'other':
      return '🪴';
    default:
      return '🌱';
  }
};

export function PlantCard({ plant, onEdit, onDelete, onViewDetails }: PlantCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              <span>{getCategoryIcon(plant.category)}</span>
              <span>{plant.name}</span>
            </CardTitle>
            <CardDescription>
              {plant.scientific_name && <span className="italic">{plant.scientific_name}</span>}
              {plant.scientific_name && plant.species && ' • '}
              {plant.species}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {onEdit && (
              <Button variant="outline" size="sm" onClick={() => onEdit(plant)}>
                Edit
              </Button>
            )}
            {onDelete && (
              <Button variant="destructive" size="sm" onClick={() => onDelete(plant.id)}>
                Delete
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium">Type:</span>
            <span className="text-muted-foreground">
              {plant.type === 'indoor' ? '🏠 Indoor' : '🌳 Outdoor'}
            </span>
          </div>
          {plant.location_name && (
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">Location:</span>
              <span className="text-muted-foreground">{plant.location_name}</span>
            </div>
          )}
          {plant.acquisition_date && (
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">Acquired:</span>
              <span className="text-muted-foreground">
                {new Date(plant.acquisition_date).toLocaleDateString()}
              </span>
            </div>
          )}
          {plant.notes && (
            <p className="text-sm text-muted-foreground mt-3 line-clamp-2">{plant.notes}</p>
          )}
          {onViewDetails && (
            <div className="pt-2">
              <Button variant="link" size="sm" onClick={() => onViewDetails(plant.id)} className="px-0">
                View details →
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
