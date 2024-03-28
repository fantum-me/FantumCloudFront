export const useWait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const isClientSide = () => typeof window !== "undefined"

export const unselectAll = () => isClientSide() ? document.getSelection()?.removeAllRanges() : {}

export const isAbsoluteUrl = (url: string): boolean => (/^https?:\/\//i).test(url)
