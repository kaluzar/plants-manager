/**
 * Plant detail page - View and manage a single plant
 */

import { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Droplet, Sprout, Plus, Bug, Camera, TrendingUp, History } from 'lucide-react';
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
import { TreatmentForm } from '@/components/treatments/TreatmentForm';
import { TreatmentApplicationForm } from '@/components/treatments/TreatmentApplicationForm';
import { TreatmentList } from '@/components/treatments/TreatmentList';
import { PhotoUpload } from '@/components/photos/PhotoUpload';
import { PhotoGallery } from '@/components/photos/PhotoGallery';
import { GrowthLogForm } from '@/components/growth/GrowthLogForm';
import { GrowthTimeline } from '@/components/growth/GrowthTimeline';
import { PlantTimeline } from '@/components/timeline/PlantTimeline';
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
import {
  usePlantTreatments,
  useCreateTreatment,
  useCreateTreatmentApplication,
  useUpdateTreatment,
  useDeleteTreatment,
  useTreatmentApplications,
} from '@/hooks/useTreatments';
import {
  usePlantPhotos,
  useUploadPhoto,
  useDeletePhoto,
} from '@/hooks/usePhotos';
import {
  usePlantGrowthLogs,
  useCreateGrowthLog,
  useDeleteGrowthLog,
} from '@/hooks/useGrowthLogs';
import type { PlantUpdate } from '@/types/plant';
import type { Treatment } from '@/types/treatment';

