/**
 * Plant list component with filters
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { PlantCard } from './PlantCard';
import { usePlants } from '@/hooks/usePlants';
import type { PlantWithLocation } from '@/types/plant';

interface PlantListProps {
  onEdit?: (plant: PlantWithLocation) => void;
  onDelete?: (id: string) => void;
  onViewDetails?: (plantId: string) => void;
  locationId?: string;
}

export function PlantList({ onEdit, onDelete, onViewDetails, locationId }: PlantListProps) {
  const [typeFilter, setTypeFilter] = useState<'indoor' | 'outdoor' | undefined>(undefined);
  const [categoryFilter, setCategoryFilter] = useState<
    'flower' | 'tree' | 'grass' | 'other' | undefined
  >(undefined);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: plants, isLoading, error } = usePlants({
    plantType: typeFilter,
    category: categoryFilter,
    locationId,
  });

  const filteredPlants = plants?.filter((plant) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      plant.name.toLowerCase().includes(query) ||
      plant.scientific_name?.toLowerCase().includes(query) ||
      plant.species?.toLowerCase().includes(query)
    );
  });

  if (error) {
    return (
      <div className="text-red-600">
        Error loading plants: {error instanceof Error ? error.message : 'Unknown error'}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Search plants..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="md:w-64"
        />

        <Select
          value={typeFilter || 'all'}
          onValueChange={(value) => setTypeFilter(value === 'all' ? undefined : (value as any))}
        >
          <SelectTrigger className="md:w-40">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="indoor">Indoor</SelectItem>
            <SelectItem value="outdoor">Outdoor</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={categoryFilter || 'all'}
          onValueChange={(value) =>
            setCategoryFilter(value === 'all' ? undefined : (value as any))
          }
        >
          <SelectTrigger className="md:w-40">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="flower">Flower</SelectItem>
            <SelectItem value="tree">Tree</SelectItem>
            <SelectItem value="grass">Grass</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>

        {(typeFilter || categoryFilter || searchQuery) && (
          <Button
            variant="outline"
            onClick={() => {
              setTypeFilter(undefined);
              setCategoryFilter(undefined);
              setSearchQuery('');
            }}
          >
            Clear Filters
          </Button>
        )}
      </div>

      {isLoading ? (
        <div>Loading plants...</div>
      ) : filteredPlants && filteredPlants.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPlants.map((plant) => (
            <PlantCard
              key={plant.id}
              plant={plant}
              onEdit={onEdit}
              onDelete={onDelete}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No plants found</p>
        </div>
      )}
    </div>
  );
}
