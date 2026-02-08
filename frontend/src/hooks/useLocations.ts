/**
 * React Query hooks for location management
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { locationService } from '@/services/locationService';
import type { LocationCreate, LocationUpdate } from '@/types/location';

const LOCATIONS_QUERY_KEY = 'locations';

/**
 * Hook to fetch all locations
 */
export function useLocations(locationType?: 'indoor' | 'outdoor') {
  return useQuery({
    queryKey: [LOCATIONS_QUERY_KEY, locationType],
    queryFn: () => locationService.getAll(locationType),
  });
}

/**
 * Hook to fetch a single location by ID
 */
export function useLocation(id: string) {
  return useQuery({
    queryKey: [LOCATIONS_QUERY_KEY, id],
    queryFn: () => locationService.getById(id),
    enabled: !!id,
  });
}

/**
 * Hook to create a new location
 */
export function useCreateLocation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LocationCreate) => locationService.create(data),
    onSuccess: () => {
      // Invalidate all locations queries to refetch data
      queryClient.invalidateQueries({ queryKey: [LOCATIONS_QUERY_KEY] });
    },
  });
}

/**
 * Hook to update an existing location
 */
export function useUpdateLocation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: LocationUpdate }) =>
      locationService.update(id, data),
    onSuccess: (_, variables) => {
      // Invalidate all locations queries to refetch data
      queryClient.invalidateQueries({ queryKey: [LOCATIONS_QUERY_KEY] });
      // Invalidate the specific location query
      queryClient.invalidateQueries({ queryKey: [LOCATIONS_QUERY_KEY, variables.id] });
    },
  });
}

/**
 * Hook to delete a location
 */
export function useDeleteLocation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => locationService.delete(id),
    onSuccess: () => {
      // Invalidate all locations queries to refetch data
      queryClient.invalidateQueries({ queryKey: [LOCATIONS_QUERY_KEY] });
    },
  });
}
