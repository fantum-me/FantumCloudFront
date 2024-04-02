import type Workspace from "~/types/api/Workspace";
import type CurrentFolder from "~/types/CurrentFolder";

export const useWorkspace = () => useState<Workspace>('workspace')
export const useSidebarOpen = () => useState<boolean>('sidebar-open', () => false)
export const useFolder = () => useState<CurrentFolder>('folder')
