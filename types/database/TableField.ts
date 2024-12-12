import type TableFieldType from "~/types/database/TableFieldType";

export default interface TableField {
    id: string
    name: string
    is_title: boolean
    type: TableFieldType
    options: Record<string, string> | null
    default_value: string
}
