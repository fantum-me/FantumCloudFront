<script lang="ts" setup>
import type TableRecord from "~/types/database/TableRecord";
import TableFieldType from "~/types/database/TableFieldType";
import type TableField from "~/types/database/TableField";

const records = defineModel<TableRecord[]>({required: true})

const database = useDatabase()
const titleField = computed(() => database.value.fields?.find(f => f.is_title))

const targetField = ref(database.value.fields?.find(f => f.type === TableFieldType.DatetimeType) as TableField)
const date = ref(new Date());

const calendar = ref()
const width = ref(0)

const weeks = computed(() => calculateWeeks(date.value, records.value, targetField.value))

const prevMonth = () => date.value = new Date(date.value.setMonth(date.value.getMonth() - 1))
const nextMonth = () => date.value = new Date(date.value.setMonth(date.value.getMonth() + 1))
const calculateWidths = () => width.value = calendar.value.clientWidth

onMounted(() => {
	calculateWidths();
	window.addEventListener("resize", calculateWidths)
})
onUnmounted(() => window.removeEventListener("resize", calculateWidths))
</script>

<template>
	<div class="overflow-hidden flex flex-col">
		<div class="flex-center gap-2 mb-4">
			<UButton color="gray" icon="i-heroicons-chevron-left" variant="ghost" @click="prevMonth"/>
			<p class="text-lg font-semibold">
				{{
					date.toLocaleDateString('default', {
						year: 'numeric',
						month: 'long'
					})
				}}
			</p>
			<UButton color="gray" icon="i-heroicons-chevron-right" variant="ghost" @click="nextMonth"/>
		</div>
		<div v-if="targetField && titleField" ref="calendar" class="flex-1 overflow-y-scroll calendar">
			<div v-for="week in weeks" v-if="calendar" :key="JSON.stringify(week)" :style="{
				height: (Math.max(...week.events.map(e => e.position)) + 2) * 32 + 'px'
			}" class="week relative">
				<div v-for="day in week.days" :key="day.toJSON()" :class="{
						'day': true,
						'today' : areSameDay(day, new Date()),
						'outside-of-month': day.getMonth() !== date.getMonth()
					}">
					<div class="h-8 flex-start pl-2">
						<span class="date-number">{{ day.getDate() }}</span>
					</div>
				</div>
				<div v-for="event in week.events" :style="{
					marginTop: (event.position + 1) * 32 + 'px',
					marginLeft: event.startIndex * (width / 7) + 'px',
					width: (event.endIndex - event.startIndex + 1) * (width / 7) + 'px'
				}" class="absolute h-6 z-10 flex-start">
					<div :class="{
						'w-full h-full bg-gray-200 dark:bg-gray-600 px-2': true,
						'rounded-l-lg ml-1.5': event.isStart,
						'rounded-r-lg mr-1.5': event.isEnd
					}">
						<p>{{ event.record.values[titleField.id] ?? 'Unnamed' }}</p>
					</div>
				</div>
			</div>
		</div>
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
		@apply w-full bg-white dark:bg-gray-800;

		&.outside-of-month {
			@apply bg-gray-100 dark:bg-gray-900 text-gray-400;
		}

		&.today .date-number {
			@apply text-red-500 font-bold;
		}
	}
}
</style>
