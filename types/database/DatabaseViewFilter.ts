import DatabaseViewFilterType from "~/types/database/DatabaseViewFilterType";

export default interface DatabaseViewFilter {
    field_id: string
    operation: DatabaseViewFilterType
    value: string
}
