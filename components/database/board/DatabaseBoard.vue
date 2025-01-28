<script lang="ts" setup>
import type TableRecord from "~/types/database/TableRecord";
import TableFieldType from "~/types/database/TableFieldType";
import type {BadgeColor} from "#ui/types";
import {useMouse} from "@vueuse/core";
import type TableField from "~/types/database/TableField";
import {DatabaseModalEditRecord} from "#components";

type BoardOption = {
	value: string,
	label: string,
	color: BadgeColor,
}

const records = defineModel<TableRecord[]>({required: true})

const modal = useModal()
const {x: mouseX, y: mouseY} = useMouse()

const workspace = useWorkspace()
const database = useDatabase()
const view = useDatabaseView()

const titleField = computed(() => database.value.fields?.find(f => f.is_title) as TableField)
const targetField = computed(() => getDatabaseViewTargetField(view.value))
const noValueRecords = computed(() => records.value.filter(r => targetField.value ? !r.values[targetField.value.id] : false))
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
				if (targetField.value.options) {
					for (const [option, color] of Object.entries(targetField.value.options)) {
						res.push({label: option, value: option, color})
					}
				}
				return res
		}
	}
	return []
})

const editRecord = (record: TableRecord) => modal.open(DatabaseModalEditRecord, {record})

const draggingRecord = ref<TableRecord | undefined>()
const draggingTarget = ref<string | undefined>()

function onDragStart(e: DragEvent, record: TableRecord) {
	if (!targetField.value) return
	draggingRecord.value = record
	removeDragEventImage(e)
}

function onDragEnter(targetValue: string) {
	draggingTarget.value = targetValue
}

async function onDragEnd() {
	await useWait(50)
	draggingRecord.value = undefined
	draggingTarget.value = undefined
}

async function onDrop(targetValue: string) {
	if (!targetField.value || !draggingRecord.value) return
	const record = draggingRecord.value
	draggingRecord.value = undefined

	const defaultValue = record.values[targetField.value.id]
	record.values[targetField.value.id] = targetValue

	const res = await useApiFetch(
		`/workspaces/${workspace.value.id}/databases/${database.value.id}/fields/${targetField.value.id}/records/${record.id}`,
		{
			method: "PATCH",
			body: JSON.stringify({value: record.values[targetField.value.id]}),
		}
	)

	if (!res.ok) {
		record.values[targetField.value.id] = defaultValue
		useErrorToast("Failed to update value")
	}
}
</script>

<template>
	<div v-if="targetField" class="w-full">
		<div class="flex justify-end">
			<UPopover v-if="noValueRecords.length" class="mr-2">
				<UButton :color="draggingRecord && draggingTarget === '' ? 'primary' : 'gray'" variant="ghost"
				         @drop.prevent="onDrop('')" @dragover.prevent
				         @dragenter.prevent="onDragEnter('')">
					No Value ({{ noValueRecords.length }})
				</UButton>

				<template #panel>
					<div class="p-1 space-y-1">
						<div v-for="record in noValueRecords" :key="record.id" class="w-full rounded px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700/50"
						     draggable="true" @click="editRecord(record)" @dragend="onDragEnd"
						     @dragstart="e => onDragStart(e, record)">
							{{ record.values[titleField.id] ? record.values[titleField.id] : "New Item" }}
						</div>
					</div>
				</template>
			</UPopover>
		</div>
		<div class="flex gap-4 mt-6">
			<Teleport to="body">
				<div v-if="draggingRecord" :style="{transform: `translate(${mouseX + 3}px, ${mouseY + 3}px)`}"
				     class="fixed top-0 left-0 z-20">
					<DatabaseBoardRecord :record="draggingRecord" :title-field-id="titleField.id"/>
				</div>
			</Teleport>

			<div v-for="option in options" class="relative w-56 bg-gray-100/50 dark:bg-gray-700/30 rounded-lg shrink-0 overflow-hidden" @drop.prevent="onDrop(option.value)"
			     @dragover.prevent
			     @dragenter.prevent="onDragEnter(option.value)">
				<div v-if="draggingRecord" :class="{
					'absolute top-0 left-0 w-full h-full bg-primary-500 z-10 transition-opacity opacity-0': true,
					'opacity-10': draggingTarget === option.value
				}"/>

				<div class="px-4 py-2 flex-start gap-1.5 opacity-80">
					<span :class="`h-2 w-2 mt-0.5 rounded-full bg-${option.color}-500`"/>
					<span class="text-sm font-semibold">{{ option.label }}</span>
				</div>
				<UDivider class="opacity-50"/>
				<div class="p-3">
					<div v-for="record in records.filter(r => targetField && r.values[targetField.id] === option.value)"
					     :key="record.id" draggable="true" @click="editRecord(record)" @dragend="onDragEnd"
					     @dragstart="e => onDragStart(e, record)">
						<DatabaseBoardRecord v-if="record !== draggingRecord" :record="record"
						                     :title-field-id="titleField.id"/>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div v-else class="flex-center w-full pt-16">
		<Loader/>
	</div>
</template>
