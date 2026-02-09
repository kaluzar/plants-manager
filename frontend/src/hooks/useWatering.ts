/**
 * React Query hooks for watering operations
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { wateringService } from '@/services/wateringService'
import type {
  WateringScheduleCreate,
  WateringScheduleUpdate,
  WateringLogCreate,
} from '@/types/watering'

// Query Keys
export const wateringKeys = {
  all: ['watering'] as const,
  schedules: () => [...wateringKeys.all, 'schedules'] as const,
  schedule: (id: string) => [...wateringKeys.schedules(), id] as const,
  plantSchedules: (plantId: string) => [...wateringKeys.schedules(), 'plant', plantId] as const,
  logs: () => [...wateringKeys.all, 'logs'] as const,
  plantLogs: (plantId: string) => [...wateringKeys.logs(), 'plant', plantId] as const,
  due: (daysAhead: number) => [...wateringKeys.all, 'due', daysAhead] as const,
}

// Schedule Hooks
export function useWateringSchedule(scheduleId: string) {
  return useQuery({
    queryKey: wateringKeys.schedule(scheduleId),
    queryFn: () => wateringService.getSchedule(scheduleId),
    enabled: !!scheduleId,
  })
}

export function usePlantWateringSchedules(plantId: string, activeOnly: boolean = false) {
  return useQuery({
    queryKey: [...wateringKeys.plantSchedules(plantId), { activeOnly }],
    queryFn: () => wateringService.getPlantSchedules(plantId, activeOnly),
    enabled: !!plantId,
  })
}

export function useCreateWateringSchedule() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      plantId,
      scheduleData,
    }: {
      plantId: string
      scheduleData: Omit<WateringScheduleCreate, 'plant_id'>
    }) => wateringService.createSchedule(plantId, scheduleData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: wateringKeys.plantSchedules(variables.plantId),
      })
    },
  })
}

export function useUpdateWateringSchedule() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      scheduleId,
      scheduleData,
    }: {
      scheduleId: string
      scheduleData: WateringScheduleUpdate
    }) => wateringService.updateSchedule(scheduleId, scheduleData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: wateringKeys.schedule(data.id),
      })
      queryClient.invalidateQueries({
        queryKey: wateringKeys.plantSchedules(data.plant_id),
      })
    },
  })
}

export function useDeleteWateringSchedule() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (scheduleId: string) => wateringService.deleteSchedule(scheduleId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: wateringKeys.schedules(),
      })
    },
  })
}

// Log Hooks
export function usePlantWateringLogs(plantId: string, limit: number = 50) {
  return useQuery({
    queryKey: [...wateringKeys.plantLogs(plantId), { limit }],
    queryFn: () => wateringService.getPlantLogs(plantId, limit),
    enabled: !!plantId,
  })
}

export function useCreateWateringLog() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      plantId,
      logData,
    }: {
      plantId: string
      logData: Omit<WateringLogCreate, 'plant_id'>
    }) => wateringService.createLog(plantId, logData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: wateringKeys.plantLogs(variables.plantId),
      })
      // Also invalidate schedules since logs affect next watering date calculation
      queryClient.invalidateQueries({
        queryKey: wateringKeys.plantSchedules(variables.plantId),
      })
    },
  })
}

export function useDeleteWateringLog() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (logId: string) => wateringService.deleteLog(logId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: wateringKeys.logs(),
      })
      queryClient.invalidateQueries({
        queryKey: wateringKeys.schedules(),
      })
    },
  })
}

// Due Watering Hook
export function useDueForWatering(daysAhead: number = 0) {
  return useQuery({
    queryKey: wateringKeys.due(daysAhead),
    queryFn: () => wateringService.getDueForWatering(daysAhead),
  })
}
