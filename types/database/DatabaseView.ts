import type DatabaseViewType from "~/types/database/DatabaseViewType";
import type Member from "~/types/user/Member";

export default interface DatabaseView {
    id: string
    name: string
    type: DatabaseViewType
    settings: {
        widths?: Record<string, number>
    }
    created_by: Member
}
