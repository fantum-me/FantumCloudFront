<script lang="ts" setup>
import type DatabaseViewFilter from "~/types/database/DatabaseViewFilter";
import type TableField from "~/types/database/TableField";
import {isFilterTypeNeedValue} from "~/types/database/DatabaseViewFilterType";

const database = useDatabase()
const view = useDatabaseView()

callOnce(() => {
	if (!("filters" in view.value.settings)) view.value.settings.filters = []
})

const field = (filter: DatabaseViewFilter) => database.value.fields?.find(f => f.id === filter.field_id) as TableField
const active = (filter: DatabaseViewFilter) => {
	return filter.operation && (filter.value.trim() || !isFilterTypeNeedValue(filter.operation))
}
const display = (filter: DatabaseViewFilter) => {
	let text = field(filter).name
	if (active(filter)) {
		text += ": " + capitalize(filter.operation.replaceAll("_", " "))
		if (isFilterTypeNeedValue(filter.operation)) text += " " + filter.value
	}
	return text
}
</script>

<template>
	<div class="flex-start gap-2">
		<div v-for="(filter, i) in view.settings.filters" v-if="view.settings.filters" :key="filter.field_id">
			<DatabaseButtonEditFilter v-model="view.settings.filters[i]">
				<UButton :color="active(filter) ? 'primary' : 'gray'" :ui="{rounded: 'rounded-full'}"
				         :variant="active(filter) ? 'soft' : 'outline'" size="xs">
					{{ display(filter) }}
				</UButton>
			</DatabaseButtonEditFilter>
		</div>
		<DatabaseButtonNewFilter>
			<UButton color="gray" icon="i-heroicons-plus" size="xs" variant="ghost">
				New Filter
			</UButton>
		</DatabaseButtonNewFilter>
	</div>
</template>
