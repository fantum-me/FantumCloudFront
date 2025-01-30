<script lang="ts" setup>
import type TableRecord from "~/types/database/TableRecord";
import type TableField from "~/types/database/TableField";

const {record, field, placeholder = false} = defineProps<{
	record: TableRecord,
	field: TableField,
	placeholder?: boolean
}>()

const workspace = useWorkspace()
const database = useDatabase()

const value = computed({
	get: () => field.id in record.values ? record.values[field.id] : "",
	set: updateValue
})

async function updateValue(newValue: string) {
	if (!record || !field) return

	newValue = String(newValue)
	const oldValue = record.values[field.id]
	record.values[field.id] = newValue

	const res = await useApiFetch(
		`/workspaces/${workspace.value.id}/databases/${database.value.id}/fields/${field.id}/records/${record.id}`,
		{
			method: "PATCH",
			body: JSON.stringify({value: newValue}),
		}
	)

	if (!res.ok) {
		record.values[field.id] = oldValue
		useErrorToast("Failed to update value")
	}
}
</script>

<template>
	<DatabaseValue v-model="value" :field="field" :placeholder="placeholder"/>
</template>
