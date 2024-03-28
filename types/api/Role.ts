import type PermissionObject from "~/types/api/PermissionObject";

export default interface Role {
    id: string,
    name: string,
    color: string,
    position: number,
    is_default: boolean,
    workspace_id: boolean,
    permissions: PermissionObject,
}
