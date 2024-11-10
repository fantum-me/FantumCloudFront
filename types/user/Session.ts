import type User from "~/types/user/User";

export default interface Session extends User {
    scheme: string
}
