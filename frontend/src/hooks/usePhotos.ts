/**
 * React Query hooks for photos
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { photoService } from '../services/photoService';
import type { Photo, PhotoUpdate } from '../types/photo';

// Query keys
export const photoKeys = {
  all: ['photos'] as const,
  lists: () => [...photoKeys.all, 'list'] as const,
  list: (filters: string) => [...photoKeys.lists(), { filters }] as const,
  details: () => [...photoKeys.all, 'detail'] as const,
  detail: (id: string) => [...photoKeys.details(), id] as const,
  plantPhotos: (plantId: string) => [...photoKeys.all, 'plant', plantId] as const,
};

// Query hooks
export function usePhoto(photoId: string) {
  return useQuery({
    queryKey: photoKeys.detail(photoId),
    queryFn: () => photoService.getPhoto(photoId),
    enabled: !!photoId,
  });
}

export function usePlantPhotos(plantId: string) {
  return useQuery({
    queryKey: photoKeys.plantPhotos(plantId),
    queryFn: () => photoService.getPlantPhotos(plantId),
    enabled: !!plantId,
  });
}

// Mutation hooks
export function useUploadPhoto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      plantId,
      file,
      caption,
    }: {
      plantId: string;
      file: File;
      caption?: string;
    }) => photoService.uploadPhoto(plantId, file, caption),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: photoKeys.plantPhotos(variables.plantId),
      });
    },
  });
}

export function useUpdatePhoto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ photoId, data }: { photoId: string; data: PhotoUpdate }) =>
      photoService.updatePhoto(photoId, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: photoKeys.detail(variables.photoId),
      });
      queryClient.invalidateQueries({
        queryKey: photoKeys.plantPhotos(data.plant_id),
      });
    },
  });
}

export function useDeletePhoto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (photoId: string) => photoService.deletePhoto(photoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: photoKeys.all });
    },
  });
}
