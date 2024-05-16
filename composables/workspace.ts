import type Workspace from "~/types/api/Workspace";
import type CurrentFolder from "~/types/CurrentFolder";
import type Folder from "~/types/api/Folder";
import type StorageItem from "~/types/api/StorageItem";

export const useWorkspace = () => useState<Workspace>('workspace')
export const useSidebarOpen = () => useState<boolean>('sidebar-open', () => false)
export const useFolder = () => useState<CurrentFolder>('folder')
export const useItem = (id: string, item?: StorageItem) => useState<StorageItem>(`item-${id}`, item ? () => item : undefined)
