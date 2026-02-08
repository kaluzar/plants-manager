import { describe, it, expect, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LocationForm } from './LocationForm'
import { renderWithProviders, mockLocation } from '@/test/utils'

describe('LocationForm', () => {
  it('renders empty form for creating new location', () => {
    renderWithProviders(<LocationForm onSubmit={vi.fn()} />)

    expect(screen.getByLabelText(/name/i)).toHaveValue('')
    expect(screen.getByRole('button', { name: /create location/i })).toBeInTheDocument()
  })

  it('renders form with location data for editing', () => {
    renderWithProviders(<LocationForm location={mockLocation} onSubmit={vi.fn()} />)

    expect(screen.getByLabelText(/name/i)).toHaveValue('Living Room')
    expect(screen.getByLabelText(/description/i)).toHaveValue('South-facing window')
    expect(screen.getByLabelText(/zone/i)).toHaveValue('Main floor')
    expect(screen.getByRole('button', { name: /update location/i })).toBeInTheDocument()
  })

  it('submits form with correct data for new location', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    renderWithProviders(<LocationForm onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText(/name/i), 'Kitchen')
    await user.click(screen.getByRole('combobox', { name: /type/i }))
    await user.click(screen.getByRole('option', { name: /indoor/i }))
    await user.type(screen.getByLabelText(/zone/i), 'Ground floor')
    await user.type(screen.getByLabelText(/description/i), 'Next to sink')

    await user.click(screen.getByRole('button', { name: /create location/i }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        name: 'Kitchen',
        type: 'indoor',
        zone: 'Ground floor',
        description: 'Next to sink',
      })
    })
  })

  it('submits form with null values for empty optional fields', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    renderWithProviders(<LocationForm onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText(/name/i), 'Balcony')
    await user.click(screen.getByRole('combobox', { name: /type/i }))
    await user.click(screen.getByRole('option', { name: /outdoor/i }))

    await user.click(screen.getByRole('button', { name: /create location/i }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        name: 'Balcony',
        type: 'outdoor',
        zone: null,
        description: null,
      })
    })
  })

  it('calls onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup()
    const onCancel = vi.fn()

    renderWithProviders(<LocationForm onSubmit={vi.fn()} onCancel={onCancel} />)

    await user.click(screen.getByRole('button', { name: /cancel/i }))

    expect(onCancel).toHaveBeenCalled()
  })

  it('does not render cancel button when onCancel is not provided', () => {
    renderWithProviders(<LocationForm onSubmit={vi.fn()} />)

    expect(screen.queryByRole('button', { name: /cancel/i })).not.toBeInTheDocument()
  })

  it('disables form when isLoading is true', () => {
    renderWithProviders(<LocationForm onSubmit={vi.fn()} isLoading={true} />)

    expect(screen.getByLabelText(/name/i)).toBeDisabled()
    expect(screen.getByRole('button', { name: /saving/i })).toBeDisabled()
  })

  it('requires name field', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    renderWithProviders(<LocationForm onSubmit={onSubmit} />)

    const submitButton = screen.getByRole('button', { name: /create location/i })
    await user.click(submitButton)

    // HTML5 validation should prevent submission
    expect(onSubmit).not.toHaveBeenCalled()
  })
})
