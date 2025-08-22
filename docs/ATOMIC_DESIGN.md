# Atomic Design Implementation Guide

This document outlines the Atomic Design implementation for the Pharmacy Invoice Validation System frontend. We follow Brad Frost's Atomic Design methodology to create a scalable, maintainable component library.

## Overview

Atomic Design breaks down interfaces into fundamental building blocks that work together and nest within one another. This approach provides a clear methodology for crafting scalable design systems.

## Atomic Design Levels

### 1. **Atoms** - Basic Building Blocks
The smallest functional units that can't be broken down further.

**Examples**:
- Buttons
- Inputs
- Labels
- Icons
- Typography

**Implementation**:
```tsx
// atoms/Button.tsx
export function Button({ children, variant, ...props }) {
  return (
    <button className={cn(buttonVariants({ variant }))} {...props}>
      {children}
    </button>
  )
}
```

### 2. **Molecules** - Simple Combinations
Simple groups of UI elements functioning together as a unit.

**Examples**:
- Search bar (input + button)
- Form field (label + input + error)
- Navigation item (icon + text + link)

**Implementation**:
```tsx
// molecules/SearchBar.tsx
export function SearchBar({ onSearch, placeholder }) {
  const [query, setQuery] = useState('')
  
  return (
    <div className="flex space-x-2">
      <Input 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
      />
      <Button onClick={() => onSearch(query)}>
        Search
      </Button>
    </div>
  )
}
```

### 3. **Organisms** - Complex UI Components
Relatively complex components composed of groups of molecules and/or atoms.

**Examples**:
- Header (logo + navigation + user menu)
- Form (multiple form fields + submit button)
- Data table (headers + rows + pagination)

**Implementation**:
```tsx
// organisms/Header.tsx
export function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Logo />
          <Navigation />
          <UserMenu />
        </div>
      </div>
    </header>
  )
}
```

### 4. **Templates** - Page Layouts
Page-level objects that place components into a layout and articulate the design's underlying content structure.

**Examples**:
- Dashboard layout
- Form page layout
- List page layout

**Implementation**:
```tsx
// templates/DashboardLayout.tsx
export function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-8">
          <aside className="col-span-3">
            <Sidebar />
          </aside>
          <main className="col-span-9">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
```

### 5. **Pages** - Specific Instances
Specific instances of templates that show what a UI looks like with real representative content.

**Examples**:
- Home page
- Validation page
- History page

**Implementation**:
```tsx
// pages/HomePage.tsx
export function HomePage() {
  return (
    <DashboardLayout>
      <HeroSection />
      <QuickActions />
      <FeaturesSection />
    </DashboardLayout>
  )
}
```

## Component Structure

```
src/
├── components/
│   ├── atoms/
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.test.tsx
│   │   │   └── index.ts
│   │   ├── Input/
│   │   ├── Card/
│   │   └── index.ts
│   ├── molecules/
│   │   ├── SearchBar/
│   │   ├── FormField/
│   │   └── index.ts
│   ├── organisms/
│   │   ├── Header/
│   │   ├── Sidebar/
│   │   └── index.ts
│   ├── templates/
│   │   ├── DashboardLayout/
│   │   ├── FormLayout/
│   │   └── index.ts
│   └── pages/
│       ├── HomePage/
│       ├── ValidationPage/
│       └── index.ts
```

## Component Guidelines

### **Naming Conventions**
- Use PascalCase for component names
- Use descriptive, semantic names
- Avoid abbreviations unless universally understood

### **Props Interface**
```tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  children: React.ReactNode
  onClick?: () => void
}
```

### **Default Props**
```tsx
const Button = ({ 
  variant = 'primary', 
  size = 'md', 
  disabled = false,
  children,
  onClick 
}: ButtonProps) => {
  // Component implementation
}
```

### **CSS Classes**
- Use Tailwind CSS utility classes
- Follow consistent spacing and sizing scales
- Use CSS custom properties for design tokens
- Maintain responsive design principles

### **State Management**
- Keep components as stateless as possible
- Use React hooks for local state
- Lift state up when needed for sharing
- Use context for global state sparingly

## Responsive Design

