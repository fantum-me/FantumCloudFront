<script lang="ts" setup>
import type TableRecord from "~/types/database/TableRecord";
import type TableField from "~/types/database/TableField";
import {DatabaseModalEditRecord} from "#components";

const records = defineModel<TableRecord[]>({required: true})

const modal = useModal()

const workspace = useWorkspace()
const database = useDatabase()
const view = useDatabaseView()
const titleField = computed(() => database.value.fields?.find(f => f.is_title) as TableField)

const targetField = computed(() => getDatabaseViewTargetField(view.value))
const date = ref(new Date());
const noDateRecords = computed(() => records.value.filter(r => targetField.value ? !r.values[targetField.value.id] : false))

const calendar = ref()
const width = ref(0)

const weeks = computed(() => targetField.value ? calculateWeeks(date.value, records.value, targetField.value) : [])

const editRecord = (record: TableRecord) => modal.open(DatabaseModalEditRecord, {record})

const prevMonth = () => date.value = new Date(date.value.setMonth(date.value.getMonth() - 1))
const nextMonth = () => date.value = new Date(date.value.setMonth(date.value.getMonth() + 1))
const calculateWidths = () => calendar.value ? width.value = calendar.value.clientWidth : undefined

watch(() => calendar.value, calculateWidths)
onMounted(() => {
	if (targetField.value) calculateWidths()
	window.addEventListener("resize", calculateWidths)
})
onUnmounted(() => window.removeEventListener("resize", calculateWidths))

const draggingRecord = ref<TableRecord | undefined>()
const draggingTarget = ref<Date | undefined>()

function onDragStart(e: DragEvent, record: TableRecord) {
	if (!targetField.value) return
	draggingRecord.value = record
	removeDragEventImage(e)
}

function onDragEnter(targetValue?: Date) {
	draggingTarget.value = targetValue
}

async function onDragEnd() {
	await useWait(150)
	draggingRecord.value = undefined
	draggingTarget.value = undefined
}

function calculateTargetValue(day?: Date): string {
	console.log(targetField.value, draggingRecord.value, day)
	if (!targetField.value || !draggingRecord.value) return ""
	if (!day) return "";

	const val = draggingRecord.value.values[targetField.value.id]
	if (!val) return new Date(day.getTime() + 24 * 60 * 60 * 1000).toJSON().split('T')[0]

	const dates = val.split(",")
	if (!areSameDay(day, new Date(dates[0]))) {
		const includeTime = dates[0].includes('T')
		const dayDiff = calculateDayDifference(day, new Date(dates[0]))

		console.log(dates, day, dayDiff)

		for (let i = 0; i < dates.length; i++) {
			const date = new Date(new Date(dates[i]).getTime() - (dayDiff * 24 * 60 * 60 * 1000))
			dates[i] = includeTime ? date.toJSON() : date.toJSON().split('T')[0]
		}
	}
	return dates.join(",")
}

async function onDrop(day?: Date) {
	if (!targetField.value || !draggingRecord.value) return

	const record = draggingRecord.value
	const defaultValue = record.values[targetField.value.id]
	record.values[targetField.value.id] = calculateTargetValue(day)
	draggingRecord.value = undefined

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
	<div v-if="targetField" class="overflow-hidden flex flex-col">
		<div class="flex-between mb-1">
			<p class="text-sm font-medium">
				{{ capitalize(date.toLocaleDateString('default', {year: 'numeric', month: 'long'})) }}
			</p>
			<div class="flex-center select-none">
				<UPopover v-if="noDateRecords.length" class="mr-2">
					<UButton :color="draggingRecord && !draggingTarget ? 'primary' : 'gray'" variant="ghost"
					         @drop.prevent="onDrop()" @dragover.prevent
					         @dragenter.prevent="onDragEnter()">
						No date ({{ noDateRecords.length }})
					</UButton>

					<template #panel>
						<div class="p-1 space-y-1">
							<div v-for="record in noDateRecords" :key="record.id" class="w-full rounded px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700/50"
							     draggable="true" @click="editRecord(record)" @dragend="onDragEnd"
							     @dragstart="e => onDragStart(e, record)">
								{{ record.values[titleField.id] ? record.values[titleField.id] : "New Item" }}
							</div>
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
						'relative day': true,
						'today' : areSameDay(day, new Date()),
						'outside-of-month': day.getMonth() !== date.getMonth()
					}" @dragover.prevent @drop.prevent="onDrop(day)" @dragenter.prevent="onDragEnter(day)">
					<div v-if="draggingRecord" :class="{
						'absolute top-0 left-0 w-full h-full bg-primary-500 z-10 transition-opacity opacity-0': true,
						'opacity-10': draggingTarget === day
					}"/>
					<div class="h-8 flex-start pl-2">
						<span class="date-number">{{ day.getDate() }}</span>
					</div>
				</div>
				<div v-for="event in week.events" :style="{
						 marginTop: (event.position + 1) * 32 + 'px',
						 marginLeft: event.startIndex * (width / 7) + 'px',
						 width: (event.endIndex - event.startIndex + 1) * (width / 7) + 'px'
					 }" class="absolute h-6 z-10 flex-start cursor-pointer event" draggable="true" @click="editRecord(event.record)"
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
	<div v-else class="flex-center w-full pt-16">
		<Loader/>
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
