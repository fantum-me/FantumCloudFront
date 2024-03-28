import type PermissionObject from "~/types/api/PermissionObject";

export default interface StorageItemSummary {
    id: string,
    name: string,
    ext: string,
    type: "folder" | "file",
    access: PermissionObject,
}
