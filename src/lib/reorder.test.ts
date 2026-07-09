import { describe, it, expect } from 'vitest'
import { moveBefore } from './reorder'

const list = [{ id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'd' }]
const ids = (l: { id: string }[]) => l.map((x) => x.id).join('')

describe('moveBefore', () => {
  it('verschiebt ein Element nach vorne (vor das Ziel)', () => {
    expect(ids(moveBefore(list, 'd', 'b'))).toBe('adbc')
  })

  it('verschiebt ein Element nach hinten (vor das Ziel)', () => {
    expect(ids(moveBefore(list, 'a', 'd'))).toBe('bcad')
  })

  it('lässt die Liste unverändert, wenn from === to', () => {
    expect(ids(moveBefore(list, 'b', 'b'))).toBe('abcd')
  })

  it('lässt die Liste unverändert bei unbekannter id', () => {
    expect(ids(moveBefore(list, 'x', 'b'))).toBe('abcd')
  })
})
