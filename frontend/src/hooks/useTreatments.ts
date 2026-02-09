/**
 * React Query hooks for treatments
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { treatmentService } from '../services/treatmentService';
import type {
  Treatment,
  TreatmentCreate,
  TreatmentUpdate,
  TreatmentWithApplications,
  TreatmentApplication,
  TreatmentApplicationCreate,
  TreatmentStatus,
} from '../types/treatment';

// Query keys
export const treatmentKeys = {
  all: ['treatments'] as const,
  lists: () => [...treatmentKeys.all, 'list'] as const,
  list: (filters: string) => [...treatmentKeys.lists(), { filters }] as const,
  details: () => [...treatmentKeys.all, 'detail'] as const,
  detail: (id: string) => [...treatmentKeys.details(), id] as const,
  plantTreatments: (plantId: string, status?: TreatmentStatus) =>
    [...treatmentKeys.all, 'plant', plantId, { status }] as const,
  activeTreatments: () => [...treatmentKeys.all, 'active'] as const,
  applications: () => [...treatmentKeys.all, 'applications'] as const,
  treatmentApplications: (treatmentId: string) =>
    [...treatmentKeys.applications(), treatmentId] as const,
};

// Query hooks
export function useTreatment(treatmentId: string) {
  return useQuery({
    queryKey: treatmentKeys.detail(treatmentId),
    queryFn: () => treatmentService.getTreatment(treatmentId),
    enabled: !!treatmentId,
  });
}

export function usePlantTreatments(plantId: string, status?: TreatmentStatus) {
  return useQuery({
    queryKey: treatmentKeys.plantTreatments(plantId, status),
    queryFn: () => treatmentService.getPlantTreatments(plantId, status),
    enabled: !!plantId,
  });
}

export function useActiveTreatments() {
  return useQuery({
    queryKey: treatmentKeys.activeTreatments(),
    queryFn: () => treatmentService.getActiveTreatments(),
  });
}

export function useTreatmentApplications(treatmentId: string) {
  return useQuery({
    queryKey: treatmentKeys.treatmentApplications(treatmentId),
    queryFn: () => treatmentService.getTreatmentApplications(treatmentId),
    enabled: !!treatmentId,
  });
}

// Mutation hooks
export function useCreateTreatment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ plantId, treatmentData }: {
      plantId: string;
      treatmentData: Omit<TreatmentCreate, 'plant_id'>
    }) => treatmentService.createTreatment(plantId, treatmentData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: treatmentKeys.plantTreatments(variables.plantId)
      });
      queryClient.invalidateQueries({
        queryKey: treatmentKeys.activeTreatments()
      });
    },
  });
}

export function useUpdateTreatment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ treatmentId, treatmentData }: {
      treatmentId: string;
      treatmentData: TreatmentUpdate
    }) => treatmentService.updateTreatment(treatmentId, treatmentData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: treatmentKeys.detail(variables.treatmentId)
      });
      queryClient.invalidateQueries({
        queryKey: treatmentKeys.plantTreatments(data.plant_id)
      });
      queryClient.invalidateQueries({
        queryKey: treatmentKeys.activeTreatments()
      });
    },
  });
}

export function useDeleteTreatment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (treatmentId: string) => treatmentService.deleteTreatment(treatmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: treatmentKeys.all });
    },
  });
}

export function useCreateTreatmentApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ treatmentId, applicationData }: {
      treatmentId: string;
      applicationData: Omit<TreatmentApplicationCreate, 'treatment_id'>
    }) => treatmentService.createApplication(treatmentId, applicationData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: treatmentKeys.treatmentApplications(variables.treatmentId)
      });
      queryClient.invalidateQueries({
        queryKey: treatmentKeys.detail(variables.treatmentId)
      });
    },
  });
}
