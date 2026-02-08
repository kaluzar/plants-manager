import { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  })

interface AllTheProvidersProps {
  children: React.ReactNode
}

export function AllTheProviders({ children }: AllTheProvidersProps) {
  const testQueryClient = createTestQueryClient()

  return (
    <QueryClientProvider client={testQueryClient}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  )
}

export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, { wrapper: AllTheProviders, ...options })
}

// Mock data factories
export const mockLocation = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  name: 'Living Room',
  type: 'indoor' as const,
  description: 'South-facing window',
  zone: 'Main floor',
  extra_data: null,
  created_at: '2024-01-01T00:00:00Z',
}

export const mockLocationWithPlantsCount = {
  ...mockLocation,
  plants_count: 5,
}

export const mockPlant = {
  id: '123e4567-e89b-12d3-a456-426614174001',
  name: 'Rose Bush',
  scientific_name: 'Rosa rugosa',
  type: 'outdoor' as const,
  category: 'flower' as const,
  species: 'Rugosa Rose',
  location_id: mockLocation.id,
  acquisition_date: '2024-01-15',
  notes: 'Needs regular watering',
  extra_data: null,
  created_at: '2024-01-15T00:00:00Z',
  updated_at: '2024-01-15T00:00:00Z',
}

export const mockPlantWithLocation = {
  ...mockPlant,
  location_name: mockLocation.name,
  location_type: mockLocation.type,
}
