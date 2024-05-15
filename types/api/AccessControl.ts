import type PermissionObject from "~/types/api/PermissionObject";

export default interface AccessControl {
    role_id: string,
    permissions: PermissionObject
}
