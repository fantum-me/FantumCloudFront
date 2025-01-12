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

export function isRecordValidateFilters(record: TableRecord, view: DatabaseView): boolean {
    if (!view.settings?.filters) return true
    const database = useDatabase().value
    for (const filter of view.settings.filters) {
        if (!filter.operation || (!filter.value.trim() && isFilterTypeNeedValue(filter.operation))) continue;
        const field: TableField | undefined = database.fields?.find(f => f.id === filter.field_id)
        switch (filter.operation) {
            case DatabaseViewFilterType.Is:
                if (field?.type === TableFieldType.SelectType) {
                    if (!filter.value.split(",").includes(record.values[filter.field_id]))
                        return false
                } else if (filter.value !== record.values[filter.field_id])
                    return false
                break
            case DatabaseViewFilterType.IsNot:
                if (field?.type === TableFieldType.SelectType) {
                    if (filter.value.split(",").includes(record.values[filter.field_id]))
                        return false
                } else if (filter.value === record.values[filter.field_id])
                    return false
                break
            case DatabaseViewFilterType.Contains:
                if (!record.values[filter.field_id].includes(filter.value))
                    return false
                break
            case DatabaseViewFilterType.DoesNotContain:
                if (record.values[filter.field_id].includes(filter.value))
                    return false
                break
            case DatabaseViewFilterType.StartsWith:
                if (!record.values[filter.field_id].startsWith(filter.value))
                    return false
                break
            case DatabaseViewFilterType.EndsWith:
                if (!record.values[filter.field_id].endsWith(filter.value))
                    return false
                break
            case DatabaseViewFilterType.IsEmpty:
                if (record.values[filter.field_id])
                    return false
                break
            case DatabaseViewFilterType.IsNotEmpty:
                if (!record.values[filter.field_id])
                    return false
                break
            case DatabaseViewFilterType.IsGreater:
                if (record.values[filter.field_id] <= filter.value)
                    return false
                break
            case DatabaseViewFilterType.IsGreaterOrEqual:
                if (record.values[filter.field_id] < filter.value)
                    return false
                break
            case DatabaseViewFilterType.IsLower:
                if (record.values[filter.field_id] >= filter.value)
                    return false
                break
            case DatabaseViewFilterType.IsLowerOrEqual:
                if (record.values[filter.field_id] > filter.value)
                    return false
                break
        }
    }
    return true
}
