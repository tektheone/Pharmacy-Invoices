# Atomic Design Implementation Guide

## Overview
This document outlines the Atomic Design implementation for the Pharmacy Invoice Validation System frontend. We follow Brad Frost's Atomic Design methodology to create a scalable, maintainable component library.

## Atomic Design Hierarchy

### 1. **Atoms** - Basic Building Blocks
The smallest, most fundamental components that cannot be broken down further.

#### **Button Atoms**
```typescript
// Primary button
<Button variant="primary" size="md">Upload File</Button>

// Secondary button
<Button variant="secondary" size="sm">Cancel</Button>

// Danger button
<Button variant="danger" size="lg">Delete</Button>
```

#### **Input Atoms**
```typescript
// Text input
<Input type="text" placeholder="Search drugs..." />

// File input
<Input type="file" accept=".xlsx,.xls" />

// Number input
<Input type="number" min="0" step="0.01" />
```

#### **Other Atoms**
- **Label**: Form labels and text
- **Icon**: SVG icons with consistent sizing
- **Badge**: Status indicators and tags
- **Spinner**: Loading indicators

### 2. **Molecules** - Simple Combinations
Components composed of multiple atoms that work together as a unit.

#### **SearchInput Molecule**
```typescript
<SearchInput 
  placeholder="Search validation history..."
  onSearch={handleSearch}
  clearable
/>
```

#### **FormField Molecule**
```typescript
<FormField
  label="Drug Name"
  required
  error="Drug name is required"
>
  <Input type="text" placeholder="Enter drug name" />
</FormField>
```

#### **StatusBadge Molecule**
```typescript
<StatusBadge 
  status="discrepancy" 
  severity="high"
  text="Unit Price Overcharge"
/>
```

### 3. **Organisms** - Complex UI Sections
Larger components composed of molecules and atoms that form distinct sections.

#### **FileUpload Organism**
```typescript
<FileUpload
  accept=".xlsx,.xls"
  maxSize={100 * 1024 * 1024}
  onUpload={handleFileUpload}
  onError={handleUploadError}
/>
```

#### **ValidationForm Organism**
```typescript
<ValidationForm
  onSubmit={handleValidation}
  onCancel={handleCancel}
  loading={isValidating}
/>
```

#### **DiscrepancyCard Organism**
```typescript
<DiscrepancyCard
  discrepancy={discrepancyData}
  onViewDetails={handleViewDetails}
  onExport={handleExport}
/>
```

### 4. **Templates** - Page Layouts
Page-level layouts that arrange organisms to form the structure of a page.

#### **DashboardLayout Template**
```typescript
<DashboardLayout>
  <Header />
  <Sidebar />
  <MainContent>
    <DiscrepancySummary />
    <RecentValidations />
    <QuickActions />
  </MainContent>
  <Footer />
</DashboardLayout>
```

#### **ValidationLayout Template**
```typescript
<ValidationLayout>
  <Header />
  <MainContent>
    <FileUpload />
    <ValidationProgress />
    <ResultsDisplay />
  </MainContent>
</ValidationLayout>
```

### 5. **Pages** - Complete Pages
Complete pages that use templates and organisms to create the final user experience.

#### **Dashboard Page**
```typescript
const Dashboard = () => {
  return (
    <DashboardLayout>
      <DiscrepancySummary />
      <RecentValidations />
      <QuickActions />
    </DashboardLayout>
  );
};
```

## Component Implementation Guidelines

### **Props Interface**
```typescript
// Consistent prop naming across atomic levels
interface BaseComponentProps {
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  error?: string;
}

interface ButtonProps extends BaseComponentProps {
  variant: 'primary' | 'secondary' | 'danger' | 'ghost';
  size: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
}
```

### **Theme Integration**
```typescript
// All components support theme variants
const Button = ({ variant, size, children, ...props }: ButtonProps) => {
  const { theme } = useTheme();
  
  return (
    <button 
      className={cn(
        buttonVariants({ variant, size }),
        theme === 'dark' && 'dark:bg-slate-800'
      )}
      {...props}
    >
      {children}
    </button>
  );
};
```

### **Composition Pattern**
```typescript
// Build complex components from simpler ones
const FileUpload = ({ children, ...props }: FileUploadProps) => {
  return (
    <div className="file-upload-container">
      <Input type="file" {...props} />
      <Label>Drag and drop files here</Label>
      {children}
    </div>
  );
};
```

## File Organization

