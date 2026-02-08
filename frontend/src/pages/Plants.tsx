/**
 * Plants page - List, create, and manage plants
 */

import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { PlantList } from '@/components/plants/PlantList';
import { PlantForm } from '@/components/plants/PlantForm';
import { useCreatePlant, useUpdatePlant, useDeletePlant } from '@/hooks/usePlants';
import type { PlantWithLocation, PlantCreate, PlantUpdate } from '@/types/plant';

export default function Plants() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const locationId = searchParams.get('location') || undefined;

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPlant, setEditingPlant] = useState<PlantWithLocation | null>(null);

  const createMutation = useCreatePlant();
  const updateMutation = useUpdatePlant();
  const deleteMutation = useDeletePlant();

  const handleCreate = (data: PlantCreate) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        setIsDialogOpen(false);
      },
    });
  };

  const handleUpdate = (data: PlantUpdate) => {
    if (!editingPlant) return;
    updateMutation.mutate(
      { id: editingPlant.id, data },
      {
        onSuccess: () => {
          setIsDialogOpen(false);
          setEditingPlant(null);
        },
      }
    );
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this plant?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = (plant: PlantWithLocation) => {
    setEditingPlant(plant);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingPlant(null);
  };

  const handleViewDetails = (plantId: string) => {
    navigate(`/plants/${plantId}`);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Plants</h1>
          <p className="text-muted-foreground mt-1">
            Manage your plant collection
            {locationId && ' (filtered by location)'}
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>Add Plant</Button>
      </div>

      <PlantList
        onEdit={handleEdit}
        onDelete={handleDelete}
        onViewDetails={handleViewDetails}
        locationId={locationId}
      />

      <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPlant ? 'Edit Plant' : 'Create New Plant'}</DialogTitle>
          </DialogHeader>
          <PlantForm
            plant={editingPlant || undefined}
            onSubmit={editingPlant ? handleUpdate : handleCreate}
            onCancel={handleDialogClose}
            isLoading={createMutation.isPending || updateMutation.isPending}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
