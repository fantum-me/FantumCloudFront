import type DatabaseViewType from "~/types/database/DatabaseViewType";
import type Member from "~/types/user/Member";
import type DatabaseViewFilter from "~/types/database/DatabaseViewFilter";

export default interface DatabaseView {
    id: string
    name: string
    type: DatabaseViewType
    settings: {
        widths?: Record<string, number>
        filters?: DatabaseViewFilter[]
    }
    created_by: Member
}
