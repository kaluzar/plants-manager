/**
 * Treatment API Service
 */

import {
  Treatment,
  TreatmentCreate,
  TreatmentUpdate,
  TreatmentWithApplications,
  TreatmentApplication,
  TreatmentApplicationCreate,
  TreatmentStatus,
} from '../types/treatment';

const API_BASE_URL = 'http://localhost:8000/api/v1';

// Treatment endpoints
export const treatmentService = {
  // Get treatment by ID with applications
  getTreatment: async (treatmentId: string): Promise<TreatmentWithApplications> => {
    const response = await fetch(`${API_BASE_URL}/treatments/${treatmentId}`);
    if (!response.ok) throw new Error('Failed to fetch treatment');
    return response.json();
  },

  // Get all treatments for a plant
  getPlantTreatments: async (plantId: string, status?: TreatmentStatus): Promise<Treatment[]> => {
    const url = new URL(`${API_BASE_URL}/treatments/plants/${plantId}/treatments`);
    if (status) url.searchParams.set('status', status);

    const response = await fetch(url.toString());
    if (!response.ok) throw new Error('Failed to fetch plant treatments');
    return response.json();
  },

  // Get all active treatments
  getActiveTreatments: async (): Promise<Treatment[]> => {
    const response = await fetch(`${API_BASE_URL}/treatments/active`);
    if (!response.ok) throw new Error('Failed to fetch active treatments');
    return response.json();
  },

  // Create treatment for a plant
  createTreatment: async (plantId: string, data: Omit<TreatmentCreate, 'plant_id'>): Promise<Treatment> => {
    const response = await fetch(`${API_BASE_URL}/treatments/plants/${plantId}/treatments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create treatment');
    return response.json();
  },

  // Update treatment
  updateTreatment: async (treatmentId: string, data: TreatmentUpdate): Promise<Treatment> => {
    const response = await fetch(`${API_BASE_URL}/treatments/${treatmentId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update treatment');
    return response.json();
  },

  // Delete treatment
  deleteTreatment: async (treatmentId: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/treatments/${treatmentId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete treatment');
  },

  // Get applications for a treatment
  getTreatmentApplications: async (treatmentId: string): Promise<TreatmentApplication[]> => {
    const response = await fetch(`${API_BASE_URL}/treatments/${treatmentId}/applications`);
    if (!response.ok) throw new Error('Failed to fetch treatment applications');
    return response.json();
  },

  // Create application for a treatment
  createApplication: async (
    treatmentId: string,
    data: Omit<TreatmentApplicationCreate, 'treatment_id'>
  ): Promise<TreatmentApplication> => {
    const response = await fetch(`${API_BASE_URL}/treatments/${treatmentId}/applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create treatment application');
    return response.json();
  },
};
