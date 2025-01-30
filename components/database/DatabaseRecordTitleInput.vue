<script lang="ts" setup>
import type TableField from "~/types/database/TableField";
import type TableRecord from "~/types/database/TableRecord";

const {record} = defineProps<{ record: TableRecord }>()

const workspace = useWorkspace()
const database = useDatabase()
const titleField = ref(database.value.fields?.find(f => f.is_title) as TableField)
const newName = ref(record.values[titleField.value.id])

async function updateName() {
	const oldValue = record.values[titleField.value.id]
	if (newName.value === oldValue) return
	record.values[titleField.value.id] = newName.value
	const res = await useApiFetch(
		`/workspaces/${workspace.value.id}/databases/${database.value.id}/fields/${titleField.value.id}/records/${record.id}`,
		{
			method: "PATCH",
			body: JSON.stringify({value: newName.value}),
		}
	)
	if (!res.ok) {
		record.values[titleField.value.id] = oldValue;
		useErrorToast("Rename failed")
	}
}
</script>

<template>
	<form @submit.prevent="updateName">
		<UInput v-model="newName" autofocus class="font-semibold opacity-80" color="gray" placeholder="New Item"
		        size="4xl" variant="transparent" @focusout="updateName"/>
	</form>
</template>
