import type PermissionObject from "~/types/permission/PermissionObject";

export default interface Role {
    id: string,
    name: string,
    color: string,
    position: number,
    editable: boolean,
    is_default: boolean,
    workspace_id: boolean,
    permissions: PermissionObject,
}
