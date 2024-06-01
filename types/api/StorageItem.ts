import type PermissionObject from "~/types/api/PermissionObject";
import type AccessControl from "~/types/api/AccessControl";
import type Member from "~/types/api/Member";

export default interface StorageItem {
    id: string,
    name: string,
    created_at: number,
    updated_at: number,
    version: number,
    in_trash: boolean,
    owner: Member,
    access: PermissionObject,
    access_controls: AccessControl[],
    workspace_id: string,
    parent_id: string,
    size: number,
    type: 'file' | 'folder'
}
