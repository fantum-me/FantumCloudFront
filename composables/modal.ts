import type Folder from "~/types/filesystem/Folder";
import type StorageItem from "~/types/filesystem/StorageItem";

export const useRenameItemsModal = () => useState<(targetItem: StorageItem) => void>('rename-items-modal')

export const useAccessControlsModal = () => useState<(targetItem: StorageItem) => void>('access-controls-modal')

export const useNewFolderModal = () => useState<(target: Folder, open: boolean) => any>('new-folder-modal')

export const useNewDocumentModal = () => useState<(target: Folder, type: string, open: boolean) => any>('new-document-modal')
