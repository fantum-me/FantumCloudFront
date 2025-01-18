import type Workspace from "~/types/Workspace";
import type CurrentFolder from "~/types/filesystem/CurrentFolder";
import type Folder from "~/types/filesystem/Folder";
import type File from "~/types/filesystem/File";
import type StorageItem from "~/types/filesystem/StorageItem";

export const useWorkspace = () => useState<Workspace>('workspace')
export const useSidebarOpen = () => useState<boolean>('sidebar-open', () => false)
export const useFolder = () => useState<CurrentFolder>('folder')

export const useSidebarExplorerFiles = () => useState<Folder>('sidebar-explorer-files')
export const useItem = (id: string, item?: StorageItem) => useState<StorageItem>(`item-${id}`, item ? () => item : undefined)
export const useImageViewer = () => useState<(target: File, arrows: boolean) => any>('image-viewer')
export const useDetailsPanel = () => {
    const cookie = useCookie<boolean|undefined>('details-panel')
    if (cookie.value === undefined) cookie.value = true
    return cookie
}
