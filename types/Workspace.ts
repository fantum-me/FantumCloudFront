import type Role from "~/types/permission/Role";
import type PermissionObject from "~/types/permission/PermissionObject";
import type Member from "~/types/user/Member";

export default interface Workspace {
    id: string,
    name: string,
    owner: boolean,
    owner_id: string,
    root: string,
    access: PermissionObject,
    member: Member,
    member_count: number,
    roles: Role[],
    used_space: number,
    quota: number
}
