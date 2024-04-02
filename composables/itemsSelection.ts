export const useItemsSelection = () => useState<Array<string>>('items-selection', () => [])
export const useItemsDragging = () => useState<boolean>('items-dragging', () => false)
export const useHiddenItems = () => useState<Array<string>>('hidden-items', () => [])
