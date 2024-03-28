import type Session from "~/types/api/Session";
import type Workspace from "~/types/api/Workspace";
import type CurrentFolder from "~/types/CurrentFolder";
import type View from "~/lib/View";
import type Role from "~/types/api/Role";

export const useView = () => useState<View>('view')
export const useRefreshView = () => useState<Function>('refresh-view')
export const useSession = () => useState<Session>('session')
export const useWorkspace = () => useState<Workspace>('workspace')
export const useSidebarOpen = () => useState<boolean>('sidebar-open', () => false)
export const useFolder = () => useState<CurrentFolder>('folder')

export const useItemsContextMenu = () => useState<{open: Function, close: Function}>('items-context-menu')
export const useFolderContextMenu = () => useState<{open: Function, close: Function}>('folder-context-menu')

export const useItemsSelection = () => useState<Array<string>>('items-selection', () => [])
export const useItemsDragging = () => useState<boolean>('items-dragging', () => false)
export const useHiddenItems = () => useState<Array<string>>('hidden-items', () => [])

export const useSelectedRole = () => useState<Role>('selected-role')
