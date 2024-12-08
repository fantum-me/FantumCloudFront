import type StorageItem from "~/types/filesystem/StorageItem";
import type TableRecord from "~/types/database/TableRecord";
import type TableField from "~/types/database/TableField";
import type DatabaseViewType from "~/types/database/DatabaseViewType";

export default interface Database extends StorageItem {
    id: string,
    views: DatabaseViewType[]
    records?: TableRecord[]
    fields?: TableField[]
}
