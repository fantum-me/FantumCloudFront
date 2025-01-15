<script lang="ts" setup>
import TableFieldType from "~/types/database/TableFieldType";
import type TableField from "~/types/database/TableField";

const value = defineModel<string>({required: true})
const {field} = defineProps<{ field: TableField }>()

const cellRef = ref()
const formatedValue = computed<string>(() => {
	if (field.type === TableFieldType.DatetimeType) return formatDatetimeToString(value.value)
	else return value.value
})

function startEditing() {
	if (field.type === TableFieldType.BooleanType) return
	useState("database-value-editing-target").value = {
		field: field,
		width: cellRef.value.parentNode.clientWidth,
		currentValue: value,
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
		<DatabaseValueSelect v-else-if="field.type === TableFieldType.SelectType" :field="field" :value="value"/>

		<div v-else class="mx-4 py-3 break-all text-wrap">
			<span class="whitespace-pre">{{ formatedValue }}</span>
			<span class="select-none">&nbsp;</span>
		</div>
	</div>
</template>
