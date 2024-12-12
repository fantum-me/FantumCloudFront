import type StorageItem from "~/types/filesystem/StorageItem";
import type TableRecord from "~/types/database/TableRecord";
import type TableField from "~/types/database/TableField";
import type DatabaseView from "~/types/database/DatabaseView";

export default interface Database extends StorageItem {
    id: string,
    views: DatabaseView[]
    records?: TableRecord[]
    fields?: TableField[]
    update_url?: string
    update_token?: string
}
