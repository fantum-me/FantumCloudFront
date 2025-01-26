<script lang="ts" setup>
import TableFieldType, {isFieldTypeSelect} from "~/types/database/TableFieldType";
import type TableField from "~/types/database/TableField";

const value = defineModel<string>({required: true})
const editingTarget = useValueEditingTarget()

const {field, placeholder = false} = defineProps<{ field: TableField, placeholder?: boolean }>()

const cellRef = ref()
const formatedValue = computed<string>(() => {
	if (field.type === TableFieldType.DatetimeType && value.value) return formatDatetimeToString(value.value)
	else return value.value
})

function startEditing() {
	if (field.type === TableFieldType.BooleanType) return
	editingTarget.value = {
		field: field,
		width: cellRef.value.parentNode.clientWidth,
		currentValue: value.value,
		update: (v: string) => value.value = v,
		position: {
			x: cellRef.value.getBoundingClientRect().left,
			y: cellRef.value.getBoundingClientRect().top
		}
	}
}
</script>

<template>
	<div v-if="field" ref="cellRef" class="h-full w-full relative" @click="startEditing">
		<DatabaseValueBoolean v-if="field.type === TableFieldType.BooleanType" v-model="value"/>
		<DatabaseValueSelect v-else-if="value && isFieldTypeSelect(field.type)" :field="field" :value="value"/>

		<div v-else class="mx-4 py-3 break-all text-wrap">
			<span v-if="value" class="whitespace-pre">{{ formatedValue }}</span>
			<span v-else-if="placeholder" class="text-sm text-gray-400 dark:text-gray-600">Empty</span>
			<span class="select-none">&nbsp;</span>
		</div>
	</div>
</template>