export default function PlantDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isWateringScheduleDialogOpen, setIsWateringScheduleDialogOpen] = useState(false);
  const [isWateringLogDialogOpen, setIsWateringLogDialogOpen] = useState(false);
  const [isFertilizationScheduleDialogOpen, setIsFertilizationScheduleDialogOpen] = useState(false);
  const [isFertilizationLogDialogOpen, setIsFertilizationLogDialogOpen] = useState(false);
  const [isTreatmentDialogOpen, setIsTreatmentDialogOpen] = useState(false);
  const [isTreatmentApplicationDialogOpen, setIsTreatmentApplicationDialogOpen] = useState(false);
  const [editingTreatment, setEditingTreatment] = useState<Treatment | null>(null);
  const [selectedTreatmentId, setSelectedTreatmentId] = useState<string | null>(null);
  const [isPhotoUploadDialogOpen, setIsPhotoUploadDialogOpen] = useState(false);
  const [isGrowthLogDialogOpen, setIsGrowthLogDialogOpen] = useState(false);

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

  // Treatment hooks
  const { data: treatments = [] } = usePlantTreatments(id || '');
  const createTreatmentMutation = useCreateTreatment();
  const updateTreatmentMutation = useUpdateTreatment();
  const deleteTreatmentMutation = useDeleteTreatment();
  const createTreatmentApplicationMutation = useCreateTreatmentApplication();

  // Fetch applications for all treatments
  const treatmentApplicationsQueries = treatments.map((treatment) =>
    useTreatmentApplications(treatment.id)
  );

  // Build applications map
  const treatmentApplications = useMemo(() => {
    const map: Record<string, any[]> = {};
    treatments.forEach((treatment, index) => {
      map[treatment.id] = treatmentApplicationsQueries[index]?.data || [];
    });
    return map;
  }, [treatments, treatmentApplicationsQueries]);

  // Photo hooks
  const { data: photos = [] } = usePlantPhotos(id || '');
  const uploadPhotoMutation = useUploadPhoto();
  const deletePhotoMutation = useDeletePhoto();

  // Growth log hooks
  const { data: growthLogs = [] } = usePlantGrowthLogs(id || '');
  const createGrowthLogMutation = useCreateGrowthLog();
  const deleteGrowthLogMutation = useDeleteGrowthLog();

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

  const handleCreateTreatment = (data: any) => {
    if (!id) return;
    createTreatmentMutation.mutate(
      { plantId: id, treatmentData: data },
      {
        onSuccess: () => {
          setIsTreatmentDialogOpen(false);
        },
      }
    );
  };

  const handleUpdateTreatment = (data: any) => {
    if (!editingTreatment) return;
    updateTreatmentMutation.mutate(
      { treatmentId: editingTreatment.id, treatmentData: data },
      {
        onSuccess: () => {
          setIsTreatmentDialogOpen(false);
          setEditingTreatment(null);
        },
      }
    );
  };

  const handleEditTreatment = (treatment: Treatment) => {
    setEditingTreatment(treatment);
    setIsTreatmentDialogOpen(true);
  };

  const handleDeleteTreatment = (treatmentId: string) => {
    if (confirm('Are you sure you want to delete this treatment?')) {
      deleteTreatmentMutation.mutate(treatmentId);
    }
  };

  const handleAddTreatmentApplication = (treatmentId: string) => {
    setSelectedTreatmentId(treatmentId);
    setIsTreatmentApplicationDialogOpen(true);
  };

  const handleCreateTreatmentApplication = (data: any) => {
    if (!selectedTreatmentId) return;
    createTreatmentApplicationMutation.mutate(
      { treatmentId: selectedTreatmentId, applicationData: data },
      {
        onSuccess: () => {
          setIsTreatmentApplicationDialogOpen(false);
          setSelectedTreatmentId(null);
        },
      }
    );
  };

  const handleUploadPhoto = (data: { file: File; caption?: string }) => {
    if (!id) return;
    uploadPhotoMutation.mutate(
      { plantId: id, file: data.file, caption: data.caption },
      {
        onSuccess: () => {
          setIsPhotoUploadDialogOpen(false);
        },
      }
    );
  };

  const handleDeletePhoto = (photoId: string) => {
    if (confirm('Are you sure you want to delete this photo?')) {
      deletePhotoMutation.mutate(photoId);
    }
  };

  const handleCreateGrowthLog = (data: any) => {
    if (!id) return;
    createGrowthLogMutation.mutate(
      { plantId: id, data },
      {
        onSuccess: () => {
          setIsGrowthLogDialogOpen(false);
        },
      }
    );
  };

  const handleDeleteGrowthLog = (growthLogId: string) => {
    if (confirm('Are you sure you want to delete this growth log?')) {
      deleteGrowthLogMutation.mutate(growthLogId);
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
            <CardTitle className="flex items-center gap-2">
              <Bug className="h-5 w-5" />
              Pest & Disease Treatments
            </CardTitle>
            <CardDescription>Manage pest control and disease treatments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-4">
              <Button
                size="sm"
                onClick={() => {
                  setEditingTreatment(null);
                  setIsTreatmentDialogOpen(true);
                }}
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                Add Treatment
              </Button>
            </div>
            <TreatmentList
              treatments={treatments}
              applications={treatmentApplications}
              onEdit={handleEditTreatment}
              onDelete={handleDeleteTreatment}
              onAddApplication={handleAddTreatmentApplication}
              showApplications={true}
            />
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Photos
            </CardTitle>
            <CardDescription>Plant photo gallery</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-4">
              <Button
                size="sm"
                onClick={() => setIsPhotoUploadDialogOpen(true)}
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                Upload Photo
              </Button>
            </div>
            <PhotoGallery photos={photos} onDelete={handleDeletePhoto} />
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Growth Tracking
            </CardTitle>
            <CardDescription>Track plant growth and measurements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-4">
              <Button
                size="sm"
                onClick={() => setIsGrowthLogDialogOpen(true)}
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                Add Growth Log
              </Button>
            </div>
            <GrowthTimeline growthLogs={growthLogs} onDelete={handleDeleteGrowthLog} />
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Activity Timeline
            </CardTitle>
            <CardDescription>Complete history of all plant activities</CardDescription>
          </CardHeader>
          <CardContent>
            <PlantTimeline plantId={id || ''} />
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

      <Dialog open={isTreatmentDialogOpen} onOpenChange={setIsTreatmentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingTreatment ? 'Edit Treatment' : 'Add Treatment'}</DialogTitle>
          </DialogHeader>
          <TreatmentForm
            initialData={editingTreatment || undefined}
            onSubmit={editingTreatment ? handleUpdateTreatment : handleCreateTreatment}
            onCancel={() => {
              setIsTreatmentDialogOpen(false);
              setEditingTreatment(null);
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isTreatmentApplicationDialogOpen} onOpenChange={setIsTreatmentApplicationDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log Treatment Application</DialogTitle>
          </DialogHeader>
          <TreatmentApplicationForm
            onSubmit={handleCreateTreatmentApplication}
            onCancel={() => {
              setIsTreatmentApplicationDialogOpen(false);
              setSelectedTreatmentId(null);
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isPhotoUploadDialogOpen} onOpenChange={setIsPhotoUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Photo</DialogTitle>
          </DialogHeader>
          <PhotoUpload
            onSubmit={handleUploadPhoto}
            onCancel={() => setIsPhotoUploadDialogOpen(false)}
            isUploading={uploadPhotoMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isGrowthLogDialogOpen} onOpenChange={setIsGrowthLogDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Growth Log</DialogTitle>
          </DialogHeader>
          <GrowthLogForm
            onSubmit={handleCreateGrowthLog}
            onCancel={() => setIsGrowthLogDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
