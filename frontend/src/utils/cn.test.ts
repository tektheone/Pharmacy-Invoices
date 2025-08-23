import { describe, it, expect } from 'vitest'
import { cn } from './cn'

describe('cn utility function', () => {
  it('should combine class names correctly', () => {
    const result = cn('class1', 'class2', 'class3')
    expect(result).toBe('class1 class2 class3')
  })

  it('should handle conditional classes', () => {
    const result = cn('base', true && 'conditional', false && 'hidden')
    expect(result).toBe('base conditional')
  })

  it('should filter out falsy values', () => {
    const result = cn('base', '', null, undefined, false, 'valid')
    expect(result).toBe('base valid')
  })

  it('should handle empty input', () => {
    const result = cn()
    expect(result).toBe('')
  })

  it('should handle single class', () => {
    const result = cn('single')
    expect(result).toBe('single')
  })
})