### **Mobile-First Approach**
```tsx
// Start with mobile styles, then enhance for larger screens
<div className="p-4 md:p-6 lg:p-8">
  <h1 className="text-2xl md:text-3xl lg:text-4xl">
    Title
  </h1>
</div>
```

### **Breakpoint Strategy**
- **sm**: 640px+ (small tablets)
- **md**: 768px+ (tablets)
- **lg**: 1024px+ (desktops)
- **xl**: 1280px+ (large desktops)

## Accessibility

### **Semantic HTML**
```tsx
// Use proper semantic elements
<button aria-label="Close dialog">
  <XIcon />
</button>

<form role="search">
  <input type="search" aria-label="Search validations" />
</form>
```

### **ARIA Labels**
- Provide descriptive labels for interactive elements
- Use aria-describedby for additional context
- Implement proper focus management

### **Keyboard Navigation**
- Ensure all interactive elements are keyboard accessible
- Implement logical tab order
- Provide visible focus indicators

## Testing Strategy

### **Unit Tests**
```tsx
// Button.test.tsx
describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })
  
  it('calls onClick when clicked', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    fireEvent.click(screen.getByText('Click me'))
    expect(handleClick).toHaveBeenCalled()
  })
})
```

### **Integration Tests**
- Test component interactions
- Verify prop passing
- Test error states and edge cases

## Performance Considerations

### **Code Splitting**
```tsx
// Lazy load pages for better performance
const ValidationPage = lazy(() => import('./ValidationPage'))

// Use Suspense for loading states
<Suspense fallback={<LoadingSpinner />}>
  <ValidationPage />
</Suspense>
```

### **Memoization**
```tsx
// Memoize expensive components
const ExpensiveComponent = memo(({ data }) => {
  // Heavy computation
  return <div>{processedData}</div>
})
```

### **Bundle Optimization**
- Tree shake unused components
- Use dynamic imports for large dependencies
- Optimize image and asset loading

## Best Practices

### **Do's**:
✅ **Use consistent naming conventions**
✅ **Keep components focused and single-purpose**
✅ **Implement proper error boundaries**
✅ **Write comprehensive tests**
✅ **Follow accessibility guidelines**
✅ **Use TypeScript for type safety**

### **Don'ts**:
❌ **Don't create overly complex components**
❌ **Don't ignore accessibility requirements**
❌ **Don't skip testing**
❌ **Don't use inline styles**
❌ **Don't create deeply nested component hierarchies**

## Component Library

### **Core Components**
- **Button**: Primary, secondary, outline variants
- **Input**: Text, number, select, textarea
- **Card**: Content containers with headers
- **Modal**: Overlay dialogs and forms
- **Table**: Data display with sorting and pagination

### **Form Components**
- **FormField**: Label, input, and error handling
- **FormGroup**: Multiple related form fields
- **ValidationMessage**: Error and success states

### **Layout Components**
- **Container**: Responsive content wrapper
- **Grid**: Flexible grid system
- **Spacer**: Consistent spacing utilities

### **Feedback Components**
- **Alert**: Success, warning, error messages
- **LoadingSpinner**: Loading states
- **ProgressBar**: Progress indicators

## Implementation Checklist

### **For Each Component**:
- [ ] **Create component file** with proper structure
- [ ] **Define TypeScript interface** for props
- [ ] **Implement responsive design** with Tailwind
- [ ] **Add accessibility features** (ARIA, keyboard)
- [ ] **Write unit tests** with good coverage
- [ ] **Add to component index** for easy importing
- [ ] **Document usage examples** and props
- [ ] **Test in different browsers** and devices

### **For Each Level**:
- [ ] **Atoms**: Basic, reusable UI elements
- [ ] **Molecules**: Simple component combinations
- [ ] **Organisms**: Complex UI sections
- [ ] **Templates**: Page layout structures
- [ ] **Pages**: Complete page implementations

## Conclusion

Following Atomic Design principles ensures:
- **Consistency** across the application
- **Reusability** of components
- **Maintainability** of the codebase
- **Scalability** for future features
- **Quality** through systematic approach

Remember: **Start simple, iterate, and maintain consistency** throughout the development process.
