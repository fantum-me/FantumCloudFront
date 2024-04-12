import type StorageItem from "~/types/api/StorageItem";
import type ParentFolder from "~/types/api/ParentFolder";
import type File from "~/types/api/File";

export default interface Folder extends StorageItem {
    parents?: ParentFolder[],
    files?: File[]
    folders?: Folder[],
    is_root: boolean,
}
