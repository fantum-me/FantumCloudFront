import type DatabaseViewType from "~/types/database/DatabaseViewType";
import type Member from "~/types/user/Member";

export default interface DatabaseView {
    id: string
    name: string
    type: DatabaseViewType
    field_settings: Record<string, {
        width?: number
    }>
    created_by: Member
}
