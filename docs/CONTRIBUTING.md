# Contributing Guidelines

## Overview
This document outlines the contribution guidelines for the Pharmacy Invoice Validation System. We follow a strict phase-based development approach to ensure quality and avoid over-engineering.

## Development Philosophy

### 🎯 **Phase-Based Development**
- **Follow the implementation plan strictly**
- **Complete each phase before moving to the next**
- **No scope creep or premature optimization**
- **Focus on delivering planned features only**

### 🚫 **Avoid Over-Engineering**
- **Implement only what's planned for each phase**
- **Don't add features not in the current phase**
- **Keep solutions simple and focused**
- **Resist the urge to "improve" things prematurely**

## Development Workflow

### 1. **Phase Completion**
- Complete all deliverables for the current phase
- Test functionality thoroughly
- Ensure no breaking changes
- Update documentation if needed

### 2. **Commit & Push**
- Use conventional commit messages
- Commit after each phase completion
- Push to GitHub with descriptive messages
- Tag commits with phase numbers

### 3. **Phase Review**
- Review completed work
- Ensure all phase requirements are met
- Plan next phase implementation
- Update progress tracking

## Commit Message Convention

### **Format**
```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### **Types**
- **`feat`**: New feature (use for phase completions)
- **`fix`**: Bug fix
- **`docs`**: Documentation changes
- **`style`**: Code style changes (formatting, etc.)
- **`refactor`**: Code refactoring
- **`test`**: Adding or updating tests
- **`chore`**: Maintenance tasks

### **Examples**
```bash
# Phase completion
feat: implement project foundation and structure

# Bug fix
fix: resolve database connection timeout

# Documentation
docs: update API documentation

# Code quality
style: format code with prettier
```

## Phase Commit Messages

### **Phase 1**: `feat: initialize project foundation and structure`
### **Phase 2**: `feat: implement database schema and core infrastructure`
### **Phase 3**: `feat: implement backend API server and core services`
### **Phase 4**: `feat: implement core validation engine and discrepancy detection`
### **Phase 5**: `feat: implement frontend with theme system and core components`
### **Phase 6**: `feat: implement dashboard and validation results display`
### **Phase 7**: `feat: implement export system and performance optimizations`
### **Phase 8**: `feat: implement comprehensive testing suite and code quality`
### **Phase 9**: `feat: implement deployment pipeline and Azure infrastructure`
### **Phase 10**: `feat: complete documentation and final polish`

## Code Quality Standards

### **Atomic Design Implementation**
- **Follow Atomic Design hierarchy**: Atoms → Molecules → Organisms → Templates → Pages
- **Atoms**: Single responsibility, highly reusable (Button, Input, Label, Icon, Badge, Spinner)
- **Molecules**: Simple combinations of atoms (SearchInput, FormField, StatusBadge)
- **Organisms**: Complex UI sections (FileUpload, ValidationForm, DiscrepancyCard)
- **Templates**: Page layouts with organisms (DashboardLayout, ValidationLayout)
- **Pages**: Complete pages using templates and organisms
- **Component composition**: Build complex components from simpler ones
- **Props interface**: Consistent prop naming and structure across atomic levels

### **TypeScript**
- **Strict mode enabled**
- **Proper type definitions**
- **No `any` types without justification**
- **Interface over type when possible**

### **Code Style**
- **ESLint rules enforced**
- **Prettier formatting**
- **Consistent naming conventions**
- **Proper error handling**

### **Testing**
- **Unit tests for business logic**
- **Integration tests for API endpoints**
- **Component tests for React components**
- **Minimum 80% code coverage**

## File Organization

### **Naming Conventions**
- **Components**: PascalCase (e.g., `FileUpload.tsx`)
- **Files**: camelCase (e.g., `validationService.ts`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_FILE_SIZE`)
- **CSS**: kebab-case (e.g., `globals.css`)

### **Import Organization**
```typescript
// 1. External libraries
import React from 'react';
import axios from 'axios';

// 2. Internal components
import { Button } from '@/components/ui/button';

// 3. Types and utilities
import { ValidationResult } from '@/types/validation';

// 4. Styles
import './styles.css';
```

