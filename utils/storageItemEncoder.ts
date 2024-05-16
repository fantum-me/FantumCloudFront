import type StorageItem from "~/types/api/StorageItem";

export const encodeStorageItem = (item: StorageItem): string => btoa(JSON.stringify(item))

export const decodeStorageItem = (encodedItem: string): StorageItem => JSON.parse(atob(encodedItem))
