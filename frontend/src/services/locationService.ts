/**
 * Location API service
 */

import type {
  Location,
  LocationCreate,
  LocationUpdate,
  LocationWithPlantsCount,
} from '@/types/location';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const locationService = {
  /**
   * Get all locations with optional type filter
   */
  async getAll(locationType?: 'indoor' | 'outdoor'): Promise<LocationWithPlantsCount[]> {
    const params = new URLSearchParams();
    if (locationType) {
      params.append('location_type', locationType);
    }

    const url = `${API_BASE_URL}/api/v1/locations/${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch locations: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Get a single location by ID
   */
  async getById(id: string): Promise<Location> {
    const response = await fetch(`${API_BASE_URL}/api/v1/locations/${id}`);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Location not found');
      }
      throw new Error(`Failed to fetch location: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Create a new location
   */
  async create(data: LocationCreate): Promise<Location> {
    const response = await fetch(`${API_BASE_URL}/api/v1/locations/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: response.statusText }));
      throw new Error(error.detail || 'Failed to create location');
    }

    return response.json();
  },

  /**
   * Update an existing location
   */
  async update(id: string, data: LocationUpdate): Promise<Location> {
    const response = await fetch(`${API_BASE_URL}/api/v1/locations/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Location not found');
      }
      const error = await response.json().catch(() => ({ detail: response.statusText }));
      throw new Error(error.detail || 'Failed to update location');
    }

    return response.json();
  },

  /**
   * Delete a location
   */
  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/v1/locations/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Location not found');
      }
      throw new Error(`Failed to delete location: ${response.statusText}`);
    }
  },
};
