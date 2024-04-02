import type View from "~/types/View";

export const useView = () => useState<View>('view')
export const useRefreshView = () => useState<Function>('refresh-view')
