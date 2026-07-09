// Reine Sortier-Logik fürs Drag & Drop. Verschiebt das Element mit `fromId`
// direkt VOR das Element mit `toId`. Reihenfolge aller anderen bleibt erhalten.

export function moveBefore<T extends { id: string }>(
  list: T[],
  fromId: string,
  toId: string,
): T[] {
  if (fromId === toId) return list
  const fromIndex = list.findIndex((item) => item.id === fromId)
  const toIndex = list.findIndex((item) => item.id === toId)
  if (fromIndex === -1 || toIndex === -1) return list

  const copy = [...list]
  const [moved] = copy.splice(fromIndex, 1)
  // Zielposition NACH dem Entfernen neu bestimmen.
  const insertAt = copy.findIndex((item) => item.id === toId)
  copy.splice(insertAt, 0, moved)
  return copy
}
