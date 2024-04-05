export const useItemsSelection = () => useState<Array<string>>('items-selection', () => [])
export const useItemsDragging = () => useState<boolean>('items-dragging', () => false)
export const useLoadingItems = () => useState<Array<string>>('loading-items', () => [])
