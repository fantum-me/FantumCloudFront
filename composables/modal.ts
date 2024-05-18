import type Folder from "~/types/api/Folder";
import type StorageItem from "~/types/api/StorageItem";

export const useRenameItemsModal = () => useState<(targetItem: StorageItem) => void>('rename-items-modal')

export const useAccessControlsModal = () => useState<(targetItem: StorageItem) => void>('access-controls-modal')

export const useNewFolderModal = () => useState<(target: Folder) => any>('new-folder-modal')

export const useNewDocumentModal = () => useState<(target: Folder, type: string) => any>('new-document-modal')
