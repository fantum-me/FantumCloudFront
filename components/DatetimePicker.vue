<script lang="ts" setup>
import {DatePicker} from "v-calendar";
import 'v-calendar/dist/style.css'

const colorMode = useColorMode()

const newValue = defineModel<string>()
const {allowRange = false} = defineProps<{ allowRange?: boolean }>()

const date = ref<Date>(newValue.value ? new Date(newValue.value) : getTodayNoon())
const range = ref({
	start: newValue.value ? new Date(newValue.value.split(",")[0]) : date.value,
	end: newValue.value ? new Date(newValue.value.split(",")[1]) : getTheNextDay(date.value)
});

const isRange = ref<boolean>(!!newValue.value && newValue.value.includes(","))
watch(() => isRange.value, (newValue) => {
	if (newValue) {
		range.value = {
			start: date.value,
			end: getTheNextDay(date.value)
		}
	} else date.value = range.value.start
	onUpdate()
})

console.log(newValue.value)
const includeTime = ref<boolean>(!!newValue.value && newValue.value.includes("T"))
watch(() => includeTime.value, () => onUpdate())

function onUpdate(newDate: Date | { start: Date, end: Date } | undefined = undefined): void {
	if (newDate === undefined) newDate = isRange.value ? range.value : date.value
	if (isRange.value && "start" in newDate) {
		let start = includeTime.value ? newDate.start.toJSON() : newDate.start.toJSON().split('T')[0]
		let end = includeTime.value ? newDate.end.toJSON() : newDate.end.toJSON().split('T')[0]
		newValue.value = start + "," + end
	} else if (newDate instanceof Date) {
		newValue.value = includeTime.value ? newDate.toJSON() : newDate.toJSON().split('T')[0]
	}
}
</script>

<template>
	<div class="w-full px-3.5">
		<div class="p-2 space-y-1">
			<div class="flex-between select-none">
				<p>Include Time</p>
				<UToggle v-model="includeTime"/>
			</div>
			<div v-if="allowRange" class="flex-between select-none">
				<p>End date</p>
				<UToggle v-model="isRange"/>
			</div>
		</div>
		<UDivider class="opacity-50 my-2"/>
	</div>

	<DatePicker v-if="allowRange && isRange" v-model.range="range" :is-dark="colorMode.value === 'dark'" :mode="includeTime ? 'dateTime' : 'date'"
	            borderless is24hr title-position="left" transparent trim-weeks
	            @update:modelValue="onUpdate"/>
	<DatePicker v-else v-model="date" :is-dark="colorMode.value === 'dark'" :mode="includeTime ? 'dateTime' : 'date'"
	            borderless is24hr title-position="left" transparent trim-weeks @update:modelValue="onUpdate"/>
</template>

<!--suppress CssUnresolvedCustomProperty -->
<style>
:root {
	--vc-gray-50: rgb(var(--color-gray-50));
	--vc-gray-100: rgb(var(--color-gray-100));
	--vc-gray-200: rgb(var(--color-gray-200));
	--vc-gray-300: rgb(var(--color-gray-300));
	--vc-gray-400: rgb(var(--color-gray-400));
	--vc-gray-500: rgb(var(--color-gray-500));
	--vc-gray-600: rgb(var(--color-gray-600));
	--vc-gray-700: rgb(var(--color-gray-700));
	--vc-gray-800: rgb(var(--color-gray-800));
	--vc-gray-900: rgb(var(--color-gray-900));
}

.vc-primary {
	--vc-accent-50: rgb(var(--color-primary-50));
	--vc-accent-100: rgb(var(--color-primary-100));
	--vc-accent-200: rgb(var(--color-primary-200));
	--vc-accent-300: rgb(var(--color-primary-300));
	--vc-accent-400: rgb(var(--color-primary-400));
	--vc-accent-500: rgb(var(--color-primary-500));
	--vc-accent-600: rgb(var(--color-primary-600));
	--vc-accent-700: rgb(var(--color-primary-700));
	--vc-accent-800: rgb(var(--color-primary-800));
	--vc-accent-900: rgb(var(--color-primary-900));
}
</style>
