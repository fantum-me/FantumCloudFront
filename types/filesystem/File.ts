import type StorageItem from "~/types/filesystem/StorageItem";

export default interface File extends StorageItem {
    mime: string,
    has_preview: boolean,
    parent_id: string,

    // Image only
    width?: number,
    height?: number,
}