## Pull Request Process

### **Before Submitting**
- [ ] All phase deliverables completed
- [ ] Tests passing locally
- [ ] Code linted and formatted
- [ ] Documentation updated
- [ ] No breaking changes introduced

### **PR Description Template**
```markdown
## Phase Completion
**Phase**: [Phase Number] - [Phase Name]

## Deliverables Completed
- [ ] [Deliverable 1]
- [ ] [Deliverable 2]
- [ ] [Deliverable 3]

## Testing
- [ ] Unit tests passing
- [ ] Integration tests passing
- [ ] Manual testing completed
- [ ] No breaking changes

## Changes Made
Brief description of what was implemented

## Screenshots (if applicable)
[Add screenshots for UI changes]
```

## Code Review Guidelines

### **Review Checklist**
- [ ] **Functionality**: Does it work as intended?
- [ ] **Code Quality**: Is the code clean and maintainable?
- [ ] **Testing**: Are there adequate tests?
- [ ] **Documentation**: Is documentation updated?
- [ ] **Performance**: Any obvious performance issues?
- [ ] **Security**: Any security concerns?

### **Review Comments**
- **Be constructive and specific**
- **Suggest improvements, don't just point out problems**
- **Use "we" language, not "you"**
- **Focus on the code, not the person**

## Branch Strategy

### **Main Branch**
- **`main`**: Production-ready code
- **Protected branch**: Requires PR approval
- **No direct commits**: All changes through PRs

### **Development Branches**
- **`develop`**: Integration branch for features
- **`feature/phase-X`**: Individual phase development
- **`hotfix/*`**: Critical bug fixes

### **Branch Naming**
```bash
# Feature branches
feature/phase-1-foundation
feature/phase-2-database
feature/phase-3-backend

# Hotfix branches
hotfix/database-connection
hotfix/validation-logic
```

## Testing Requirements

### **Before Each Commit**
- [ ] **Unit tests passing**
- [ ] **Integration tests passing**
- [ ] **Manual testing completed**
- [ ] **No console errors**
- [ ] **No TypeScript errors**

### **Test Coverage**
- **Backend**: 90%+ coverage
- **Frontend**: 80%+ coverage
- **Critical paths**: 100% coverage

## Documentation Requirements

### **Code Documentation**
- **JSDoc comments** for public functions
- **README updates** for new features
- **API documentation** for new endpoints
- **Type definitions** for new interfaces

### **User Documentation**
- **Setup instructions** updated
- **Feature documentation** added
- **Screenshots** for UI changes
- **Troubleshooting** guides updated

## Performance Guidelines

### **Frontend**
- **Lazy loading** for large components
- **Memoization** for expensive calculations
- **Bundle size** optimization
- **Image optimization**

### **Backend**
- **Database query** optimization
- **Caching** strategies
- **Rate limiting** implementation
- **Memory management**

## Security Guidelines

### **Input Validation**
- **Zod schemas** for all inputs
- **File type validation**
- **Size limits** enforcement
- **SQL injection** prevention

### **Authentication & Authorization**
- **Single user app** (no auth needed)
- **Input sanitization**
- **Error message** security
- **Logging** without sensitive data

## Getting Help

### **When Stuck**
1. **Check documentation** first
2. **Review implementation plan**
3. **Ask specific questions**
4. **Provide context and code examples**

### **Communication Channels**
- **GitHub Issues** for bugs and features
- **GitHub Discussions** for questions
- **Code review** for feedback
- **Documentation** for guidance

## Success Metrics

### **Phase Completion**
- **All deliverables** completed
- **Tests passing** consistently
- **Code quality** maintained
- **Documentation** updated

### **Overall Project**
- **On-time delivery** of phases
- **High code quality** maintained
- **Comprehensive testing** coverage
- **Clear documentation** available

---

**Remember**: Focus on completing each phase successfully before moving to the next. Quality over quantity, and always follow the implementation plan!
