/**
 * Growth Log API Service
 */

import type { GrowthLog, GrowthLogCreate, GrowthLogUpdate } from '../types/growthLog';

const API_BASE_URL = 'http://localhost:8000/api/v1';

export const growthLogService = {
  // Get growth log by ID
  getGrowthLog: async (growthLogId: string): Promise<GrowthLog> => {
    const response = await fetch(`${API_BASE_URL}/growth/${growthLogId}`);
    if (!response.ok) throw new Error('Failed to fetch growth log');
    return response.json();
  },

  // Get all growth logs for a plant
  getPlantGrowthLogs: async (plantId: string): Promise<GrowthLog[]> => {
    const response = await fetch(`${API_BASE_URL}/growth/plants/${plantId}/growth`);
    if (!response.ok) throw new Error('Failed to fetch plant growth logs');
    return response.json();
  },

  // Create growth log for a plant
  createGrowthLog: async (
    plantId: string,
    data: Omit<GrowthLogCreate, 'plant_id'>
  ): Promise<GrowthLog> => {
    const response = await fetch(`${API_BASE_URL}/growth/plants/${plantId}/growth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error('Failed to create growth log');
    return response.json();
  },

  // Update growth log
  updateGrowthLog: async (growthLogId: string, data: GrowthLogUpdate): Promise<GrowthLog> => {
    const response = await fetch(`${API_BASE_URL}/growth/${growthLogId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error('Failed to update growth log');
    return response.json();
  },

  // Delete growth log
  deleteGrowthLog: async (growthLogId: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/growth/${growthLogId}`, {
      method: 'DELETE',
    });

    if (!response.ok) throw new Error('Failed to delete growth log');
  },
};
