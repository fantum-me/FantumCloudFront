<script setup lang="ts">
import TableFieldType from "~/types/database/TableFieldType";

const {recordId, fieldId} = defineProps({recordId: String, fieldId: String})

const workspace = useWorkspace()
const database = useDatabase()
const record = computed(() => database.value.records?.find(r => r.id === recordId))
const field = computed(() => database.value.fields?.find(f => f.id === fieldId))

const cellRef = ref()
const isEditing = ref(false)
const newValue = ref("")

async function updateValue(newValue: string) {
	if (!record.value || !field.value) return
	console.log("a")

	newValue = String(newValue)
	const oldValue = record.value.values[field.value.id]
	record.value.values[field.value.id] = newValue

	const res = await useApiFetch(
		`/workspaces/${workspace.value.id}/databases/${database.value.id}/records/${record.value.id}`,
		{
			method: "PATCH",
			body: JSON.stringify({values: {[field.value.id]: newValue}}),
		}
	)

	if (!res.ok) {
		record.value.values[field.value.id] = oldValue
		useErrorToast("Failed to update value")
	}
}

async function startEditing() {
	if (!record.value || !field.value || field.value.type === TableFieldType.BooleanType || isEditing.value) return;

	newValue.value = record.value.values[field.value.id]

	isEditing.value = true
	window.addEventListener("click", onClickWhileEditing)
}

async function endEditing() {
	window.addEventListener("click", onClickWhileEditing)
	isEditing.value = false
	if (!record.value || !field.value) return;
	if (newValue.value !== record.value.values[field.value.id]) await updateValue(newValue.value)
}

function onClickWhileEditing(event: MouseEvent) {
	if (!(cellRef.value === event.target || cellRef.value.contains(event.target))) endEditing()
}

function onInput(event: InputEvent) {
	const target = (event.target as HTMLInputElement)
	if (field.value && field.value.type === TableFieldType.NumberType)
		target.value = target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1')
}
</script>

<template>
	<div v-if="record && field" @click="startEditing" ref="cellRef" class="h-full w-full">
		<DatabaseTableCellBoolean v-if="field.type === TableFieldType.BooleanType"
		                          :record="record" :field="field" :update="updateValue"/>
		<DatabaseTableCellSelect v-else-if="field.type === TableFieldType.SelectType" v-model:new-value="newValue"
		                         :record="record" :field="field" :isEditing="isEditing" :endEditing="endEditing"/>
		<div v-else class="relative">
			<div class="mx-4 py-3 break-all text-wrap">
				{{ record?.values[field.id] }}<span class="select-none">&nbsp;</span>
			</div>
			<form v-if="isEditing" class="absolute top-0 left-0 m-1 mt-0.5 w-full h-full z-10" @submit.prevent="endEditing">
				<UTextarea autoresize v-model="newValue" :placeholder="field.name" autofocus @input="onInput"
				        size="xl" color="gray" :rows="1"/>
			</form>
		</div>
	</div>
</template>
