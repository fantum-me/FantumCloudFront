import type User from "~/types/api/User";

export default interface Session extends User {
    scheme: string
}
