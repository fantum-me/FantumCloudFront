import type DatabaseView from "~/types/database/DatabaseView";
import TableFieldType from "~/types/database/TableFieldType";
import type TableField from "~/types/database/TableField";
import {getViewTargetFieldTypes} from "~/types/database/DatabaseViewType";

export const setDatabaseViewTargetField = async (view: DatabaseView, fieldId: string) => {
    const workspace = useWorkspace().value
    const database = useDatabase().value
    const oldSettings = {...view.settings}
    view.settings.target_field = fieldId
    const res = await useApiFetch(`/workspaces/${workspace.id}/databases/${database.id}/views/${view.id}`, {
        method: "PATCH",
        body: JSON.stringify({settings: view.settings})
    })
    if (!res.ok) {
        useErrorToast("Failed to change target field")
        view.settings = oldSettings
    }
}

export const createDatabaseTableField = async (type: TableFieldType, name?: string) => {
    const workspace = useWorkspace().value
    const database = useDatabase().value
    const res = await useApiFetch(`/workspaces/${workspace.id}/databases/${database.id}/fields`, {
        method: "POST",
        body: JSON.stringify({name: name ?? capitalize(type), type: type})
    })
    if (!res.ok) useErrorToast("Failed to create datetime field")
}

export const getDatabaseViewTargetField = (view: DatabaseView): TableField | undefined => {
    const database = useDatabase().value
    const targetFieldTypes = getViewTargetFieldTypes(view)
    if (targetFieldTypes) {
        if (view.settings.target_field) {
            const field = database.fields?.find(f => f.id === view.settings.target_field)
            if (field && targetFieldTypes.includes(field.type)) return field
        }
        const field = database.fields?.find(f => targetFieldTypes.includes(f.type))
        if (field) setDatabaseViewTargetField(view, field.id)
        else createDatabaseTableField(targetFieldTypes[0])
    }
}

