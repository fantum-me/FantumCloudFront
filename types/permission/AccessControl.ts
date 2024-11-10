import type PermissionObject from "~/types/permission/PermissionObject";

export default interface AccessControl {
    role_id: string,
    permissions: PermissionObject
}
