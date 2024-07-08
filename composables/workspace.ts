import type Workspace from "~/types/api/Workspace";
import type CurrentFolder from "~/types/CurrentFolder";
import type Folder from "~/types/api/Folder";
import type File from "~/types/api/File";
import type StorageItem from "~/types/api/StorageItem";

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
