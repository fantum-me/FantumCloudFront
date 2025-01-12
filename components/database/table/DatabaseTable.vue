<script lang="ts" setup>
import {DATABASE_TABLE_MIN_WIDTH} from "~/types/database/DatabaseViewType";
import type TableRecord from "~/types/database/TableRecord";

const {records} = defineProps<{ records: TableRecord[] }>()

const database = useDatabase()
const view = useDatabaseView()

const fieldWidths = useState("database-table-field-widths").value = computed<Record<string, number>>(() => {
	const widths: Record<string, number> = {}
	for (const f of database.value.fields ?? []) {
		widths[f.id] = view.value.settings.widths && f.id in view.value.settings.widths
			? view.value.settings.widths[f.id]
			: DATABASE_TABLE_MIN_WIDTH
	}
	return widths
})
</script>

<template>
	<div class="flex-1 w-full overflow-x-scroll">
		<div class="table w-full">
			<div class="row bg-white dark:bg-gray-900 sticky top-0 z-20 h-14">
				<DatabaseTableFieldHeaders/>
				<div :style="{transform: `translateX(${arraySum(Object.values(fieldWidths))}px)`}"
				     class="absolute h-full flex-start pl-2.5 font-medium w-40">
					<DatabaseButtonNewField>
						<UButton class="aspect-square h-8 w-8 flex-center" color="gray" icon="i-heroicons-plus"
						         variant="soft"/>
					</DatabaseButtonNewField>
				</div>
			</div>
			<div v-for="record in records" :key="record.id" class="row group">
				<div v-for="field in database.fields" :key="field.id" :style="{width: fieldWidths[field.id] + 'px'}"
				     class="cell">
					<DatabaseRecordValue :field="field" :record="record"/>
				</div>
				<div class="cell flex-start pl-2.5 w-40">
					<DatabaseButtonDeleteRecord :id="record.id">
						<UButton color="gray" icon="i-heroicons-trash" variant="ghost"/>
					</DatabaseButtonDeleteRecord>
				</div>
			</div>
		</div>
		<DatabaseButtonNewRecord>
			<UButton class="w-full" color="gray" icon="i-heroicons-plus" variant="databaseBottom">
				New Element
			</UButton>
		</DatabaseButtonNewRecord>
	</div>
</template>

<style scoped>
.table {
	.row {
		@apply flex;
		@apply border-b border-gray-200 dark:border-gray-700;
		@apply divide-x first:divide-x-0 divide-gray-200 dark:divide-gray-700;

		&:last-child .cell {
			border-bottom-color: transparent;
		}
	}
}
</style>
