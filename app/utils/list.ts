export type Identifiable = { readonly id: string }
export type MoveDirection = -1 | 1

export function replaceById<T extends Identifiable>(items: readonly T[], next: T): T[] {
  return items.map((item) => (item.id === next.id ? next : item))
}

export function removeById<T extends Identifiable>(items: readonly T[], id: string): T[] {
  return items.filter((item) => item.id !== id)
}

/**
 * Swaps an item with its nearest neighbour in `direction`, skipping items outside its group
 * (e.g. moving a "pro" only past other "pros").
 */
export function moveById<T extends Identifiable>(
  items: readonly T[],
  id: string,
  direction: MoveDirection,
  sameGroup: (a: T, b: T) => boolean = () => true
): T[] {
  const from = items.findIndex((item) => item.id === id)
  const current = items[from]
  if (!current) return [...items]

  let to = from + direction
  while (to >= 0 && to < items.length && !sameGroup(items[to]!, current)) to += direction
  const target = items[to]
  if (!target) return [...items]

  const next = [...items]
  next[from] = target
  next[to] = current
  return next
}

/** Loops over a non-empty constant list, e.g. alternating card tilts. */
export function cycleAt<T>(values: readonly [T, ...T[]], index: number): T {
  return values[index % values.length]!
}

export function createId(): string {
  return crypto.randomUUID()
}
