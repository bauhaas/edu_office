import type { ItemOf, ListSection } from '#shared/types/job'

/**
 * Immutable item operations for any section holding `items`.
 * Each operation emits a full new section through `update`.
 */
export function useListSection<S extends ListSection>(
  section: () => S,
  update: (next: S) => void,
  sameGroup?: (a: ItemOf<S>, b: ItemOf<S>) => boolean
) {
  const commit = (items: ItemOf<S>[]): void => update({ ...section(), items })
  const items = (): readonly ItemOf<S>[] => section().items

  return {
    updateItem: (item: ItemOf<S>) => commit(replaceById(items(), item)),
    patchItem: (item: ItemOf<S>, changes: Partial<Omit<ItemOf<S>, 'id'>>) =>
      commit(replaceById(items(), { ...item, ...changes } as ItemOf<S>)),
    removeItem: (id: string) => commit(removeById(items(), id)),
    moveItem: (id: string, direction: MoveDirection) => commit(moveById(items(), id, direction, sameGroup)),
    addItem: (item: ItemOf<S>) => commit([...items(), item])
  }
}
