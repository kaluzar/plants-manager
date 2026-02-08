/**
 * Plant API service
 */

import type { Plant, PlantCreate, PlantUpdate, PlantWithLocation } from '@/types/plant';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const plantService = {
  /**
   * Get all plants with optional filters
   */
  async getAll(filters?: {
    plantType?: 'indoor' | 'outdoor';
    category?: 'flower' | 'tree' | 'grass' | 'other';
    locationId?: string;
    skip?: number;
    limit?: number;
  }): Promise<PlantWithLocation[]> {
    const params = new URLSearchParams();
    if (filters?.plantType) params.append('plant_type', filters.plantType);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.locationId) params.append('location_id', filters.locationId);
    if (filters?.skip !== undefined) params.append('skip', filters.skip.toString());
    if (filters?.limit !== undefined) params.append('limit', filters.limit.toString());

    const url = `${API_BASE_URL}/api/v1/plants/${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch plants: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Search plants by name or scientific name
   */
  async search(query: string, limit?: number): Promise<PlantWithLocation[]> {
    const params = new URLSearchParams();
    params.append('q', query);
    if (limit) params.append('limit', limit.toString());

    const response = await fetch(`${API_BASE_URL}/api/v1/plants/search?${params.toString()}`);

    if (!response.ok) {
      throw new Error(`Failed to search plants: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Get plants by location
   */
  async getByLocation(locationId: string): Promise<PlantWithLocation[]> {
    const response = await fetch(`${API_BASE_URL}/api/v1/plants/location/${locationId}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch plants: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Get a single plant by ID
   */
  async getById(id: string): Promise<PlantWithLocation> {
    const response = await fetch(`${API_BASE_URL}/api/v1/plants/${id}`);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Plant not found');
      }
      throw new Error(`Failed to fetch plant: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Create a new plant
   */
  async create(data: PlantCreate): Promise<Plant> {
    const response = await fetch(`${API_BASE_URL}/api/v1/plants/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: response.statusText }));
      throw new Error(error.detail || 'Failed to create plant');
    }

    return response.json();
  },

  /**
   * Update an existing plant
   */
  async update(id: string, data: PlantUpdate): Promise<Plant> {
    const response = await fetch(`${API_BASE_URL}/api/v1/plants/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Plant not found');
      }
      const error = await response.json().catch(() => ({ detail: response.statusText }));
      throw new Error(error.detail || 'Failed to update plant');
    }

    return response.json();
  },

  /**
   * Delete a plant
   */
  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/v1/plants/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Plant not found');
      }
      throw new Error(`Failed to delete plant: ${response.statusText}`);
    }
  },
};