### **Component Structure**
```
frontend/src/components/
├── atoms/                    # Basic building blocks
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx
│   │   ├── Button.stories.tsx
│   │   └── index.ts
│   ├── Input/
│   ├── Label/
│   └── index.ts
├── molecules/                # Simple combinations
│   ├── SearchInput/
│   ├── FormField/
│   └── index.ts
├── organisms/                # Complex combinations
│   ├── FileUpload/
│   ├── ValidationForm/
│   └── index.ts
├── templates/                # Page layouts
│   ├── DashboardLayout/
│   ├── ValidationLayout/
│   └── index.ts
└── pages/                    # Complete pages
    ├── Dashboard/
    ├── Validation/
    └── index.ts
```

### **Index Files**
```typescript
// atoms/index.ts
export { Button } from './Button';
export { Input } from './Input';
export { Label } from './Label';
export { Icon } from './Icon';
export { Badge } from './Badge';
export { Spinner } from './Spinner';

// molecules/index.ts
export { SearchInput } from './SearchInput';
export { FormField } from './FormField';
export { StatusBadge } from './StatusBadge';
export { LoadingState } from './LoadingState';
export { ErrorMessage } from './ErrorMessage';
```

## Development Workflow

### **1. Start with Atoms**
- Build basic components first
- Ensure they're highly reusable
- Test in isolation

### **2. Compose Molecules**
- Combine atoms to create simple patterns
- Focus on single responsibility
- Maintain consistent prop interfaces

### **3. Build Organisms**
- Create complex UI sections
- Use molecules and atoms as building blocks
- Handle business logic and state

### **4. Design Templates**
- Create page layouts
- Arrange organisms logically
- Ensure responsive design

### **5. Implement Pages**
- Use templates and organisms
- Handle page-level state
- Connect to business logic

## Benefits of Atomic Design

### **Maintainability**
- **Clear hierarchy** makes code easier to understand
- **Reusable components** reduce duplication
- **Consistent patterns** improve developer experience

### **Scalability**
- **Easy to add new components** following established patterns
- **Component library** grows organically
- **Design system** maintains consistency

### **Testing**
- **Test atoms in isolation** for reliability
- **Test molecules for integration** between atoms
- **Test organisms for complex behavior**

### **Collaboration**
- **Designers and developers** speak the same language
- **Component documentation** improves communication
- **Consistent patterns** reduce confusion

## Theme Integration

### **CSS Variables**
```css
/* atoms/Button/Button.module.css */
.button {
  background-color: var(--color-primary);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  transition: all 0.3s ease;
}

.button:hover {
  background-color: var(--color-primary-hover);
}
```

### **Theme Context**
```typescript
// All components use theme context
const { theme, toggleTheme } = useTheme();

// Components automatically adapt to theme changes
<Button variant="primary">Theme-aware Button</Button>
```

## Performance Considerations

### **Component Optimization**
- **React.memo** for expensive components
- **useMemo** for expensive calculations
- **useCallback** for stable function references

### **Bundle Optimization**
- **Tree shaking** for unused components
- **Code splitting** by atomic level
- **Lazy loading** for large organisms

## Best Practices

### **Do's**
✅ **Follow the hierarchy** strictly (Atoms → Molecules → Organisms → Templates → Pages)  
✅ **Keep atoms simple** and focused on single responsibility  
✅ **Use consistent prop interfaces** across atomic levels  
✅ **Test components in isolation** before composition  
✅ **Document component usage** with examples  

### **Don'ts**
❌ **Skip atomic levels** (don't build organisms before molecules)  
❌ **Mix concerns** between atomic levels  
❌ **Create overly complex atoms** that should be molecules  
❌ **Duplicate functionality** across different atomic levels  
❌ **Ignore theme integration** in any component  

## Example Implementation

### **Building a Validation Form**
```typescript
// 1. Start with atoms
<Input type="text" placeholder="Drug name" />
<Button variant="primary">Validate</Button>

// 2. Create molecules
<FormField label="Drug Name" required>
  <Input type="text" placeholder="Drug name" />
</FormField>

// 3. Build organisms
<ValidationForm onSubmit={handleSubmit}>
  <FormField label="Drug Name" required>
    <Input type="text" placeholder="Drug name" />
  </FormField>
  <Button variant="primary">Validate</Button>
</ValidationForm>

// 4. Use in templates and pages
<ValidationLayout>
  <ValidationForm onSubmit={handleSubmit} />
</ValidationLayout>
```

This Atomic Design approach ensures our Pharmacy Invoice application has a **scalable, maintainable, and consistent** component library that grows with the project!
