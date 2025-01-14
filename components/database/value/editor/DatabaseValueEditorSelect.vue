<script setup lang="ts">
import type TableField from "~/types/database/TableField";

const workspace = useWorkspace()
const database = useDatabase()

const newValue = defineModel<string>()

const {field, endEditing} = defineProps<{
	field: TableField,
	endEditing: () => void
}>()

const inputValue = ref("")

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
	inputValue.value = inputValue.value.replace(",", "")
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

async function onClickOption(label: string) {
	newValue.value = label
	inputValue.value = ''
	endEditing()
}
</script>

<template>
	<form class="w-52 bg-white dark:bg-gray-950 rounded-lg" style="box-shadow: 0 0 10px rgba(0,0,0,.25);"
	      @submit.prevent="onInputSubmit">
		<UInput v-model="inputValue" :ui="{base: 'sm:py-3 sm:px-4', rounded: 'rounded-b-none'}" autofocus class="w-full"
		        color="gray" variant="databaseSelectMenu"/>
		<div class="p-1 space-y-1">
			<UButton v-for="(color, label) in searchResults" block class="justify-start px-2" color="gray"
			         type="button" variant="ghost" @click.stop="onClickOption(label)">
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
