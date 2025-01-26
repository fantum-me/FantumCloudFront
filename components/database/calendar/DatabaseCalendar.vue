<script lang="ts" setup>
import type TableRecord from "~/types/database/TableRecord";
import TableFieldType from "~/types/database/TableFieldType";
import type TableField from "~/types/database/TableField";
import {DatabaseModalEditRecord} from "#components";
import {calculateDayDifference} from "~/utils/datetime";

const records = defineModel<TableRecord[]>({required: true})

const modal = useModal()

const workspace = useWorkspace()
const database = useDatabase()
const titleField = computed(() => database.value.fields?.find(f => f.is_title) as TableField)

const targetField = computed(() => database.value.fields?.find(f => f.type === TableFieldType.DatetimeType))
const date = ref(new Date());
const noDateRecords = computed(() => records.value.filter(r => targetField.value ? !r.values[targetField.value.id] : false))

const isLoading = ref(false)
const calendar = ref()
const width = ref(0)

const weeks = computed(() => targetField.value ? calculateWeeks(date.value, records.value, targetField.value) : [])

const editRecord = (record: TableRecord) => modal.open(DatabaseModalEditRecord, {record})

const prevMonth = () => date.value = new Date(date.value.setMonth(date.value.getMonth() - 1))
const nextMonth = () => date.value = new Date(date.value.setMonth(date.value.getMonth() + 1))
const calculateWidths = () => calendar.value ? width.value = calendar.value.clientWidth : undefined

async function createDatetimeField() {
	isLoading.value = true
	const res = await useApiFetch(`/workspaces/${workspace.value.id}/databases/${database.value.id}/fields`, {
		method: "POST",
		body: JSON.stringify({name: "Date", type: TableFieldType.DatetimeType})
	})
	if (!res.ok) useErrorToast("Failed to create datetime field")
	isLoading.value = false
}

onMounted(() => {
	if (targetField.value) calculateWidths()
	else createDatetimeField()
	window.addEventListener("resize", calculateWidths)
})
onUnmounted(() => window.removeEventListener("resize", calculateWidths))

const draggingRecord = ref<TableRecord | undefined>()
const draggingDefaultValue = ref<string | undefined>()

function onDragStart(e: DragEvent, record: TableRecord) {
	if (!targetField.value) return
	draggingRecord.value = record
	draggingDefaultValue.value = record.values[targetField.value.id]
	removeDragEventImage(e)
}

function onDragOver(day: Date) {
	const oneDay = 24 * 60 * 60 * 1000
	if (targetField.value && draggingRecord.value) {
		const dates = draggingRecord.value.values[targetField.value.id].split(",")
		if (areSameDay(day, new Date(dates[0]))) return
		const includeTime = dates[0].includes('T')
		const dayDiff = calculateDayDifference(day, new Date(dates[0]))

		for (let i = 0; i < dates.length; i++) {
			const date = new Date(new Date(dates[i]).getTime() - (dayDiff * oneDay))
			dates[i] = includeTime ? date.toJSON() : date.toJSON().split('T')[0]
		}

		draggingRecord.value.values[targetField.value.id] = dates.join(",")
	}
}

async function onDragEnd() {
	if (!targetField.value || !draggingRecord.value || !draggingDefaultValue.value) return
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
	<div v-if="targetField" class="overflow-hidden flex flex-col">
		<div class="flex-between mb-1">
			<p class="text-sm font-medium">
				{{ capitalize(date.toLocaleDateString('default', {year: 'numeric', month: 'long'})) }}
			</p>
			<div class="flex-center select-none">
				<UPopover v-if="noDateRecords.length" class="mr-2">
					<UButton color="gray" variant="ghost">No date ({{ noDateRecords.length }})</UButton>

					<template #panel>
						<div class="p-1 space-y-1">
							<UButton v-for="record in noDateRecords" :key="record.id" block
							         class="justify-start" color="gray" variant="ghost" @click="editRecord(record)">
								{{ record.values[titleField.id] ? record.values[titleField.id] : "New Item" }}
							</UButton>
						</div>
					</template>
				</UPopover>
				<UButton color="gray" icon="i-heroicons-chevron-left-16-solid" size="2xs" variant="ghost"
				         @click="prevMonth"/>
				<UButton class="text-sm" color="gray" size="2xs" variant="ghost" @click="date = new Date()">Today
				</UButton>
				<UButton color="gray" icon="i-heroicons-chevron-right-16-solid" size="2xs" variant="ghost"
				         @click="nextMonth"/>
			</div>
		</div>
		<div v-if="calendar" class="flex-center my-0.5">
			<div v-for="day in weeks[0].days" class="flex-1 text-center text-xs opacity-40">
				{{ day.toLocaleDateString('default', {weekday: 'short'}) }}
			</div>
		</div>
		<div ref="calendar" class="flex-1 overflow-y-scroll calendar">
			<div v-for="week in weeks" v-if="calendar" :key="JSON.stringify(week)" :style="{
				height: (Math.max(...week.events.map(e => e.position)) + 2) * 32 + 'px'
			}" class="week relative">
				<div v-for="day in week.days" :key="day.toJSON()" :class="{
						'day': true,
						'today' : areSameDay(day, new Date()),
						'outside-of-month': day.getMonth() !== date.getMonth()
					}" @dragover="onDragOver(day)">
					<div class="h-8 flex-start pl-2">
						<span class="date-number">{{ day.getDate() }}</span>
					</div>
				</div>
				<div v-for="event in week.events" :style="{
						 marginTop: (event.position + 1) * 32 + 'px',
						 marginLeft: event.startIndex * (width / 7) + 'px',
						 width: (event.endIndex - event.startIndex + 1) * (width / 7) + 'px'
					 }"
				     class="absolute h-6 z-10 flex-start cursor-pointer event" draggable="true" @click="editRecord(event.record)"
				     @dragend="onDragEnd" @dragstart="e => onDragStart(e, event.record)">
					<div :class="{
						'w-full h-full bg-gray-200 dark:bg-gray-600 px-2': true,
						'rounded-l-lg ml-1.5': event.isStart,
						'rounded-r-lg mr-1.5': event.isEnd,
						'dragging': draggingRecord === event.record
					}">
						<p class="truncate">
							{{ event.record.values[titleField.id] ? event.record.values[titleField.id] : "New Item" }}
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div v-else-if="isLoading" class="flex-center w-full pt-16">
		<Loader/>
	</div>
	<div v-else class="w-full flex-center flex-col pt-12 gap-6">
		<h1 class="text-3xl font-semibold">Datetime field missing !</h1>
		<p>To display your database as a calendar, a datatime field is neeeded.
			<br>Please reload the page or click on the button bellow to create one.</p>
		<UButton @click="createDatetimeField">Create datetime field</UButton>
	</div>
</template>

<style scoped>
.calendar {
	@apply divide-y divide-gray-300 dark:divide-gray-500;
	@apply border border-gray-300 dark:border-gray-500;

	.week {
		@apply flex divide-x divide-gray-300 dark:divide-gray-500 min-h-32;
	}

	.day {
		@apply w-full bg-white dark:bg-gray-800 select-none;

		&.outside-of-month {
			@apply bg-gray-100 dark:bg-gray-900 text-gray-400;
		}

		&.today .date-number {
			@apply text-red-500 font-bold;
		}

	}

	.event {
		border: 0 !important;

		.dragging {
			@apply bg-primary-color-100 dark:bg-primary-color-800
		}
	}
}
</style>
