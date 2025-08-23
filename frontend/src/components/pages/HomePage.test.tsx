import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import { HomePage } from './HomePage'

// Wrapper component to provide router context
function renderWithRouter(component: React.ReactElement) {
 return render(
  <BrowserRouter>
   {component}
  </BrowserRouter>
 )
}

describe('HomePage', () => {
 it('renders the main heading', () => {
  renderWithRouter(<HomePage />)

  expect(screen.getByText('Pharmacy Invoice Assessment')).toBeInTheDocument()
 })

 it('renders the subtitle', () => {
  renderWithRouter(<HomePage />)

  expect(screen.getByText('Validate pharmacy invoices against reference data')).toBeInTheDocument()
 })

 it('renders the validation card', () => {
  renderWithRouter(<HomePage />)

  expect(screen.getByText('Invoice Validation')).toBeInTheDocument()
  expect(screen.getByText('Upload and validate pharmacy invoices')).toBeInTheDocument()
 })

 it('renders the history card', () => {
  renderWithRouter(<HomePage />)

  expect(screen.getByText('Validation History')).toBeInTheDocument()
  expect(screen.getByText('View past validation results')).toBeInTheDocument()
 })

 it('renders navigation buttons', () => {
  renderWithRouter(<HomePage />)

  const validateButton = screen.getByRole('link', { name: /start validating/i })
  const historyButton = screen.getByRole('link', { name: /view history/i })

  expect(validateButton).toBeInTheDocument()
  expect(historyButton).toBeInTheDocument()
 })

 it('has correct navigation links', () => {
  renderWithRouter(<HomePage />)

  const validateButton = screen.getByRole('link', { name: /start validating/i })
  const historyButton = screen.getByRole('link', { name: /view history/i })

  expect(validateButton).toHaveAttribute('href', '/validation')
  expect(historyButton).toHaveAttribute('href', '/history')
 })

 it('displays feature highlights', () => {
  renderWithRouter(<HomePage />)

  expect(screen.getByText('Excel File Support')).toBeInTheDocument()
  expect(screen.getByText('Real-time Validation')).toBeInTheDocument()
  expect(screen.getByText('Detailed Reporting')).toBeInTheDocument()
  expect(screen.getByText('Smart Caching')).toBeInTheDocument()
 })

 it('shows feature descriptions', () => {
  renderWithRouter(<HomePage />)

  expect(screen.getByText(/Upload Excel files/)).toBeInTheDocument()
  expect(screen.getByText(/Instant validation results/)).toBeInTheDocument()
  expect(screen.getByText(/Comprehensive discrepancy reports/)).toBeInTheDocument()
  expect(screen.getByText(/Efficient data management/)).toBeInTheDocument()
 })

 it('renders with proper styling classes', () => {
  const { container } = renderWithRouter(<HomePage />)

  // Check for main container classes
  const main = container.querySelector('main')
  expect(main).toHaveClass('flex-1', 'container', 'mx-auto', 'px-4', 'py-8')

  // Check for hero section
  const hero = container.querySelector('section')
  expect(hero).toHaveClass('text-center', 'mb-12')
 })

 it('maintains accessibility structure', () => {
  renderWithRouter(<HomePage />)

  // Check for proper heading hierarchy
  const h1 = screen.getByRole('heading', { level: 1 })
  expect(h1).toHaveTextContent('Pharmacy Invoice Assessment')

  // Check for proper link roles
  const links = screen.getAllByRole('link')
  expect(links).toHaveLength(2)
 })

 it('renders all feature cards', () => {
  renderWithRouter(<HomePage />)

  const featureCards = screen.getAllByText(/Excel File Support|Real-time Validation|Detailed Reporting|Smart Caching/)
  expect(featureCards).toHaveLength(4)
 })

 it('displays proper button text and styling', () => {
  renderWithRouter(<HomePage />)

  const validateButton = screen.getByRole('link', { name: /start validating/i })
  const historyButton = screen.getByRole('link', { name: /view history/i })

  expect(validateButton).toHaveClass('bg-blue-600', 'hover:bg-blue-700')
  expect(historyButton).toHaveClass('bg-gray-600', 'hover:bg-gray-700')
 })
})
