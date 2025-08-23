import { render, screen, act } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ValidationProvider, useValidation } from './ValidationContext'

// Test component that uses the context
function TestComponent() {
 const { validationCount, incrementValidationCount, decrementValidationCount } = useValidation()

 return (
  <div>
   <div data-testid="count">Count: {validationCount}</div>
   <button onClick={incrementValidationCount} data-testid="increment">
    Increment
   </button>
   <button onClick={decrementValidationCount} data-testid="decrement">
    Decrement
   </button>
  </div>
 )
}

describe('ValidationContext', () => {
 describe('ValidationProvider', () => {
  it('renders children without crashing', () => {
   render(
    <ValidationProvider>
     <div>Test Child</div>
    </ValidationProvider>
   )

   expect(screen.getByText('Test Child')).toBeInTheDocument()
  })

  it('provides initial validation count of 0', () => {
   render(
    <ValidationProvider>
     <TestComponent />
    </ValidationProvider>
   )

   expect(screen.getByTestId('count')).toHaveTextContent('Count: 0')
  })
 })

 describe('useValidation hook', () => {
  it('increments validation count', () => {
   render(
    <ValidationProvider>
     <TestComponent />
    </ValidationProvider>
   )

   const incrementButton = screen.getByTestId('increment')
   const countDisplay = screen.getByTestId('count')

   act(() => {
    incrementButton.click()
   })

   expect(countDisplay).toHaveTextContent('Count: 1')
  })

  it('decrements validation count', () => {
   render(
    <ValidationProvider>
     <TestComponent />
    </ValidationProvider>
   )

   const incrementButton = screen.getByTestId('increment')
   const decrementButton = screen.getByTestId('decrement')
   const countDisplay = screen.getByTestId('count')

   // First increment to 1
   act(() => {
    incrementButton.click()
   })

   expect(countDisplay).toHaveTextContent('Count: 1')

   // Then decrement back to 0
   act(() => {
    decrementButton.click()
   })

   expect(countDisplay).toHaveTextContent('Count: 0')
  })

  it('prevents count from going below 0', () => {
   render(
    <ValidationProvider>
     <TestComponent />
    </ValidationProvider>
   )

   const decrementButton = screen.getByTestId('decrement')
   const countDisplay = screen.getByTestId('count')

   // Try to decrement from 0
   act(() => {
    decrementButton.click()
   })

   expect(countDisplay).toHaveTextContent('Count: 0')
  })

  it('handles multiple increments and decrements', () => {
   render(
    <ValidationProvider>
     <TestComponent />
    </ValidationProvider>
   )

   const incrementButton = screen.getByTestId('increment')
   const decrementButton = screen.getByTestId('decrement')
   const countDisplay = screen.getByTestId('count')

   // Increment multiple times
   act(() => {
    incrementButton.click()
    incrementButton.click()
    incrementButton.click()
   })

   expect(countDisplay).toHaveTextContent('Count: 3')

   // Decrement multiple times
   act(() => {
    decrementButton.click()
    decrementButton.click()
   })

   expect(countDisplay).toHaveTextContent('Count: 1')
  })
 })

 describe('Context isolation', () => {
  it('maintains separate state for different provider instances', () => {
   const { rerender } = render(
    <ValidationProvider>
     <TestComponent />
    </ValidationProvider>
   )

   const incrementButton = screen.getByTestId('increment')
   const countDisplay = screen.getByTestId('count')

   // Increment in first instance
   act(() => {
    incrementButton.click()
   })

   expect(countDisplay).toHaveTextContent('Count: 1')

   // Render new provider instance
   rerender(
    <ValidationProvider>
     <TestComponent />
    </ValidationProvider>
   )

   // Should reset to 0
   expect(screen.getByTestId('count')).toHaveTextContent('Count: 0')
  })
 })

 describe('Error handling', () => {
  it('throws error when used outside provider', () => {
   // Suppress console.error for this test
   const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { })

   expect(() => {
    render(<TestComponent />)
   }).toThrow('useValidation must be used within a ValidationProvider')

   consoleSpy.mockRestore()
  })
 })
})
