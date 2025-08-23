import { describe, it, expect } from 'vitest'

describe('Basic Integration Tests', () => {
  it('should have proper environment setup', () => {
    expect(process.env.NODE_ENV).toBe('test')
    expect(typeof window).toBe('object')
    expect(typeof document).toBe('object')
  })

  it('should support basic DOM operations', () => {
    const div = document.createElement('div')
    div.textContent = 'Test'
    document.body.appendChild(div)
    
    expect(document.body.contains(div)).toBe(true)
    expect(div.textContent).toBe('Test')
    
    document.body.removeChild(div)
  })

  it('should support fetch mocking', () => {
    expect(typeof fetch).toBe('function')
    expect(fetch).toBeDefined()
  })

  it('should support console methods', () => {
    expect(typeof console.log).toBe('function')
    expect(typeof console.error).toBe('function')
    expect(typeof console.warn).toBe('function')
  })
})
