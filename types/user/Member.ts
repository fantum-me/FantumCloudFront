import type User from "~/types/user/User";
import type Role from "~/types/permission/Role";

export default interface Member {
    id: string,
    user: User,
    is_owner: boolean,
    roles: Role[],
    position: number
}
