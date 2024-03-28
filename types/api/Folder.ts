import type StorageItem from "~/types/api/StorageItem";
import type ParentFolder from "~/types/api/ParentFolder";

export default interface Folder extends StorageItem {
    parents?: ParentFolder[],
    files?: File[]
    folders?: File[],
    is_root: boolean,
}
