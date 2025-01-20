import type TableField from "~/types/database/TableField";
import type TableRecord from "~/types/database/TableRecord";
import type DatabaseView from "~/types/database/DatabaseView";
import DatabaseViewFilterType, {isFilterTypeNeedValue} from "~/types/database/DatabaseViewFilterType";
import TableFieldType from "~/types/database/TableFieldType";

export const repositionField = (id: string, newPosition: number) => {
    const database = useDatabase().value
    const field = database.fields?.find(f => f.id === id) as TableField
    const currentPosition = field.position
    const targetPosition = (database.fields?.find(f => f.position === newPosition) as TableField).position

    database.fields?.forEach((f) => {
        if (f.id === field.id) {
            f.position = targetPosition;
        } else if (currentPosition < targetPosition && f.position > currentPosition && f.position <= targetPosition) {
            f.position--;
        } else if (currentPosition > targetPosition && f.position < currentPosition && f.position >= targetPosition) {
            f.position++;
        }
    });

    database.fields?.sort((a, b) => a.position - b.position)
}

function equal(fieldType: TableFieldType, filterValue: string, recordValue: string) {
    if (fieldType === TableFieldType.SelectType) return filterValue.split(",").includes(recordValue)
    else if (fieldType === TableFieldType.DatetimeType) return areDateStringsEqual(recordValue, filterValue)
    else return filterValue.toLowerCase() === recordValue.toLowerCase()
}

export function isRecordValidateFilters(record: TableRecord, view: DatabaseView): boolean {
    if (!view.settings?.filters) return true
    const database = useDatabase().value
    for (const filter of view.settings.filters) {
        if (!filter.operation || (!filter.value.trim() && isFilterTypeNeedValue(filter.operation))) continue;
        const field: TableField = database.fields?.find(f => f.id === filter.field_id) as TableField
        const value = record.values[filter.field_id]

        switch (filter.operation) {
            case DatabaseViewFilterType.Is:
                return equal(field.type, filter.value, value)
            case DatabaseViewFilterType.IsNot:
                return !equal(field.type, filter.value, value)
            case DatabaseViewFilterType.Contains:
                return value.toLowerCase().includes(filter.value.toLowerCase())
            case DatabaseViewFilterType.DoesNotContain:
                return !value.toLowerCase().includes(filter.value.toLowerCase())
            case DatabaseViewFilterType.StartsWith:
                return value.toLowerCase().startsWith(filter.value.toLowerCase())
            case DatabaseViewFilterType.EndsWith:
                return value.toLowerCase().endsWith(filter.value.toLowerCase())
            case DatabaseViewFilterType.IsEmpty:
                return !value
            case DatabaseViewFilterType.IsNotEmpty:
                return !!value
            case DatabaseViewFilterType.IsGreater:
                return value > filter.value
            case DatabaseViewFilterType.IsGreaterOrEqual:
                return value >= filter.value
            case DatabaseViewFilterType.IsLower:
                return value < filter.value
            case DatabaseViewFilterType.IsLowerOrEqual:
                return value <= filter.value
            case DatabaseViewFilterType.IsBefore:
                let startDate = new Date(value.split(",")[0])
                return startDate <= new Date(filter.value)
            case DatabaseViewFilterType.IsAfter:
                let endDate = new Date(value.includes(",") ? value.split(',')[1] : value)
                return endDate >= new Date(filter.value)
        }
    }
    return true
}
