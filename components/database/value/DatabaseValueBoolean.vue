<script lang="ts" setup>
import type TableRecord from "~/types/database/TableRecord";
import type TableField from "~/types/database/TableField";

const {record, field} = defineProps<{ record: TableRecord, field: TableField }>()

const workspace = useWorkspace()
const database = useDatabase()

const value = ref(record.values[field.id] === "true")
watch(() => record.values[field.id], newValue => value.value = newValue === "true")
watch(value, async newValue => {
	const strValue = newValue ? "true" : "false"
	if (record.values[field.id] === strValue) return

	const res = await useApiFetch(
		`/workspaces/${workspace.value.id}/databases/${database.value.id}/fields/${field.id}/records/${record.id}`,
		{
			method: "PATCH",
			body: JSON.stringify({value: strValue}),
		}
	)

	if (!res.ok) {
		value.value = record.values[field.id] === "true"
		useErrorToast("Failed to update value")
	}
})
</script>

<template>
	<div v-if="record && field" class="p-3 mt-px">
		<UToggle v-model="value"/>
	</div>
</template>
