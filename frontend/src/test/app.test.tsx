import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { ValidationProvider } from '../contexts/ValidationContext'
import App from '../App'

// Mock the page components to avoid complex rendering issues
vi.mock('../components/pages/HomePage', () => ({
  HomePage: () => <div data-testid="home-page">Home Page</div>
}))

vi.mock('../components/pages/ValidationPage', () => ({
  ValidationPage: () => <div data-testid="validation-page">Validation Page</div>
}))

vi.mock('../components/pages/HistoryPage', () => ({
  HistoryPage: () => <div data-testid="history-page">History Page</div>
}))

vi.mock('../components/templates/Layout', () => ({
  Layout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="layout">
      <header data-testid="header">Header</header>
      <main data-testid="main">{children}</main>
    </div>
  )
}))

describe('App Component', () => {
  it('should render the main application structure', () => {
    render(
      <BrowserRouter>
        <ValidationProvider>
          <App />
        </ValidationProvider>
      </BrowserRouter>
    )

    expect(screen.getByTestId('layout')).toBeInTheDocument()
    expect(screen.getByTestId('header')).toBeInTheDocument()
    expect(screen.getByTestId('main')).toBeInTheDocument()
  })

  it('should render home page by default', () => {
    render(
      <BrowserRouter>
        <ValidationProvider>
          <App />
        </ValidationProvider>
      </BrowserRouter>
    )

    expect(screen.getByTestId('home-page')).toBeInTheDocument()
  })
})
