import type Member from "~/types/api/Member";

export default interface InviteCode {
    code: string,
    created_by: Member,
    use_count: number
}
