import type StorageItemSummary from "~/types/api/StorageItemSummary";

export const encodeSummary = (summary: StorageItemSummary): string => btoa(JSON.stringify(summary))

export const decodeSummary = (summary: string): StorageItemSummary => JSON.parse(atob(summary))
