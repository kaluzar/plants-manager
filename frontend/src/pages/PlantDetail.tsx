/**
 * Plant detail page - View and manage a single plant
 */

import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Droplet, Sprout, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { PlantForm } from '@/components/plants/PlantForm';
import { WateringScheduleForm } from '@/components/watering/WateringScheduleForm';
import { WateringLogForm } from '@/components/watering/WateringLogForm';
import { WateringHistory } from '@/components/watering/WateringHistory';
import { FertilizationScheduleForm } from '@/components/fertilization/FertilizationScheduleForm';
import { FertilizationLogForm } from '@/components/fertilization/FertilizationLogForm';
import { FertilizationHistory } from '@/components/fertilization/FertilizationHistory';
import { usePlant, useUpdatePlant, useDeletePlant } from '@/hooks/usePlants';
import {
  usePlantWateringSchedules,
  usePlantWateringLogs,
  useCreateWateringSchedule,
  useCreateWateringLog,
} from '@/hooks/useWatering';
import {
  usePlantFertilizationSchedules,
  usePlantFertilizationLogs,
  useCreateFertilizationSchedule,
  useCreateFertilizationLog,
} from '@/hooks/useFertilization';
import type { PlantUpdate } from '@/types/plant';

export default function PlantDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isWateringScheduleDialogOpen, setIsWateringScheduleDialogOpen] = useState(false);
  const [isWateringLogDialogOpen, setIsWateringLogDialogOpen] = useState(false);
  const [isFertilizationScheduleDialogOpen, setIsFertilizationScheduleDialogOpen] = useState(false);
  const [isFertilizationLogDialogOpen, setIsFertilizationLogDialogOpen] = useState(false);

  const { data: plant, isLoading, error } = usePlant(id || '');
  const updateMutation = useUpdatePlant();
  const deleteMutation = useDeletePlant();

  // Watering hooks
  const { data: wateringSchedules = [] } = usePlantWateringSchedules(id || '');
  const { data: wateringLogs = [] } = usePlantWateringLogs(id || '');
  const createWateringScheduleMutation = useCreateWateringSchedule();
  const createWateringLogMutation = useCreateWateringLog();

  // Fertilization hooks
  const { data: fertilizationSchedules = [] } = usePlantFertilizationSchedules(id || '');
  const { data: fertilizationLogs = [] } = usePlantFertilizationLogs(id || '');
  const createFertilizationScheduleMutation = useCreateFertilizationSchedule();
  const createFertilizationLogMutation = useCreateFertilizationLog();

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

  const handleCreateWateringSchedule = (data: any) => {
    if (!id) return;
    createWateringScheduleMutation.mutate(
      { plantId: id, scheduleData: data },
      {
        onSuccess: () => {
          setIsWateringScheduleDialogOpen(false);
        },
      }
    );
  };

  const handleCreateWateringLog = (data: any) => {
    if (!id) return;
    createWateringLogMutation.mutate(
      { plantId: id, logData: data },
      {
        onSuccess: () => {
          setIsWateringLogDialogOpen(false);
        },
      }
    );
  };

  const handleCreateFertilizationSchedule = (data: any) => {
    if (!id) return;
    createFertilizationScheduleMutation.mutate(
      { plantId: id, scheduleData: data },
      {
        onSuccess: () => {
          setIsFertilizationScheduleDialogOpen(false);
        },
      }
    );
  };

  const handleCreateFertilizationLog = (data: any) => {
    if (!id) return;
    createFertilizationLogMutation.mutate(
      { plantId: id, logData: data },
      {
        onSuccess: () => {
          setIsFertilizationLogDialogOpen(false);
        },
      }
    );
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
            <CardTitle className="flex items-center gap-2">
              <Droplet className="h-5 w-5" />
              Watering
            </CardTitle>
            <CardDescription>Manage watering schedules and history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-4">
              <Button
                size="sm"
                onClick={() => setIsWateringScheduleDialogOpen(true)}
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                Add Schedule
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsWateringLogDialogOpen(true)}
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                Quick Log
              </Button>
            </div>
            <WateringHistory logs={wateringLogs} schedules={wateringSchedules} />
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sprout className="h-5 w-5" />
              Fertilization
            </CardTitle>
            <CardDescription>Manage fertilization schedules and history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-4">
              <Button
                size="sm"
                onClick={() => setIsFertilizationScheduleDialogOpen(true)}
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                Add Schedule
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsFertilizationLogDialogOpen(true)}
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                Quick Log
              </Button>
            </div>
            <FertilizationHistory logs={fertilizationLogs} schedules={fertilizationSchedules} />
          </CardContent>
        </Card>

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

      <Dialog open={isWateringScheduleDialogOpen} onOpenChange={setIsWateringScheduleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Watering Schedule</DialogTitle>
          </DialogHeader>
          <WateringScheduleForm
            onSubmit={handleCreateWateringSchedule}
            onCancel={() => setIsWateringScheduleDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isWateringLogDialogOpen} onOpenChange={setIsWateringLogDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log Watering</DialogTitle>
          </DialogHeader>
          <WateringLogForm
            onSubmit={handleCreateWateringLog}
            onCancel={() => setIsWateringLogDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isFertilizationScheduleDialogOpen} onOpenChange={setIsFertilizationScheduleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Fertilization Schedule</DialogTitle>
          </DialogHeader>
          <FertilizationScheduleForm
            onSubmit={handleCreateFertilizationSchedule}
            onCancel={() => setIsFertilizationScheduleDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isFertilizationLogDialogOpen} onOpenChange={setIsFertilizationLogDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log Fertilization</DialogTitle>
          </DialogHeader>
          <FertilizationLogForm
            onSubmit={handleCreateFertilizationLog}
            onCancel={() => setIsFertilizationLogDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
