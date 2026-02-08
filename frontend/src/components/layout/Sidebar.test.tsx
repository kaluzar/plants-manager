import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import Sidebar from './Sidebar'
import { renderWithProviders } from '@/test/utils'

describe('Sidebar', () => {
  it('renders all navigation links', () => {
    renderWithProviders(<Sidebar />)

    expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /plants/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /locations/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /calendar/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /settings/i })).toBeInTheDocument()
  })

  it('links have correct hrefs', () => {
    renderWithProviders(<Sidebar />)

    expect(screen.getByRole('link', { name: /dashboard/i })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: /plants/i })).toHaveAttribute('href', '/plants')
    expect(screen.getByRole('link', { name: /locations/i })).toHaveAttribute('href', '/locations')
    expect(screen.getByRole('link', { name: /calendar/i })).toHaveAttribute('href', '/calendar')
    expect(screen.getByRole('link', { name: /settings/i })).toHaveAttribute('href', '/settings')
  })

  it('renders navigation icons', () => {
    const { container } = renderWithProviders(<Sidebar />)

    // Check that icons (svg elements) are present
    const svgElements = container.querySelectorAll('svg')
    expect(svgElements.length).toBeGreaterThan(0)
  })

  it('has sidebar navigation structure', () => {
    renderWithProviders(<Sidebar />)

    const navigation = screen.getByRole('navigation')
    expect(navigation).toBeInTheDocument()
  })
})
