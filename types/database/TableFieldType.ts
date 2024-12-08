import {
    DatabaseFieldIconBoolean,
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
}

export default TableFieldType

export function getFieldIcon(field: TableField) {
    if (field.is_title) return DatabaseFieldIconTitle;
    else return getFieldTypeIcon(field.type)
}

export function getFieldTypeIcon(type: TableFieldType) {
    if (type === TableFieldType.TextType) return DatabaseFieldIconText;
    else if (type === TableFieldType.NumberType) return DatabaseFieldIconNumber;
    else if (type === TableFieldType.BooleanType) return DatabaseFieldIconBoolean;
    else if (type === TableFieldType.SelectType) return DatabaseFieldIconSelect;
    else return DatabaseFieldIconText;
}
