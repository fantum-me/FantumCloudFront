import type User from "~/types/api/User";
import type Role from "~/types/api/Role";

export default interface Member {
    id: string,
    user: User,
    is_owner: boolean,
    roles: Role[]
}
