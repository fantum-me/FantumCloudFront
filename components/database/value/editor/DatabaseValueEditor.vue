<script setup lang="ts">
import TableFieldType from "~/types/database/TableFieldType";
import type TableRecord from "~/types/database/TableRecord";
import type TableField from "~/types/database/TableField";

const target = useState<undefined|{
	recordId: string,
	fieldId: string,
	width: number,
	position: {
		x: number,
		y: number
	}
}>("database-value-editing-target", () => undefined)

const workspace = useWorkspace()
const database = useDatabase()

const record = computed<TableRecord | undefined>(() => database.value.records?.find(r => r.id === target.value?.recordId))
const field = computed<TableField | undefined>(() => database.value.fields?.find(f => f.id === target.value?.fieldId))

const newValue = ref("")

async function updateValue(newValue: string) {
	if (!record.value || !field.value) return

	newValue = String(newValue)
	const oldValue = record.value.values[field.value.id]
	record.value.values[field.value.id] = newValue

	const res = await useApiFetch(
		`/workspaces/${workspace.value.id}/databases/${database.value.id}/fields/${field.value.id}/records/${record.value.id}`,
		{
			method: "PATCH",
			body: JSON.stringify({value: newValue}),
		}
	)

	if (!res.ok) {
		record.value.values[field.value.id] = oldValue
		useErrorToast("Failed to update value")
	}
}

function endEditing() {
	if (!record.value || !field.value) return;
	if (newValue.value !== record.value.values[field.value.id]) updateValue(newValue.value)
	target.value = undefined
	newValue.value = ""
}
</script>

<template>
	<div v-if="target && record && field" class="z-50 fixed top-0 left-0 w-screen h-screen" @click="endEditing">
		<div class="absolute" @click.stop :style="{
			transform: `translate(${target.position.x - 1}px, ${target.position.y - 1}px)`,
			width: target.width + 'px'
		}">
			<DatabaseValueEditorSelect v-if="field.type === TableFieldType.SelectType" v-model="newValue" :field="field"
			                           :end-editing="endEditing"/>
			<DatabaseValueEditorText v-else v-model="newValue" :field="field" :record="record" :end-editing="endEditing"/>
		</div>
	</div>
</template>
