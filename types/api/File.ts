import type StorageItem from "~/types/api/StorageItem";

export default interface File extends StorageItem {
    ext: string,
    type: string,
    has_preview: boolean
}
