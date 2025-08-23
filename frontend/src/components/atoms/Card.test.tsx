import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './Card'

describe('Card Components', () => {
 describe('Card', () => {
  it('renders with default props', () => {
   render(<Card>Card content</Card>)
   const card = screen.getByText('Card content')
   expect(card).toBeInTheDocument()
   expect(card.parentElement).toHaveClass('rounded-lg', 'border', 'bg-card', 'text-card-foreground', 'shadow-sm')
  })

  it('applies custom className', () => {
   render(<Card className="custom-card">Custom Card</Card>)
   const card = screen.getByText('Custom Card').parentElement
   expect(card).toHaveClass('custom-card')
  })
 })

 describe('CardHeader', () => {
  it('renders with default props', () => {
   render(<CardHeader>Header content</CardHeader>)
   const header = screen.getByText('Header content')
   expect(header).toBeInTheDocument()
   expect(header).toHaveClass('flex', 'flex-col', 'space-y-1.5', 'p-6')
  })

  it('applies custom className', () => {
   render(<CardHeader className="custom-header">Custom Header</CardHeader>)
   const header = screen.getByText('Custom Header')
   expect(header).toHaveClass('custom-header')
  })
 })

 describe('CardTitle', () => {
  it('renders with default props', () => {
   render(<CardTitle>Card Title</CardTitle>)
   const title = screen.getByText('Card Title')
   expect(title).toBeInTheDocument()
   expect(title).toHaveClass('text-2xl', 'font-semibold', 'leading-none', 'tracking-tight')
  })

  it('applies custom className', () => {
   render(<CardTitle className="custom-title">Custom Title</CardTitle>)
   const title = screen.getByText('Custom Title')
   expect(title).toHaveClass('custom-title')
  })
 })

 describe('CardDescription', () => {
  it('renders with default props', () => {
   render(<CardDescription>Card description</CardDescription>)
   const description = screen.getByText('Card description')
   expect(description).toBeInTheDocument()
   expect(description).toHaveClass('text-sm', 'text-muted-foreground')
  })

  it('applies custom className', () => {
   render(<CardDescription className="custom-description">Custom Description</CardDescription>)
   const description = screen.getByText('Custom Description')
   expect(description).toHaveClass('custom-description')
  })
 })

 describe('CardContent', () => {
  it('renders with default props', () => {
   render(<CardContent>Content here</CardContent>)
   const content = screen.getByText('Content here')
   expect(content).toBeInTheDocument()
   expect(content).toHaveClass('p-6', 'pt-0')
  })

  it('applies custom className', () => {
   render(<CardContent className="custom-content">Custom Content</CardContent>)
   const content = screen.getByText('Custom Content')
   expect(content).toHaveClass('custom-content')
  })
 })

 describe('Card Composition', () => {
  it('renders complete card structure', () => {
   render(
    <Card>
     <CardHeader>
      <CardTitle>Test Title</CardTitle>
      <CardDescription>Test Description</CardDescription>
     </CardHeader>
     <CardContent>
      <p>Test content</p>
     </CardContent>
    </Card>
   )

   expect(screen.getByText('Test Title')).toBeInTheDocument()
   expect(screen.getByText('Test Description')).toBeInTheDocument()
   expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('maintains proper nesting structure', () => {
   const { container } = render(
    <Card>
     <CardHeader>
      <CardTitle>Title</CardTitle>
     </CardHeader>
     <CardContent>Content</CardContent>
    </Card>
   )

   const card = container.firstChild
   const header = card?.firstChild
   const content = card?.lastChild

   expect(header).toHaveClass('flex', 'flex-col', 'space-y-1.5', 'p-6')
   expect(content).toHaveClass('p-6', 'pt-0')
  })
 })
})
