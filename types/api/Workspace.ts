import type Role from "~/types/api/Role";
import type PermissionObject from "~/types/api/PermissionObject";

export default interface Workspace {
    id: string,
    name: string,
    owner: number,
    root: number,
    access: PermissionObject,
    member_count: number,
    roles: Role[]
}
