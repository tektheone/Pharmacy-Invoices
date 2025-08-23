import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Input } from './Input'

describe('Input Component', () => {
 it('renders with default props', () => {
  render(<Input placeholder="Enter text" />)
  const input = screen.getByPlaceholderText('Enter text')
  expect(input).toBeInTheDocument()
  expect(input).toHaveClass('flex', 'h-10', 'w-full', 'rounded-md', 'border', 'border-input')
 })

 it('applies custom className', () => {
  render(<Input className="custom-input" placeholder="Custom" />)
  const input = screen.getByPlaceholderText('Custom')
  expect(input).toHaveClass('custom-input')
 })

 it('handles value changes', () => {
  const handleChange = vi.fn()
  render(<Input onChange={handleChange} placeholder="Test" />)

  const input = screen.getByPlaceholderText('Test')
  fireEvent.change(input, { target: { value: 'new value' } })

  expect(handleChange).toHaveBeenCalledTimes(1)
  expect(input).toHaveValue('new value')
 })

 it('can be disabled', () => {
  render(<Input disabled placeholder="Disabled" />)
  const input = screen.getByPlaceholderText('Disabled')
  expect(input).toBeDisabled()
 })

 it('can be read-only', () => {
  render(<Input readOnly placeholder="Read only" />)
  const input = screen.getByPlaceholderText('Read only')
  expect(input).toHaveAttribute('readonly')
 })

 it('forwards ref correctly', () => {
  const ref = vi.fn()
  render(<Input ref={ref} placeholder="Ref test" />)

  expect(ref).toHaveBeenCalled()
 })

 it('renders with different types', () => {
  const { rerender } = render(<Input type="text" placeholder="Text" />)
  expect(screen.getByPlaceholderText('Text')).toHaveAttribute('type', 'text')

  rerender(<Input type="email" placeholder="Email" />)
  expect(screen.getByPlaceholderText('Email')).toHaveAttribute('type', 'email')

  rerender(<Input type="password" placeholder="Password" />)
  expect(screen.getByPlaceholderText('Password')).toHaveAttribute('type', 'password')

  rerender(<Input type="number" placeholder="Number" />)
  expect(screen.getByPlaceholderText('Number')).toHaveAttribute('type', 'number')
 })

 it('handles focus and blur events', () => {
  const handleFocus = vi.fn()
  const handleBlur = vi.fn()

  render(
   <Input
    onFocus={handleFocus}
    onBlur={handleBlur}
    placeholder="Focus test"
   />
  )

  const input = screen.getByPlaceholderText('Focus test')

  fireEvent.focus(input)
  expect(handleFocus).toHaveBeenCalledTimes(1)

  fireEvent.blur(input)
  expect(handleBlur).toHaveBeenCalledTimes(1)
 })

 it('maintains accessibility attributes', () => {
  render(
   <Input
    id="test-input"
    name="testName"
    aria-label="Test input"
    aria-describedby="description"
    placeholder="Accessible"
   />
  )

  const input = screen.getByPlaceholderText('Accessible')
  expect(input).toHaveAttribute('id', 'test-input')
  expect(input).toHaveAttribute('name', 'testName')
  expect(input).toHaveAttribute('aria-label', 'Test input')
  expect(input).toHaveAttribute('aria-describedby', 'description')
 })

 it('handles controlled value', () => {
  const { rerender } = render(<Input value="initial" onChange={() => { }} placeholder="Controlled" />)
  const input = screen.getByPlaceholderText('Controlled')
  expect(input).toHaveValue('initial')

  rerender(<Input value="updated" onChange={() => { }} placeholder="Controlled" />)
  expect(input).toHaveValue('updated')
 })

 it('applies size variants correctly', () => {
  render(<Input size="sm" placeholder="Small" />)
  const input = screen.getByPlaceholderText('Small')
  expect(input).toHaveClass('h-9', 'px-3', 'text-sm')
 })
})
