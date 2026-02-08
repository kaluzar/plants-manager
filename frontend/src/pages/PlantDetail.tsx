/**
 * Plant detail page - View and manage a single plant
 */

import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { PlantForm } from '@/components/plants/PlantForm';
import { usePlant, useUpdatePlant, useDeletePlant } from '@/hooks/usePlants';
import type { PlantUpdate } from '@/types/plant';

export default function PlantDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { data: plant, isLoading, error } = usePlant(id || '');
  const updateMutation = useUpdatePlant();
  const deleteMutation = useDeletePlant();

  const handleUpdate = (data: PlantUpdate) => {
    if (!id) return;
    updateMutation.mutate(
      { id, data },
      {
        onSuccess: () => {
          setIsEditDialogOpen(false);
        },
      }
    );
  };

  const handleDelete = () => {
    if (!id) return;
    if (confirm('Are you sure you want to delete this plant?')) {
      deleteMutation.mutate(id, {
        onSuccess: () => {
          navigate('/plants');
        },
      });
    }
  };

  if (isLoading) {
    return <div className="p-8">Loading plant details...</div>;
  }

  if (error || !plant) {
    return (
      <div className="p-8">
        <div className="text-red-600">
          Error loading plant: {error instanceof Error ? error.message : 'Plant not found'}
        </div>
        <Button onClick={() => navigate('/plants')} className="mt-4">
          Back to Plants
        </Button>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-start mb-6">
        <div>
          <Button variant="ghost" onClick={() => navigate('/plants')} className="mb-2">
            ← Back to Plants
          </Button>
          <h1 className="text-3xl font-bold">{plant.name}</h1>
          {plant.scientific_name && (
            <p className="text-muted-foreground italic mt-1">{plant.scientific_name}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsEditDialogOpen(true)}>
            Edit
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Type</p>
              <p className="text-lg">
                {plant.type === 'indoor' ? '🏠 Indoor' : '🌳 Outdoor'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Category</p>
              <p className="text-lg capitalize">{plant.category}</p>
            </div>
            {plant.species && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Species</p>
                <p className="text-lg">{plant.species}</p>
              </div>
            )}
            {plant.acquisition_date && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Acquisition Date</p>
                <p className="text-lg">
                  {new Date(plant.acquisition_date).toLocaleDateString()}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Location</CardTitle>
            <CardDescription>Where this plant is currently placed</CardDescription>
          </CardHeader>
          <CardContent>
            {plant.location_name ? (
              <div className="space-y-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Location Name</p>
                  <p className="text-lg">{plant.location_name}</p>
                </div>
                {plant.location_type && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Location Type</p>
                    <p className="text-lg capitalize">{plant.location_type}</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground">No location assigned</p>
            )}
          </CardContent>
        </Card>

        {plant.notes && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{plant.notes}</p>
            </CardContent>
          </Card>
        )}

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Metadata</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Created</p>
              <p>{new Date(plant.created_at).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
              <p>{new Date(plant.updated_at).toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Plant</DialogTitle>
          </DialogHeader>
          <PlantForm
            plant={plant}
            onSubmit={handleUpdate}
            onCancel={() => setIsEditDialogOpen(false)}
            isLoading={updateMutation.isPending}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
