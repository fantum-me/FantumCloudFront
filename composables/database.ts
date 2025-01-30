import type Database from "~/types/database/Database";
import type DatabaseView from "~/types/database/DatabaseView";
import type TableField from "~/types/database/TableField";

type ValueEditingTarget = {
    field: TableField,
    currentValue: string,
    update: (v: string) => void,
    width: number,
    position: {
        x: number,
        y: number
    }
}

export const useDatabase = () => useState<Database>('database')
export const useDatabaseView = () => useState<DatabaseView>('database-view')
export const useValueEditingTarget = () => useState<undefined | ValueEditingTarget>("database-value-editing-target")
