import type TableFieldType from "~/types/database/TableFieldType";
import type {BadgeColor} from "#ui/types";

export default interface TableField {
    id: string
    name: string
    is_title: boolean
    type: TableFieldType
    options: Record<string, BadgeColor> | null
    default_value: string
    position: number
}
