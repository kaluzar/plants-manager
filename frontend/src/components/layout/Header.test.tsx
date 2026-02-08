import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import Header from './Header'
import { renderWithProviders } from '@/test/utils'

describe('Header', () => {
  it('renders the application title', () => {
    renderWithProviders(<Header />)

    expect(screen.getByText(/plants manager/i)).toBeInTheDocument()
  })

  it('renders the plant icon', () => {
    const { container } = renderWithProviders(<Header />)

    // Check that the Sprout icon (SVG) is rendered
    const svgElement = container.querySelector('svg')
    expect(svgElement).toBeInTheDocument()
  })

  it('has proper header styling', () => {
    renderWithProviders(<Header />)

    const header = screen.getByRole('banner')
    expect(header).toBeInTheDocument()
  })
})
