<script lang="ts" setup>
import TableFieldType from "~/types/database/TableFieldType";

const {recordId, fieldId, width} = defineProps<{
	recordId: string,
	fieldId: string,
	width: number,
}>()

const database = useDatabase()

const record = computed(() => database.value.records?.find(r => r.id === recordId))
const field = computed(() => database.value.fields?.find(f => f.id === fieldId))

const cellRef = ref()

function startEditing() {
	if (field.value?.type === TableFieldType.BooleanType) return
	console.log("aaa")
	useState("database-value-editing-target").value = {
		recordId: recordId,
		fieldId: fieldId,
		width: width,
		position: {
			x: cellRef.value.getBoundingClientRect().left,
			y: cellRef.value.getBoundingClientRect().top
		}
	}
}
</script>

<template>
	<div v-if="record && field" ref="cellRef" class="h-full w-full" @click="startEditing">
		<DatabaseValueBoolean v-if="field.type === TableFieldType.BooleanType" :field="field" :record="record"/>
		<DatabaseValueSelect v-else-if="field.type === TableFieldType.SelectType" :field="field" :record="record"/>

		<div v-else class="mx-4 py-3 break-all text-wrap">
			{{ record?.values[field.id] }}<span class="select-none">&nbsp;</span>
		</div>
	</div>
</template>
