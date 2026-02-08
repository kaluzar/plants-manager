import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PlantForm } from './PlantForm'
import { renderWithProviders, mockPlant, mockLocationWithPlantsCount } from '@/test/utils'
import * as useLocationsHook from '@/hooks/useLocations'

vi.mock('@/hooks/useLocations')

describe('PlantForm', () => {
  beforeEach(() => {
    vi.mocked(useLocationsHook.useLocations).mockReturnValue({
      data: [mockLocationWithPlantsCount],
      isLoading: false,
      error: null,
    } as any)
  })

  it('renders empty form for creating new plant', () => {
    renderWithProviders(<PlantForm onSubmit={vi.fn()} />)

    expect(screen.getByLabelText(/^name/i)).toHaveValue('')
    expect(screen.getByRole('button', { name: /create plant/i })).toBeInTheDocument()
  })

  it('renders form with plant data for editing', () => {
    renderWithProviders(<PlantForm plant={mockPlant} onSubmit={vi.fn()} />)

    expect(screen.getByLabelText(/^name/i)).toHaveValue('Rose Bush')
    expect(screen.getByLabelText(/scientific name/i)).toHaveValue('Rosa rugosa')
    expect(screen.getByLabelText(/species/i)).toHaveValue('Rugosa Rose')
    expect(screen.getByLabelText(/notes/i)).toHaveValue('Needs regular watering')
    expect(screen.getByRole('button', { name: /update plant/i })).toBeInTheDocument()
  })

  it('submits form with correct data for new plant', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    renderWithProviders(<PlantForm onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText(/^name/i), 'Tomato')
    await user.type(screen.getByLabelText(/scientific name/i), 'Solanum lycopersicum')

    // Select type
    await user.click(screen.getByRole('combobox', { name: /^type/i }))
    await user.click(screen.getByRole('option', { name: /outdoor/i }))

    // Select category
    await user.click(screen.getByRole('combobox', { name: /category/i }))
    await user.click(screen.getByRole('option', { name: /other/i }))

    await user.type(screen.getByLabelText(/species/i), 'Cherry Tomato')
    await user.type(screen.getByLabelText(/notes/i), 'Water daily')

    await user.click(screen.getByRole('button', { name: /create plant/i }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        name: 'Tomato',
        scientific_name: 'Solanum lycopersicum',
        type: 'outdoor',
        category: 'other',
        species: 'Cherry Tomato',
        location_id: null,
        acquisition_date: null,
        notes: 'Water daily',
      })
    })
  })

  it('submits form with null location_id when "No location" is selected', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    renderWithProviders(<PlantForm onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText(/^name/i), 'Test Plant')

    // Location should default to "none"
    await user.click(screen.getByRole('button', { name: /create plant/i }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          location_id: null,
        })
      )
    })
  })

  it('submits form with selected location', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    renderWithProviders(<PlantForm onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText(/^name/i), 'Test Plant')

    // Select location
    await user.click(screen.getByRole('combobox', { name: /location/i }))
    await user.click(screen.getByRole('option', { name: /Living Room/i }))

    await user.click(screen.getByRole('button', { name: /create plant/i }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          location_id: mockLocationWithPlantsCount.id,
        })
      )
    })
  })

  it('handles acquisition date input', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    renderWithProviders(<PlantForm onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText(/^name/i), 'Test Plant')
    await user.type(screen.getByLabelText(/acquisition date/i), '2024-02-15')

    await user.click(screen.getByRole('button', { name: /create plant/i }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          acquisition_date: '2024-02-15',
        })
      )
    })
  })

  it('calls onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup()
    const onCancel = vi.fn()

    renderWithProviders(<PlantForm onSubmit={vi.fn()} onCancel={onCancel} />)

    await user.click(screen.getByRole('button', { name: /cancel/i }))

    expect(onCancel).toHaveBeenCalled()
  })

  it('disables form when isLoading is true', () => {
    renderWithProviders(<PlantForm onSubmit={vi.fn()} isLoading={true} />)

    expect(screen.getByLabelText(/^name/i)).toBeDisabled()
    expect(screen.getByRole('button', { name: /saving/i })).toBeDisabled()
  })

  it('requires name field', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    renderWithProviders(<PlantForm onSubmit={onSubmit} />)

    const submitButton = screen.getByRole('button', { name: /create plant/i })
    await user.click(submitButton)

    // HTML5 validation should prevent submission
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('displays location options from useLocations hook', async () => {
    const user = userEvent.setup()

    renderWithProviders(<PlantForm onSubmit={vi.fn()} />)

    await user.click(screen.getByRole('combobox', { name: /location/i }))

    expect(screen.getByRole('option', { name: /no location/i })).toBeInTheDocument()
    expect(
      screen.getByRole('option', { name: /Living Room \(indoor\)/i })
    ).toBeInTheDocument()
  })
})
