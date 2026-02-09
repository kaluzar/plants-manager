/**
 * React Query hooks for growth logs
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { growthLogService } from '../services/growthLogService';
import type { GrowthLog, GrowthLogCreate, GrowthLogUpdate } from '../types/growthLog';

// Query keys
export const growthLogKeys = {
  all: ['growthLogs'] as const,
  lists: () => [...growthLogKeys.all, 'list'] as const,
  list: (filters: string) => [...growthLogKeys.lists(), { filters }] as const,
  details: () => [...growthLogKeys.all, 'detail'] as const,
  detail: (id: string) => [...growthLogKeys.details(), id] as const,
  plantGrowthLogs: (plantId: string) => [...growthLogKeys.all, 'plant', plantId] as const,
};

// Query hooks
export function useGrowthLog(growthLogId: string) {
  return useQuery({
    queryKey: growthLogKeys.detail(growthLogId),
    queryFn: () => growthLogService.getGrowthLog(growthLogId),
    enabled: !!growthLogId,
  });
}

export function usePlantGrowthLogs(plantId: string) {
  return useQuery({
    queryKey: growthLogKeys.plantGrowthLogs(plantId),
    queryFn: () => growthLogService.getPlantGrowthLogs(plantId),
    enabled: !!plantId,
  });
}

// Mutation hooks
export function useCreateGrowthLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      plantId,
      data,
    }: {
      plantId: string;
      data: Omit<GrowthLogCreate, 'plant_id'>;
    }) => growthLogService.createGrowthLog(plantId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: growthLogKeys.plantGrowthLogs(variables.plantId),
      });
    },
  });
}

export function useUpdateGrowthLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ growthLogId, data }: { growthLogId: string; data: GrowthLogUpdate }) =>
      growthLogService.updateGrowthLog(growthLogId, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: growthLogKeys.detail(variables.growthLogId),
      });
      queryClient.invalidateQueries({
        queryKey: growthLogKeys.plantGrowthLogs(data.plant_id),
      });
    },
  });
}

export function useDeleteGrowthLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (growthLogId: string) => growthLogService.deleteGrowthLog(growthLogId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: growthLogKeys.all });
    },
  });
}
