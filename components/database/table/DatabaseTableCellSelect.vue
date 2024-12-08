<script setup lang="ts">
import type TableRecord from "~/types/database/TableRecord";
import type TableField from "~/types/database/TableField";

const workspace = useWorkspace()
const database = useDatabase()

const newValue = defineModel<string>('newValue')
const inputValue = ref("")

const {record, field, isEditing, endEditing} = defineProps<{
	record: TableRecord,
	field: TableField,
	isEditing: boolean,
	endEditing: () => void
}>()

const searchResults = computed(() => {
	const result: Record<string, string> = {}
	if (!field.options) return result
	for (let [label, color] of Object.entries(field.options)) {
		if (label.includes(inputValue.value)) result[label] = color
	}
	return result
})

const newOptionColor = computed(() => {
	if (field.options && Object.entries(field.options).length > 0) {
		const lastColor = Object.values(field.options).findLast(() => true) as string
		const lastIndex = TABLE_FIELD_SELECT_COLORS.findIndex((c) => c === lastColor)
		if (lastIndex < TABLE_FIELD_SELECT_COLORS.length - 1) return TABLE_FIELD_SELECT_COLORS[lastIndex + 1]
	}
	return TABLE_FIELD_SELECT_COLORS[0]
})

async function submitWithNewOption() {
	if (!inputValue.value) return

	if (!field.options) field.options = {}
	field.options[inputValue.value] = newOptionColor.value

	const res = await useApiFetch(
		`/workspaces/${workspace.value.id}/databases/${database.value.id}/fields/${field.id}`, {
			method: "PATCH",
			body: JSON.stringify({options: field.options}),
		})

	if (res.ok) {
		newValue.value = inputValue.value
		inputValue.value = ""
		endEditing()
	} else {
		delete field.options[inputValue.value]
		useErrorToast("Failed to create new option")
	}
}

function onInputSubmit() {
	const results = Object.keys(searchResults.value)
	if (!results.length) submitWithNewOption()
	else {
		newValue.value = results[0]
		inputValue.value = ''
		endEditing()
	}
}
</script>

<template>
	<div class="relative py-0.5">
		<UBadge v-if="record.values[field.id]" :color="field.options?.[record.values[field.id]]" variant="subtle"
		        class="m-2.5">
			{{ record.values[field.id] }}
		</UBadge>
		<div v-else class="select-none">&nbsp;</div>

		<form v-if="isEditing" class="absolute top-0 left-0 -mt-[11px] -ml-px rounded w-64 z-50 bg-white"
		      style="box-shadow: 0 0 10px rgba(0,0,0,.25);" @submit.prevent="onInputSubmit">
			<UInput v-model="inputValue" color="gray" variant="databaseSelectMenu" class="w-full" autofocus
			        :ui="{base: 'sm:py-3 sm:px-4', rounded: 'rounded-b-none'}"/>
			<div class="p-1 space-y-1">
				<UButton v-for="(color, label) in searchResults" class="justify-start px-2" color="gray" variant="ghost"
				         block type="button" @click.stop="() => {newValue = label; inputValue = ''; endEditing()}">
					<span class="w-px bg-gray-200 mr-1">&nbsp;</span>
					<UBadge :color="color" variant="subtle">{{ label }}</UBadge>
				</UButton>

				<UButton v-if="inputValue && !(inputValue in searchResults)" @click="submitWithNewOption" type="button"
				         block class="justify-start px-1.5 opacity-75" color="gray" variant="ghost">
					Create
					<UBadge :color="newOptionColor" variant="subtle">{{ inputValue }}</UBadge>
				</UButton>
			</div>
		</form>
	</div>
</template>
