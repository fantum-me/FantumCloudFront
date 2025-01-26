<script lang="ts" setup>
import {getFieldIcon} from "~/types/database/TableFieldType";
import type TableField from "~/types/database/TableField";

const workspace = useWorkspace()
const database = useDatabase()
const fieldWidths = useState<Record<string, number>>("database-table-field-widths")

const headersRef = ref()
const draggingField = ref<TableField>()
const draggingBaseTranslate = ref<number>()
const draggingTargetPosition = ref<number>()
const draggingOffsetX = ref<number>()
const repositioning = ref<boolean>()

const lastTranslateUpdate = ref(new Date())
const fieldTranslates = ref<Record<string, number>>({})

async function calculateFieldTranslates() {
	const beforeDelay = new Date((new Date()).getTime() - 300);
	const animate = lastTranslateUpdate.value <= beforeDelay;
	lastTranslateUpdate.value = new Date()

	if (animate) repositioning.value = true

	const translates: Record<string, number> = {}
	let x = 0
	for (const f of database.value.fields ?? []) {
		translates[f.id] = x
		x += fieldWidths.value[f.id]
	}
	fieldTranslates.value = translates
	if (animate) await useWait(300)
	repositioning.value = false
}

watch(() => fieldWidths.value, calculateFieldTranslates, {immediate: true})
watch(() => database.value.fields, async () => {
	repositioning.value = true
	await calculateFieldTranslates()
	await useWait(500)
	repositioning.value = false
})

function onDragStart(e: DragEvent, field: TableField) {
	if (draggingField.value) e.preventDefault()
	else {
		draggingField.value = field
		draggingOffsetX.value = e.layerX
		draggingBaseTranslate.value = fieldTranslates.value[field.id]

		removeDragEventImage(e)
	}
}

function onDragOver(e: DragEvent, targetField: TableField) {
	if (!draggingField.value || !draggingOffsetX.value) return
	const rect = headersRef.value.getBoundingClientRect();
	fieldTranslates.value[draggingField.value.id] = e.clientX - rect.left + headersRef.value.scrollLeft - draggingOffsetX.value
	if (targetField !== draggingField.value) draggingTargetPosition.value = targetField.position
}

async function onDragEnd() {
	if (draggingField.value && draggingTargetPosition.value !== undefined) {
		const basePositon = draggingField.value.position
		repositionField(draggingField.value.id, draggingTargetPosition.value)
		draggingTargetPosition.value = undefined
		const res = await useApiFetch(
			`/workspaces/${workspace.value.id}/databases/${database.value.id}/fields/${draggingField.value.id}/reposition`,
			{
				method: "PATCH",
				body: JSON.stringify({position: draggingField.value.position})
			}
		)
		if (!res.ok) {
			repositionField(draggingField.value.id, basePositon)
			useErrorToast("Failed to change field position")
		}
	}
	draggingField.value = undefined
	draggingTargetPosition.value = undefined
	draggingBaseTranslate.value = undefined
	draggingOffsetX.value = undefined
	await calculateFieldTranslates()
}
</script>

<template>
	<div ref="headersRef" :style="{width: arraySum(Object.values(fieldWidths))}">
		<div v-for="field in database.fields" v-if="draggingField" :key="field.id" :style="{
				 width: fieldWidths[field.id] + 'px',
				 transform: `translateX(${field === draggingField ? draggingBaseTranslate : fieldTranslates[field.id]}px)`
			 }"
		     class="z-50 h-14 absolute" @dragover="e => onDragOver(e, field)"/>

		<div v-for="field in database.fields" :key="field.id"
		     :class="'cell h-14 flex-between absolute' + (repositioning ? ' transition-transform duration-300' : '')"
		     :style="{width: fieldWidths[field.id] + 'px',
		     transform: `translateX(${fieldTranslates[field.id]}px)`}">
			<span v-if="draggingField && field.position === draggingTargetPosition"
			      :class="(field.position > draggingField.position ? 'right-0 ' : '') + 'h-full w-1 bg-primary absolute'"/>
			<DatabaseButtonFieldHeader v-if="field" :field="field">
				<div class="flex-start gap-0.5 px-4 py-3.5 truncate"
				     draggable="true" @dragend="onDragEnd" @dragstart="e => onDragStart(e, field)">
					<component :is="getFieldIcon(field)" class="opacity-40 -mb-0.5 shrink-0"/>
					<span class="truncate text-gray-800 dark:text-gray-200">{{ field.name }}</span>
				</div>
			</DatabaseButtonFieldHeader>
			<DatabaseTableResizer v-model="fieldWidths[field.id]" :field="field"/>
		</div>
	</div>
</template>
