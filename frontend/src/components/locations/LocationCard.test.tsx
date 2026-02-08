import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LocationCard } from './LocationCard'
import { renderWithProviders, mockLocationWithPlantsCount } from '@/test/utils'

describe('LocationCard', () => {
  it('renders location information correctly', () => {
    renderWithProviders(<LocationCard location={mockLocationWithPlantsCount} />)

    expect(screen.getByText('Living Room')).toBeInTheDocument()
    expect(screen.getByText(/Indoor/)).toBeInTheDocument()
    expect(screen.getByText(/Main floor/)).toBeInTheDocument()
    expect(screen.getByText('South-facing window')).toBeInTheDocument()
    expect(screen.getByText('5 plants')).toBeInTheDocument()
  })

  it('shows singular plant count', () => {
    const location = { ...mockLocationWithPlantsCount, plants_count: 1 }
    renderWithProviders(<LocationCard location={location} />)

    expect(screen.getByText('1 plant')).toBeInTheDocument()
  })

  it('displays outdoor icon for outdoor locations', () => {
    const outdoorLocation = { ...mockLocationWithPlantsCount, type: 'outdoor' as const }
    renderWithProviders(<LocationCard location={outdoorLocation} />)

    expect(screen.getByText(/Outdoor/)).toBeInTheDocument()
  })

  it('calls onEdit when edit button is clicked', async () => {
    const user = userEvent.setup()
    const onEdit = vi.fn()

    renderWithProviders(
      <LocationCard location={mockLocationWithPlantsCount} onEdit={onEdit} />
    )

    const editButton = screen.getByRole('button', { name: /edit/i })
    await user.click(editButton)

    expect(onEdit).toHaveBeenCalledWith(mockLocationWithPlantsCount)
  })

  it('calls onDelete when delete button is clicked', async () => {
    const user = userEvent.setup()
    const onDelete = vi.fn()

    renderWithProviders(
      <LocationCard location={mockLocationWithPlantsCount} onDelete={onDelete} />
    )

    const deleteButton = screen.getByRole('button', { name: /delete/i })
    await user.click(deleteButton)

    expect(onDelete).toHaveBeenCalledWith(mockLocationWithPlantsCount.id)
  })

  it('calls onViewPlants when view plants button is clicked', async () => {
    const user = userEvent.setup()
    const onViewPlants = vi.fn()

    renderWithProviders(
      <LocationCard location={mockLocationWithPlantsCount} onViewPlants={onViewPlants} />
    )

    const viewButton = screen.getByRole('button', { name: /view plants/i })
    await user.click(viewButton)

    expect(onViewPlants).toHaveBeenCalledWith(mockLocationWithPlantsCount.id)
  })

  it('does not show view plants button when plants_count is 0', () => {
    const location = { ...mockLocationWithPlantsCount, plants_count: 0 }
    renderWithProviders(
      <LocationCard location={location} onViewPlants={vi.fn()} />
    )

    expect(screen.queryByRole('button', { name: /view plants/i })).not.toBeInTheDocument()
  })

  it('does not render action buttons when handlers are not provided', () => {
    renderWithProviders(<LocationCard location={mockLocationWithPlantsCount} />)

    expect(screen.queryByRole('button', { name: /edit/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /delete/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /view plants/i })).not.toBeInTheDocument()
  })
})
