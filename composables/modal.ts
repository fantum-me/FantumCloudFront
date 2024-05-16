import type StorageItem from "~/types/api/StorageItem";

export const useRenameItemsModal = () => useState<(targetItem: StorageItem) => void>('rename-items-modal')

export const useAccessControlsModal = () => useState<(targetItem: StorageItem) => void>('access-controls-modal')
