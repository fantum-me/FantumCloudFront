import type User from "~/types/api/User";
import type Role from "~/types/api/Role";

export default interface Member extends User {
    is_owner: boolean,
    roles: Role[]
}
