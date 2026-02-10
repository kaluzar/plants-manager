/**
 * Locations page - List, create, and manage locations
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { LayoutGrid, MapIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { LocationCard } from '@/components/locations/LocationCard';
import { LocationMap } from '@/components/locations/LocationMap';
import { LocationForm } from '@/components/locations/LocationForm';
import {
  useLocations,
  useCreateLocation,
  useUpdateLocation,
  useDeleteLocation,
} from '@/hooks/useLocations';
import type { LocationWithPlantsCount, LocationCreate, LocationUpdate } from '@/types/location';

function LocationCardSkeleton() {
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
        </div>
      </CardContent>
    </Card>
  );
}

export default function Locations() {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<LocationWithPlantsCount | null>(null);
  const [typeFilter, setTypeFilter] = useState<'indoor' | 'outdoor' | undefined>(undefined);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  const { data: locations, isLoading, error } = useLocations(typeFilter);
  const createMutation = useCreateLocation();
  const updateMutation = useUpdateLocation();
  const deleteMutation = useDeleteLocation();

  const handleCreate = (data: LocationCreate) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        setIsDialogOpen(false);
      },
    });
  };

  const handleUpdate = (data: LocationUpdate) => {
    if (!editingLocation) return;
    updateMutation.mutate(
      { id: editingLocation.id, data },
      {
        onSuccess: () => {
          setIsDialogOpen(false);
          setEditingLocation(null);
        },
      }
    );
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this location?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = (location: LocationWithPlantsCount) => {
    setEditingLocation(location);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingLocation(null);
  };

  const handleViewPlants = (locationId: string) => {
    navigate(`/plants?location=${locationId}`);
  };

  if (error) {
    return (
      <div className="p-8">
        <div className="text-red-600">Error loading locations: {error.message}</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Locations</h1>
          <p className="text-muted-foreground mt-1">
            Manage your plant locations (indoor and outdoor areas)
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>Add Location</Button>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2">
          <Button
            variant={typeFilter === undefined ? 'default' : 'outline'}
            onClick={() => setTypeFilter(undefined)}
          >
            All
          </Button>
          <Button
            variant={typeFilter === 'indoor' ? 'default' : 'outline'}
            onClick={() => setTypeFilter('indoor')}
          >
            Indoor
          </Button>
          <Button
            variant={typeFilter === 'outdoor' ? 'default' : 'outline'}
            onClick={() => setTypeFilter('outdoor')}
          >
            Outdoor
          </Button>
        </div>

        <div className="flex gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <LayoutGrid className="h-4 w-4 mr-1" />
            Grid
          </Button>
          <Button
            variant={viewMode === 'map' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('map')}
          >
            <MapIcon className="h-4 w-4 mr-1" />
            Status Map
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <LocationCardSkeleton key={i} />
          ))}
        </div>
      ) : locations && locations.length > 0 ? (
        viewMode === 'map' ? (
          <LocationMap />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {locations.map((location) => (
              <LocationCard
                key={location.id}
                location={location}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onViewPlants={handleViewPlants}
              />
            ))}
          </div>
        )
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No locations found</p>
          <Button onClick={() => setIsDialogOpen(true)}>Create your first location</Button>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingLocation ? 'Edit Location' : 'Create New Location'}
            </DialogTitle>
          </DialogHeader>
          <LocationForm
            location={editingLocation || undefined}
            onSubmit={editingLocation ? handleUpdate : handleCreate}
            onCancel={handleDialogClose}
            isLoading={createMutation.isPending || updateMutation.isPending}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
