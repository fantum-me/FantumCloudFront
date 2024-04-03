import type StorageItem from "~/types/api/StorageItem";

export default interface File extends StorageItem {
    ext: string,
    mime: string,
    has_preview: boolean,
    parent_id: string
}
