/**
 * API service for fertilization operations
 */
import {
  FertilizationSchedule,
  FertilizationScheduleCreate,
  FertilizationScheduleUpdate,
  FertilizationScheduleWithNextDate,
  FertilizationLog,
  FertilizationLogCreate,
} from '@/types/fertilization'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

export const fertilizationService = {
  // Schedule operations
  async getSchedule(scheduleId: string): Promise<FertilizationSchedule> {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/fertilization/schedules/${scheduleId}`
    )
    if (!response.ok) {
      throw new Error('Failed to fetch fertilization schedule')
    }
    return response.json()
  },

  async getScheduleWithNextDate(
    scheduleId: string
  ): Promise<FertilizationScheduleWithNextDate> {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/fertilization/schedules/${scheduleId}/next-date`
    )
    if (!response.ok) {
      throw new Error('Failed to fetch fertilization schedule with next date')
    }
    return response.json()
  },

  async getPlantSchedules(
    plantId: string,
    activeOnly: boolean = false
  ): Promise<FertilizationSchedule[]> {
    const params = new URLSearchParams()
    if (activeOnly) {
      params.append('active_only', 'true')
    }
    const url = `${API_BASE_URL}/api/v1/fertilization/plants/${plantId}/schedules${
      params.toString() ? `?${params.toString()}` : ''
    }`
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error('Failed to fetch plant fertilization schedules')
    }
    return response.json()
  },

  async createSchedule(
    plantId: string,
    scheduleData: Omit<FertilizationScheduleCreate, 'plant_id'>
  ): Promise<FertilizationSchedule> {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/fertilization/plants/${plantId}/schedules`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...scheduleData,
          plant_id: plantId,
        }),
      }
    )
    if (!response.ok) {
      throw new Error('Failed to create fertilization schedule')
    }
    return response.json()
  },

  async updateSchedule(
    scheduleId: string,
    scheduleData: FertilizationScheduleUpdate
  ): Promise<FertilizationSchedule> {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/fertilization/schedules/${scheduleId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(scheduleData),
      }
    )
    if (!response.ok) {
      throw new Error('Failed to update fertilization schedule')
    }
    return response.json()
  },

  async deleteSchedule(scheduleId: string): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/fertilization/schedules/${scheduleId}`,
      {
        method: 'DELETE',
      }
    )
    if (!response.ok) {
      throw new Error('Failed to delete fertilization schedule')
    }
  },

  // Log operations
  async getPlantLogs(
    plantId: string,
    limit: number = 50
  ): Promise<FertilizationLog[]> {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/fertilization/plants/${plantId}/logs?limit=${limit}`
    )
    if (!response.ok) {
      throw new Error('Failed to fetch fertilization logs')
    }
    return response.json()
  },

  async createLog(
    plantId: string,
    logData: Omit<FertilizationLogCreate, 'plant_id'>
  ): Promise<FertilizationLog> {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/fertilization/plants/${plantId}/logs`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...logData,
          plant_id: plantId,
        }),
      }
    )
    if (!response.ok) {
      throw new Error('Failed to create fertilization log')
    }
    return response.json()
  },

  async deleteLog(logId: string): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/fertilization/logs/${logId}`,
      {
        method: 'DELETE',
      }
    )
    if (!response.ok) {
      throw new Error('Failed to delete fertilization log')
    }
  },

  // Due fertilization
  async getDueForFertilization(
    daysAhead: number = 0
  ): Promise<FertilizationScheduleWithNextDate[]> {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/fertilization/due?days_ahead=${daysAhead}`
    )
    if (!response.ok) {
      throw new Error('Failed to fetch due fertilization schedules')
    }
    return response.json()
  },
}
