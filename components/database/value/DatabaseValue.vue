<script lang="ts" setup>
import TableFieldType from "~/types/database/TableFieldType";
import type TableField from "~/types/database/TableField";

const value = defineModel<string>()
const {field, placeholder = "", small = false} = defineProps<{
	field: TableField,
	placeholder?: string,
	small?: boolean
}>()

const cellRef = ref()

function startEditing() {
	if (field.type === TableFieldType.BooleanType) return
	useState("database-value-editing-target").value = {
		field: field,
		width: cellRef.value.parentNode.clientWidth,
		currentValue: value,
		update: (v: string) => value.value = v,
		small: small,
		position: {
			x: cellRef.value.getBoundingClientRect().left,
			y: cellRef.value.getBoundingClientRect().top
		}
	}
}
</script>

<template>
	<div v-if="field" ref="cellRef" class="h-full w-full relative" @click="startEditing">
		<DatabaseValueBoolean v-if="field.type === TableFieldType.BooleanType" v-model="value" :small="small"/>
		<DatabaseValueSelect v-else-if="field.type === TableFieldType.SelectType"
		                     :field="field" :small="small" :value="value as string"/>

		<div v-else :class="(small ? 'text-sm' : 'mx-4 py-3') + ' break-all text-wrap'">
			<span class="select-none">&nbsp;</span>

			<span v-if="value">{{ value }}</span>
			<span v-else-if="placeholder" class="text-gray-400 dark:text-gray-600 select-none">
				{{ placeholder }}
			</span>
		</div>
	</div>
</template>
