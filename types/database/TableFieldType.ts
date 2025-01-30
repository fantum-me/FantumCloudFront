import {
    DatabaseFieldIconBoolean,
    DatabaseFieldIconDatetime,
    DatabaseFieldIconMultiselect,
    DatabaseFieldIconNumber,
    DatabaseFieldIconSelect,
    DatabaseFieldIconText,
    DatabaseFieldIconTitle,
} from "#components";
import type TableField from "~/types/database/TableField";

enum TableFieldType {
    TextType = "text",
    NumberType = "number",
    BooleanType = "boolean",
    SelectType = "select",
    MultiselectType = "multiselect",
    DatetimeType = "datetime"
}

export default TableFieldType

export function isFieldTypeSelect(type: TableFieldType) {
    return type === TableFieldType.SelectType || type === TableFieldType.MultiselectType;
}

export function getFieldIcon(field: TableField) {
    if (field.is_title) return DatabaseFieldIconTitle;
    else return getFieldTypeIcon(field.type)
}

export function getFieldTypeIcon(type: TableFieldType) {
    if (type === TableFieldType.TextType) return DatabaseFieldIconText;
    else if (type === TableFieldType.NumberType) return DatabaseFieldIconNumber;
    else if (type === TableFieldType.BooleanType) return DatabaseFieldIconBoolean;
    else if (type === TableFieldType.SelectType) return DatabaseFieldIconSelect;
    else if (type === TableFieldType.MultiselectType) return DatabaseFieldIconMultiselect;
    else if (type === TableFieldType.DatetimeType) return DatabaseFieldIconDatetime;
    else return DatabaseFieldIconText;
}
