import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PlantCard } from './PlantCard'
import { renderWithProviders, mockPlantWithLocation } from '@/test/utils'

describe('PlantCard', () => {
  it('renders plant information correctly', () => {
    renderWithProviders(<PlantCard plant={mockPlantWithLocation} />)

    expect(screen.getByText('Rose Bush')).toBeInTheDocument()
    expect(screen.getByText(/Rosa rugosa/)).toBeInTheDocument()
    expect(screen.getByText(/Rugosa Rose/)).toBeInTheDocument()
    expect(screen.getByText(/Outdoor/)).toBeInTheDocument()
    expect(screen.getByText('Living Room')).toBeInTheDocument()
  })

  it('displays correct category icon for flower', () => {
    renderWithProviders(<PlantCard plant={mockPlantWithLocation} />)

    expect(screen.getByText('🌸')).toBeInTheDocument()
  })

  it('displays correct category icon for tree', () => {
    const plant = { ...mockPlantWithLocation, category: 'tree' as const }
    renderWithProviders(<PlantCard plant={plant} />)

    expect(screen.getByText('🌳')).toBeInTheDocument()
  })

  it('displays correct category icon for grass', () => {
    const plant = { ...mockPlantWithLocation, category: 'grass' as const }
    renderWithProviders(<PlantCard plant={plant} />)

    expect(screen.getByText('🌿')).toBeInTheDocument()
  })

  it('displays correct category icon for other', () => {
    const plant = { ...mockPlantWithLocation, category: 'other' as const }
    renderWithProviders(<PlantCard plant={plant} />)

    expect(screen.getByText('🪴')).toBeInTheDocument()
  })

  it('shows indoor icon for indoor plants', () => {
    const plant = { ...mockPlantWithLocation, type: 'indoor' as const }
    renderWithProviders(<PlantCard plant={plant} />)

    expect(screen.getByText(/Indoor/)).toBeInTheDocument()
  })

  it('formats acquisition date correctly', () => {
    renderWithProviders(<PlantCard plant={mockPlantWithLocation} />)

    expect(screen.getByText(/1\/15\/2024/)).toBeInTheDocument()
  })

  it('does not show location when not assigned', () => {
    const plant = { ...mockPlantWithLocation, location_name: null, location_type: null }
    renderWithProviders(<PlantCard plant={plant} />)

    expect(screen.queryByText(/Location:/)).not.toBeInTheDocument()
  })

  it('does not show acquisition date when not set', () => {
    const plant = { ...mockPlantWithLocation, acquisition_date: null }
    renderWithProviders(<PlantCard plant={plant} />)

    expect(screen.queryByText(/Acquired:/)).not.toBeInTheDocument()
  })

  it('truncates long notes', () => {
    const plant = {
      ...mockPlantWithLocation,
      notes: 'This is a very long note that should be truncated to show only the first two lines',
    }
    renderWithProviders(<PlantCard plant={plant} />)

    const notesElement = screen.getByText(/This is a very long note/)
    expect(notesElement).toHaveClass('line-clamp-2')
  })

  it('calls onEdit when edit button is clicked', async () => {
    const user = userEvent.setup()
    const onEdit = vi.fn()

    renderWithProviders(<PlantCard plant={mockPlantWithLocation} onEdit={onEdit} />)

    await user.click(screen.getByRole('button', { name: /edit/i }))

    expect(onEdit).toHaveBeenCalledWith(mockPlantWithLocation)
  })

  it('calls onDelete when delete button is clicked', async () => {
    const user = userEvent.setup()
    const onDelete = vi.fn()

    renderWithProviders(<PlantCard plant={mockPlantWithLocation} onDelete={onDelete} />)

    await user.click(screen.getByRole('button', { name: /delete/i }))

    expect(onDelete).toHaveBeenCalledWith(mockPlantWithLocation.id)
  })

  it('calls onViewDetails when view details button is clicked', async () => {
    const user = userEvent.setup()
    const onViewDetails = vi.fn()

    renderWithProviders(
      <PlantCard plant={mockPlantWithLocation} onViewDetails={onViewDetails} />
    )

    await user.click(screen.getByRole('button', { name: /view details/i }))

    expect(onViewDetails).toHaveBeenCalledWith(mockPlantWithLocation.id)
  })

  it('does not render action buttons when handlers are not provided', () => {
    renderWithProviders(<PlantCard plant={mockPlantWithLocation} />)

    expect(screen.queryByRole('button', { name: /edit/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /delete/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /view details/i })).not.toBeInTheDocument()
  })
})
