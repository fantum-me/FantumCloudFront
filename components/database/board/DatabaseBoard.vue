<script lang="ts" setup>
import type TableRecord from "~/types/database/TableRecord";
import TableFieldType from "~/types/database/TableFieldType";
import type {BadgeColor} from "#ui/types";
import {useMouse} from "@vueuse/core";

type BoardOption = {
	value: string,
	label: string,
	color: BadgeColor,
}

const records = defineModel<TableRecord[]>({required: true})

const {x: mouseX, y: mouseY} = useMouse()
const workspace = useWorkspace()
const database = useDatabase()
const view = useDatabaseView()

const targetField = computed(() => getDatabaseViewTargetField(view.value))
const options = computed<BoardOption[]>(() => {
	if (targetField.value) {
		switch (targetField.value.type) {
			case TableFieldType.BooleanType:
				return [
					{label: "Checked", value: "true", color: "gray"},
					{label: "Unchecked", value: "false", color: "gray"}
				]
			case TableFieldType.MultiselectType:
			case TableFieldType.SelectType:
				const res: BoardOption[] = []
				console.log(targetField.value.options)
				if (targetField.value.options) {
					for (const [option, color] of Object.entries(targetField.value.options)) {
						console.log(option, color)
						res.push({label: option, value: option, color})
					}
				}
				return res
		}
	}
	return []
})

const draggingRecord = ref<TableRecord | undefined>()
const draggingElement = ref<HTMLDivElement | undefined>()
const draggingDefaultValue = ref<string | undefined>()

function onDragStart(e: DragEvent, record: TableRecord) {
	if (!targetField.value) return
	draggingElement.value = e.currentTarget as HTMLDivElement
	draggingElement.value.style.width = draggingElement.value.clientWidth + 'px'

	draggingRecord.value = record
	draggingDefaultValue.value = record.values[targetField.value.id]
	removeDragEventImage(e)
}

function onDragOver(option: BoardOption) {
	if (!targetField.value || !draggingRecord.value) return
	draggingRecord.value.values[targetField.value.id] = option.value
}

async function onDragEnd() {
	if (!targetField.value || !draggingRecord.value || !draggingDefaultValue.value || !draggingElement.value) return
	draggingElement.value.style.transform = ""
	draggingElement.value.style.width = ""

	const record = draggingRecord.value
	draggingRecord.value = undefined

	const res = await useApiFetch(
		`/workspaces/${workspace.value.id}/databases/${database.value.id}/fields/${targetField.value.id}/records/${record.id}`,
		{
			method: "PATCH",
			body: JSON.stringify({value: record.values[targetField.value.id]}),
		}
	)

	if (!res.ok) {
		record.values[targetField.value.id] = draggingDefaultValue.value
		useErrorToast("Failed to update value")
	}
	draggingDefaultValue.value = undefined
}
</script>

<template>
	<div v-if="targetField" class="w-full">
		<div class="flex gap-4 mt-6">
			<Teleport to="body">
				<div v-if="draggingRecord" :style="{transform: `translate(${mouseX + 3}px, ${mouseY + 3}px)`}"
				     class="fixed top-0 left-0 z-20">
					<DatabaseBoardRecord :record="draggingRecord"/>
				</div>
			</Teleport>

			<div v-for="option in options" class="relative w-56 bg-gray-100/50 dark:bg-gray-700/30 rounded-lg shrink-0 overflow-hidden"
			     @dragover="onDragOver(option)">
				<div v-if="draggingRecord && draggingRecord?.values[targetField.id] === option.value"
				     class="absolute top-0 left-0 w-full h-full bg-primary opacity-10 z-10"/>

				<div class="px-4 py-2 flex-start gap-1.5 opacity-80">
					<span :class="`h-2 w-2 mt-0.5 rounded-full bg-${option.color}-500`"/>
					<span class="text-sm font-semibold">{{ option.label }}</span>
				</div>
				<UDivider class="opacity-50"/>
				<div class="p-3">
					<div v-for="record in records.filter(r => targetField && r.values[targetField.id] === option.value)"
					     :key="record.id" draggable="true" @dragend="onDragEnd"
					     @dragstart="e => onDragStart(e, record)">
						<DatabaseBoardRecord v-if="record !== draggingRecord" :record="record"/>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div v-else class="flex-center w-full pt-16">
		<Loader/>
	</div>
</template>
