/**
 * Plant list component with filters
 */

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ArrowUpDown } from 'lucide-react';
import { PlantCard } from './PlantCard';
import { usePlants } from '@/hooks/usePlants';
import type { PlantWithLocation } from '@/types/plant';

interface PlantListProps {
  onEdit?: (plant: PlantWithLocation) => void;
  onDelete?: (id: string) => void;
  onViewDetails?: (plantId: string) => void;
  locationId?: string;
}

type SortOption = 'name-asc' | 'name-desc' | 'date-newest' | 'date-oldest' | 'type';

function PlantCardSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <div className="flex gap-2 mt-4">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-16" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function PlantList({ onEdit, onDelete, onViewDetails, locationId }: PlantListProps) {
  const [typeFilter, setTypeFilter] = useState<'indoor' | 'outdoor' | undefined>(undefined);
  const [categoryFilter, setCategoryFilter] = useState<
    'flower' | 'tree' | 'grass' | 'other' | undefined
  >(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('name-asc');

  const { data: plants, isLoading, error } = usePlants({
    plantType: typeFilter,
    category: categoryFilter,
    locationId,
  });

  const filteredAndSortedPlants = useMemo(() => {
    if (!plants) return [];

    // Filter
    let result = plants.filter((plant) => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        plant.name.toLowerCase().includes(query) ||
        plant.scientific_name?.toLowerCase().includes(query) ||
        plant.species?.toLowerCase().includes(query)
      );
    });

    // Sort
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'date-newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'date-oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'type':
          return a.type.localeCompare(b.type) || a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return result;
  }, [plants, searchQuery, sortBy]);

  if (error) {
    return (
      <div className="text-red-600">
        Error loading plants: {error instanceof Error ? error.message : 'Unknown error'}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        {/* Search bar */}
        <div className="flex flex-col md:flex-row gap-4">
          <Input
            placeholder="Search plants by name, scientific name, or species..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
        </div>

        {/* Filters and sorting */}
        <div className="flex flex-col md:flex-row gap-4">
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

          <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
            <SelectTrigger className="md:w-48">
              <ArrowUpDown className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name-asc">Name (A-Z)</SelectItem>
              <SelectItem value="name-desc">Name (Z-A)</SelectItem>
              <SelectItem value="date-newest">Newest First</SelectItem>
              <SelectItem value="date-oldest">Oldest First</SelectItem>
              <SelectItem value="type">Type</SelectItem>
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
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <PlantCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredAndSortedPlants && filteredAndSortedPlants.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAndSortedPlants.map((plant) => (
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
