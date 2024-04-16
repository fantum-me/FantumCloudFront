import type Role from "~/types/api/Role";
import type PermissionObject from "~/types/api/PermissionObject";

export default interface Workspace {
    id: string,
    name: string,
    owner: boolean,
    owner_id: string,
    root: string,
    access: PermissionObject,
    member_count: number,
    roles: Role[],
    used_space: number,
    quota: number
}
