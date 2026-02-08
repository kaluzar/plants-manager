import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PlantList } from './PlantList'
import { renderWithProviders, mockPlantWithLocation } from '@/test/utils'
import * as usePlantsHook from '@/hooks/usePlants'

vi.mock('@/hooks/usePlants')

describe('PlantList', () => {
  const mockPlants = [
    mockPlantWithLocation,
    {
      ...mockPlantWithLocation,
      id: '123e4567-e89b-12d3-a456-426614174002',
      name: 'Sunflower',
      type: 'outdoor' as const,
      category: 'flower' as const,
    },
    {
      ...mockPlantWithLocation,
      id: '123e4567-e89b-12d3-a456-426614174003',
      name: 'Oak Tree',
      type: 'outdoor' as const,
      category: 'tree' as const,
    },
  ]

  beforeEach(() => {
    vi.mocked(usePlantsHook.usePlants).mockReturnValue({
      data: mockPlants,
      isLoading: false,
      error: null,
    } as any)
  })

  it('renders list of plants', () => {
    renderWithProviders(<PlantList />)

    expect(screen.getByText('Rose Bush')).toBeInTheDocument()
    expect(screen.getByText('Sunflower')).toBeInTheDocument()
    expect(screen.getByText('Oak Tree')).toBeInTheDocument()
  })

  it('shows loading state', () => {
    vi.mocked(usePlantsHook.usePlants).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    } as any)

    renderWithProviders(<PlantList />)

    expect(screen.getByText(/loading plants/i)).toBeInTheDocument()
  })

  it('shows error state', () => {
    vi.mocked(usePlantsHook.usePlants).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Failed to fetch'),
    } as any)

    renderWithProviders(<PlantList />)

    expect(screen.getByText(/error loading plants/i)).toBeInTheDocument()
  })

  it('shows empty state when no plants', () => {
    vi.mocked(usePlantsHook.usePlants).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    } as any)

    renderWithProviders(<PlantList />)

    expect(screen.getByText(/no plants found/i)).toBeInTheDocument()
  })

  it('filters plants by search query', async () => {
    const user = userEvent.setup()

    renderWithProviders(<PlantList />)

    const searchInput = screen.getByPlaceholderText(/search plants/i)
    await user.type(searchInput, 'rose')

    await waitFor(() => {
      // Only Rose Bush should be visible
      expect(screen.getByText('Rose Bush')).toBeInTheDocument()
    })
  })

  it('filters plants by type', async () => {
    const user = userEvent.setup()

    renderWithProviders(<PlantList />)

    // Select indoor type - should trigger usePlants with indoor filter
    const typeComboboxes = screen.getAllByRole('combobox')
    // First combobox is type, second is category
    const typeCombobox = typeComboboxes[0]

    await user.click(typeCombobox)
    const indoorOption = await screen.findByRole('option', { name: /^indoor$/i })
    await user.click(indoorOption)

    await waitFor(() => {
      expect(usePlantsHook.usePlants).toHaveBeenCalledWith(
        expect.objectContaining({
          plantType: 'indoor',
        })
      )
    })
  })

  it('filters plants by category', async () => {
    const user = userEvent.setup()

    renderWithProviders(<PlantList />)

    // Find the category combobox (second one)
    const comboboxes = screen.getAllByRole('combobox')
    const categoryCombobox = comboboxes[1]

    await user.click(categoryCombobox)
    const treeOption = await screen.findByRole('option', { name: /^tree$/i })
    await user.click(treeOption)

    await waitFor(() => {
      expect(usePlantsHook.usePlants).toHaveBeenCalledWith(
        expect.objectContaining({
          category: 'tree',
        })
      )
    })
  })

  it('clears all filters when clear button is clicked', async () => {
    const user = userEvent.setup()

    renderWithProviders(<PlantList />)

    // Set search query
    await user.type(screen.getByPlaceholderText(/search plants/i), 'rose')

    // Clear filters
    const clearButton = await screen.findByRole('button', { name: /clear filters/i })
    await user.click(clearButton)

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/search plants/i)).toHaveValue('')
    })
  })

  it('shows clear filters button only when filters are active', async () => {
    const user = userEvent.setup()

    renderWithProviders(<PlantList />)

    expect(screen.queryByRole('button', { name: /clear filters/i })).not.toBeInTheDocument()

    await user.type(screen.getByPlaceholderText(/search plants/i), 'rose')

    expect(screen.getByRole('button', { name: /clear filters/i })).toBeInTheDocument()
  })

  it('calls onEdit when edit is triggered on a plant card', async () => {
    const user = userEvent.setup()
    const onEdit = vi.fn()

    renderWithProviders(<PlantList onEdit={onEdit} />)

    const editButtons = screen.getAllByRole('button', { name: /edit/i })
    await user.click(editButtons[0])

    expect(onEdit).toHaveBeenCalledWith(mockPlants[0])
  })

  it('calls onDelete when delete is triggered on a plant card', async () => {
    const user = userEvent.setup()
    const onDelete = vi.fn()

    renderWithProviders(<PlantList onDelete={onDelete} />)

    const deleteButtons = screen.getAllByRole('button', { name: /delete/i })
    await user.click(deleteButtons[0])

    expect(onDelete).toHaveBeenCalledWith(mockPlants[0].id)
  })

  it('calls onViewDetails when view details is triggered on a plant card', async () => {
    const user = userEvent.setup()
    const onViewDetails = vi.fn()

    renderWithProviders(<PlantList onViewDetails={onViewDetails} />)

    const viewButtons = screen.getAllByRole('button', { name: /view details/i })
    await user.click(viewButtons[0])

    expect(onViewDetails).toHaveBeenCalledWith(mockPlants[0].id)
  })

  it('passes locationId filter to usePlants hook', () => {
    const locationId = '123e4567-e89b-12d3-a456-426614174000'

    renderWithProviders(<PlantList locationId={locationId} />)

    expect(usePlantsHook.usePlants).toHaveBeenCalledWith(
      expect.objectContaining({
        locationId,
      })
    )
  })
})
