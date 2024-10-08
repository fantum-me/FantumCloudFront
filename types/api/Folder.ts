import type StorageItem from "~/types/api/StorageItem";
import type ParentFolder from "~/types/api/ParentFolder";

export default interface Folder extends StorageItem {
    parents?: ParentFolder[],
    items?: StorageItem[]
    is_root: boolean,
    version_update_url?: string,
    version_update_token?: string
}
