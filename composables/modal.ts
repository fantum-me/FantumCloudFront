import type StorageItemSummary from "~/types/api/StorageItemSummary";

export const useRenameItemsModal = () => useState<(targetItem: StorageItemSummary) => void>('rename-items-modal')

export const useAccessControlsModal = () => useState<(targetItem: StorageItemSummary) => void>('access-controls-modal')
