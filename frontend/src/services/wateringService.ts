/**
 * API service for watering operations
 */
import {
  WateringSchedule,
  WateringScheduleCreate,
  WateringScheduleUpdate,
  WateringScheduleWithNextDate,
  WateringLog,
  WateringLogCreate,
} from '@/types/watering'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

export const wateringService = {
  // Schedule operations
  async getSchedule(scheduleId: string): Promise<WateringSchedule> {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/watering/schedules/${scheduleId}`
    )
    if (!response.ok) {
      throw new Error('Failed to fetch watering schedule')
    }
    return response.json()
  },

  async getScheduleWithNextDate(
    scheduleId: string
  ): Promise<WateringScheduleWithNextDate> {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/watering/schedules/${scheduleId}/next-date`
    )
    if (!response.ok) {
      throw new Error('Failed to fetch watering schedule with next date')
    }
    return response.json()
  },

  async getPlantSchedules(
    plantId: string,
    activeOnly: boolean = false
  ): Promise<WateringSchedule[]> {
    const params = new URLSearchParams()
    if (activeOnly) {
      params.append('active_only', 'true')
    }
    const url = `${API_BASE_URL}/api/v1/watering/plants/${plantId}/schedules${
      params.toString() ? `?${params.toString()}` : ''
    }`
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error('Failed to fetch plant watering schedules')
    }
    return response.json()
  },

  async createSchedule(
    plantId: string,
    scheduleData: Omit<WateringScheduleCreate, 'plant_id'>
  ): Promise<WateringSchedule> {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/watering/plants/${plantId}/schedules`,
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
      throw new Error('Failed to create watering schedule')
    }
    return response.json()
  },

  async updateSchedule(
    scheduleId: string,
    scheduleData: WateringScheduleUpdate
  ): Promise<WateringSchedule> {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/watering/schedules/${scheduleId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(scheduleData),
      }
    )
    if (!response.ok) {
      throw new Error('Failed to update watering schedule')
    }
    return response.json()
  },

  async deleteSchedule(scheduleId: string): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/watering/schedules/${scheduleId}`,
      {
        method: 'DELETE',
      }
    )
    if (!response.ok) {
      throw new Error('Failed to delete watering schedule')
    }
  },

  // Log operations
  async getPlantLogs(plantId: string, limit: number = 50): Promise<WateringLog[]> {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/watering/plants/${plantId}/logs?limit=${limit}`
    )
    if (!response.ok) {
      throw new Error('Failed to fetch watering logs')
    }
    return response.json()
  },

  async createLog(
    plantId: string,
    logData: Omit<WateringLogCreate, 'plant_id'>
  ): Promise<WateringLog> {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/watering/plants/${plantId}/logs`,
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
      throw new Error('Failed to create watering log')
    }
    return response.json()
  },

  async deleteLog(logId: string): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/watering/logs/${logId}`,
      {
        method: 'DELETE',
      }
    )
    if (!response.ok) {
      throw new Error('Failed to delete watering log')
    }
  },

  // Due watering
  async getDueForWatering(
    daysAhead: number = 0
  ): Promise<WateringScheduleWithNextDate[]> {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/watering/due?days_ahead=${daysAhead}`
    )
    if (!response.ok) {
      throw new Error('Failed to fetch due watering schedules')
    }
    return response.json()
  },
}
