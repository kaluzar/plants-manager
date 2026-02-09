/**
 * Photo API Service
 */

import type { Photo, PhotoUpdate } from '../types/photo';

const API_BASE_URL = 'http://localhost:8000/api/v1';

export const photoService = {
  // Get photo by ID
  getPhoto: async (photoId: string): Promise<Photo> => {
    const response = await fetch(`${API_BASE_URL}/photos/${photoId}`);
    if (!response.ok) throw new Error('Failed to fetch photo');
    return response.json();
  },

  // Get photo file URL
  getPhotoUrl: (photoId: string, thumbnail = false): string => {
    return `${API_BASE_URL}/photos/${photoId}/file${thumbnail ? '?thumbnail=true' : ''}`;
  },

  // Get all photos for a plant
  getPlantPhotos: async (plantId: string): Promise<Photo[]> => {
    const response = await fetch(`${API_BASE_URL}/photos/plants/${plantId}/photos`);
    if (!response.ok) throw new Error('Failed to fetch plant photos');
    return response.json();
  },

  // Upload photo for a plant
  uploadPhoto: async (plantId: string, file: File, caption?: string): Promise<Photo> => {
    const formData = new FormData();
    formData.append('file', file);
    if (caption) {
      formData.append('caption', caption);
    }

    const response = await fetch(`${API_BASE_URL}/photos/plants/${plantId}/photos`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) throw new Error('Failed to upload photo');
    return response.json();
  },

  // Update photo metadata
  updatePhoto: async (photoId: string, data: PhotoUpdate): Promise<Photo> => {
    const response = await fetch(`${API_BASE_URL}/photos/${photoId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error('Failed to update photo');
    return response.json();
  },

  // Delete photo
  deletePhoto: async (photoId: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/photos/${photoId}`, {
      method: 'DELETE',
    });

    if (!response.ok) throw new Error('Failed to delete photo');
  },
};
