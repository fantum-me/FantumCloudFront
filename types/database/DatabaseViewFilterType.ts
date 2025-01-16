import TableFieldType from "~/types/database/TableFieldType";
import type TableField from "~/types/database/TableField";

enum DatabaseViewFilterType {
    Is = 'is',
    IsNot = 'is_not',
    Contains = 'contains',
    DoesNotContain = 'does_not_contain',
    StartsWith = 'starts_with',
    EndsWith = 'ends_with',
    IsEmpty = 'is_empty',
    IsNotEmpty = 'is_not_empty',

    IsGreater = 'is_greater',
    IsGreaterOrEqual = 'is_greater_or_equal',
    IsLower = 'is_lower',
    IsLowerOrEqual = 'is_lower_or_equal',

    IsBefore = 'is_before',
    IsAfter = 'is_after',
}

export default DatabaseViewFilterType;

export function isFilterTypeNeedValue(type: DatabaseViewFilterType): boolean {
    return ![DatabaseViewFilterType.IsEmpty, DatabaseViewFilterType.IsNotEmpty].includes(type)
}

export function getTableFieldAvailableFilter(field: TableField): DatabaseViewFilterType[] {
    const filter = DatabaseViewFilterType
    let allowed = [filter.Is, filter.IsNot]

    if (field.type !== TableFieldType.BooleanType) allowed.push(filter.IsEmpty, filter.IsNotEmpty)

    if (field.type === TableFieldType.TextType) {
        allowed.push(filter.Contains, filter.DoesNotContain, filter.StartsWith, filter.EndsWith)
    } else if (field.type === TableFieldType.NumberType) {
        allowed.push(filter.IsGreater, filter.IsGreaterOrEqual, filter.IsLower, filter.IsLowerOrEqual)
    } else if (field.type === TableFieldType.DatetimeType) {
        allowed.push(filter.IsBefore, filter.IsAfter)
    }
    return allowed
}
