/**
 * React Query hooks for plant management
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { plantService } from '@/services/plantService';
import type { PlantCreate, PlantUpdate } from '@/types/plant';

const PLANTS_QUERY_KEY = 'plants';

/**
 * Hook to fetch all plants with optional filters
 */
export function usePlants(filters?: {
  plantType?: 'indoor' | 'outdoor';
  category?: 'flower' | 'tree' | 'grass' | 'other';
  locationId?: string;
  skip?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: [PLANTS_QUERY_KEY, filters],
    queryFn: () => plantService.getAll(filters),
  });
}

/**
 * Hook to fetch a single plant by ID
 */
export function usePlant(id: string) {
  return useQuery({
    queryKey: [PLANTS_QUERY_KEY, id],
    queryFn: () => plantService.getById(id),
    enabled: !!id,
  });
}

/**
 * Hook to search plants
 */
export function useSearchPlants(query: string, limit?: number) {
  return useQuery({
    queryKey: [PLANTS_QUERY_KEY, 'search', query, limit],
    queryFn: () => plantService.search(query, limit),
    enabled: query.length >= 2,
  });
}

/**
 * Hook to fetch plants by location
 */
export function usePlantsByLocation(locationId: string) {
  return useQuery({
    queryKey: [PLANTS_QUERY_KEY, 'location', locationId],
    queryFn: () => plantService.getByLocation(locationId),
    enabled: !!locationId,
  });
}

/**
 * Hook to create a new plant
 */
export function useCreatePlant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PlantCreate) => plantService.create(data),
    onSuccess: () => {
      // Invalidate all plants queries to refetch data
      queryClient.invalidateQueries({ queryKey: [PLANTS_QUERY_KEY] });
    },
  });
}

/**
 * Hook to update an existing plant
 */
export function useUpdatePlant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: PlantUpdate }) =>
      plantService.update(id, data),
    onSuccess: (_, variables) => {
      // Invalidate all plants queries to refetch data
      queryClient.invalidateQueries({ queryKey: [PLANTS_QUERY_KEY] });
      // Invalidate the specific plant query
      queryClient.invalidateQueries({ queryKey: [PLANTS_QUERY_KEY, variables.id] });
    },
  });
}

/**
 * Hook to delete a plant
 */
export function useDeletePlant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => plantService.delete(id),
    onSuccess: () => {
      // Invalidate all plants queries to refetch data
      queryClient.invalidateQueries({ queryKey: [PLANTS_QUERY_KEY] });
    },
  });
}
