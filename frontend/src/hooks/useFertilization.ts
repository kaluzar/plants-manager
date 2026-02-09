/**
 * React Query hooks for fertilization operations
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fertilizationService } from '@/services/fertilizationService'
import type {
  FertilizationScheduleCreate,
  FertilizationScheduleUpdate,
  FertilizationLogCreate,
} from '@/types/fertilization'

// Query Keys
export const fertilizationKeys = {
  all: ['fertilization'] as const,
  schedules: () => [...fertilizationKeys.all, 'schedules'] as const,
  schedule: (id: string) => [...fertilizationKeys.schedules(), id] as const,
  plantSchedules: (plantId: string) =>
    [...fertilizationKeys.schedules(), 'plant', plantId] as const,
  logs: () => [...fertilizationKeys.all, 'logs'] as const,
  plantLogs: (plantId: string) => [...fertilizationKeys.logs(), 'plant', plantId] as const,
  due: (daysAhead: number) => [...fertilizationKeys.all, 'due', daysAhead] as const,
}

// Schedule Hooks
export function useFertilizationSchedule(scheduleId: string) {
  return useQuery({
    queryKey: fertilizationKeys.schedule(scheduleId),
    queryFn: () => fertilizationService.getSchedule(scheduleId),
    enabled: !!scheduleId,
  })
}

export function usePlantFertilizationSchedules(
  plantId: string,
  activeOnly: boolean = false
) {
  return useQuery({
    queryKey: [...fertilizationKeys.plantSchedules(plantId), { activeOnly }],
    queryFn: () => fertilizationService.getPlantSchedules(plantId, activeOnly),
    enabled: !!plantId,
  })
}

export function useCreateFertilizationSchedule() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      plantId,
      scheduleData,
    }: {
      plantId: string
      scheduleData: Omit<FertilizationScheduleCreate, 'plant_id'>
    }) => fertilizationService.createSchedule(plantId, scheduleData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: fertilizationKeys.plantSchedules(variables.plantId),
      })
    },
  })
}

export function useUpdateFertilizationSchedule() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      scheduleId,
      scheduleData,
    }: {
      scheduleId: string
      scheduleData: FertilizationScheduleUpdate
    }) => fertilizationService.updateSchedule(scheduleId, scheduleData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: fertilizationKeys.schedule(data.id),
      })
      queryClient.invalidateQueries({
        queryKey: fertilizationKeys.plantSchedules(data.plant_id),
      })
    },
  })
}

export function useDeleteFertilizationSchedule() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (scheduleId: string) =>
      fertilizationService.deleteSchedule(scheduleId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: fertilizationKeys.schedules(),
      })
    },
  })
}

// Log Hooks
export function usePlantFertilizationLogs(plantId: string, limit: number = 50) {
  return useQuery({
    queryKey: [...fertilizationKeys.plantLogs(plantId), { limit }],
    queryFn: () => fertilizationService.getPlantLogs(plantId, limit),
    enabled: !!plantId,
  })
}

export function useCreateFertilizationLog() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      plantId,
      logData,
    }: {
      plantId: string
      logData: Omit<FertilizationLogCreate, 'plant_id'>
    }) => fertilizationService.createLog(plantId, logData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: fertilizationKeys.plantLogs(variables.plantId),
      })
      // Also invalidate schedules since logs affect next fertilization date calculation
      queryClient.invalidateQueries({
        queryKey: fertilizationKeys.plantSchedules(variables.plantId),
      })
    },
  })
}

export function useDeleteFertilizationLog() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (logId: string) => fertilizationService.deleteLog(logId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: fertilizationKeys.logs(),
      })
      queryClient.invalidateQueries({
        queryKey: fertilizationKeys.schedules(),
      })
    },
  })
}

// Due Fertilization Hook
export function useDueForFertilization(daysAhead: number = 0) {
  return useQuery({
    queryKey: fertilizationKeys.due(daysAhead),
    queryFn: () => fertilizationService.getDueForFertilization(daysAhead),
  })
}
