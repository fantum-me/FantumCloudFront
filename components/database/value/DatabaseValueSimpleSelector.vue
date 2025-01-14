<script lang="ts" setup>
import type TableField from "~/types/database/TableField";
import TableFieldType from "~/types/database/TableFieldType";

const value = defineModel<string>()
const {field, submit} = defineProps<{
	field: TableField,
	submit: () => void
}>()

const newValue = computed({
	get() {
		if (field.type === TableFieldType.SelectType) return value.value?.split(",").filter(v => !!v)
		else return value.value
	},
	set(newValue) {
		if (field.type === TableFieldType.SelectType) value.value = (newValue as string[]).join(",")
		else value.value = String(newValue).substring(0, 511)
	}
})

const selectToggle = (option: string) => {
	if (!Array.isArray(newValue.value)) return
	if (newValue.value.includes(option)) newValue.value = newValue.value.filter(v => v !== option)
	else newValue.value = newValue.value.concat([option])
}
</script>

<template>
	<div v-if="field.type === TableFieldType.BooleanType" class="px-1">
		<URadioGroup v-model="newValue"
		             :options="[{value: 'true', label: 'Checked'}, {value: 'false', label: 'Unchecked'}]"/>
	</div>
	<div v-else-if="field.type === TableFieldType.SelectType && field.options && Array.isArray(newValue)"
	     class="space-y-1 px-1">
		<UCheckbox v-for="[option, color] in Object.entries(field.options)" :model-value="newValue.includes(option)"
		           @click="selectToggle(option)">
			<template #label>
				<UBadge :color="color" variant="subtle">{{ option }}</UBadge>
			</template>
		</UCheckbox>
	</div>
	<form v-else-if="typeof newValue === 'string'" class="w-40" @submit.prevent="submit">
		<UInput v-if="field.type === TableFieldType.NumberType" v-model="newValue" type="number"/>
		<UInput v-else v-model="newValue" type="text"/>
	</form>
</template>
