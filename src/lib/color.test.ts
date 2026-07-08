import { describe, it, expect } from 'vitest'
import { shade } from './color'

describe('shade', () => {
  it('gibt für Index 0 wieder (näherungsweise) die Basisfarbe zurück', () => {
    expect(shade('#22c55e', 0).toLowerCase()).toBe('#22c55e')
  })

  it('gibt für unterschiedliche Indizes unterschiedliche Farben zurück', () => {
    const a = shade('#22c55e', 1)
    const b = shade('#22c55e', 2)
    const base = shade('#22c55e', 0)
    expect(a).not.toBe(base)
    expect(b).not.toBe(base)
    expect(a).not.toBe(b)
  })

  it('gibt immer einen gültigen Hex-Code zurück', () => {
    for (let i = 0; i < 8; i++) {
      expect(shade('#ef4444', i)).toMatch(/^#[0-9a-f]{6}$/i)
    }
  })
})
