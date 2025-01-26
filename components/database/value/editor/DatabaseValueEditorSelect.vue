<script setup lang="ts">
import type TableField from "~/types/database/TableField";
import type {BadgeColor} from "#ui/types";
import TableFieldType from "~/types/database/TableFieldType";

const workspace = useWorkspace()
const database = useDatabase()

const newValue = defineModel<string>()

const {field, endEditing} = defineProps<{
	field: TableField,
	endEditing: () => void
}>()

const values = computed({
	get: () => newValue.value ? newValue.value.split(",") : [],
	set: (x) => newValue.value = x.join(",")
})
const inputValue = ref("")

const searchResults = computed(() => {
	const result: Record<string, BadgeColor> = {}
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
	inputValue.value = inputValue.value.replace(",", "")
	field.options[inputValue.value] = newOptionColor.value

	onSelectOption(inputValue.value)

	const res = await useApiFetch(
		`/workspaces/${workspace.value.id}/databases/${database.value.id}/fields/${field.id}`, {
			method: "PATCH",
			body: JSON.stringify({options: field.options}),
		})

	if (!res.ok) {
		delete field.options[inputValue.value]
		values.value = values.value.filter(v => v !== inputValue.value)
		useErrorToast("Failed to create new option")
	}
}

function onInputSubmit() {
	const results = Object.keys(searchResults.value)
	if (!results.length) submitWithNewOption()
	else onSelectOption(results[0])
}

function onSelectOption(label: string) {
	inputValue.value = ''
	if (field.type === TableFieldType.SelectType) {
		newValue.value = label
		endEditing()
	} else if (!values.value.includes(label)) {
		values.value = values.value.concat([label])
	}
}

function onRemoveOption(label: string) {
	values.value = values.value.concat([label])
}
</script>

<template>
	<form class="max-w-full min-w-64 bg-white dark:bg-gray-950 rounded-lg overflow-hidden"
	      style="box-shadow: 0 0 10px rgba(0,0,0,.25);" @submit.prevent="onInputSubmit">
		<div class="flex-start p-2 gap-1 flex-wrap bg-gray-100 dark:bg-gray-700/30">
			<UBadge v-for="val in values" v-if="values.length" :color="field.options?.[val] as BadgeColor"
			        class="flex-center gap-1" variant="subtle">
				{{ val }}
				<UIcon class="cursor-pointer p-0.5" name="i-heroicons-x-mark-16-solid"
				       @click="values = values.filter(v => v !== val)"/>
			</UBadge>
			<UInput v-model="inputValue" :ui="{rounded: 'rounded-b-none'}" autofocus
			        class="flex-1 min-w-16" color="gray" variant="transparent"/>
		</div>
		<div class="p-1 space-y-1">
			<UButton v-for="(color, label) in searchResults" block class="justify-start px-2" color="gray"
			         type="button" variant="ghost" @click.stop="onSelectOption(label)">
				<span class="w-px bg-gray-200 dark:bg-gray-600 mr-1">&nbsp;</span>
				<UBadge :color="color" variant="subtle">{{ label }}</UBadge>
			</UButton>

			<UButton v-if="inputValue && !(inputValue in searchResults)" block class="justify-start px-1.5 opacity-75"
			         color="gray" type="button" variant="ghost" @click="submitWithNewOption">
				Create
				<UBadge :color="newOptionColor" variant="subtle">{{ inputValue.replace(",", "") }}</UBadge>
			</UButton>
		</div>
	</form>
</template>
