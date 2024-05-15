import type PermissionObject from "~/types/api/PermissionObject";
import type AccessControl from "~/types/api/AccessControl";

export default interface StorageItemSummary {
    id: string,
    name: string,
    ext: string,
    type: "folder" | "file",
    access: PermissionObject,
    access_controls: AccessControl[],
    mime?: string
}
