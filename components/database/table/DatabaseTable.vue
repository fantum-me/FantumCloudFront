<script lang="ts" setup>
import type DatabaseView from "~/types/database/DatabaseView";
import {DATABASE_TABLE_MIN_WIDTH} from "~/types/database/DatabaseViewType";

const {view} = defineProps<{ view: DatabaseView }>()

const database = useDatabase()
const colWidths = computed<Record<string, number>>(() => {
	const widths: Record<string, number> = {}
	database.value.fields?.forEach(f => {
		widths[f.id] = f.id in view.field_settings ? view.field_settings[f.id].width ?? DATABASE_TABLE_MIN_WIDTH : DATABASE_TABLE_MIN_WIDTH
	})
	return widths
})
</script>

<template>
	<div class="flex-1 w-full overflow-x-scroll">
		<div class="table w-full">
			<div class="row bg-white dark:bg-gray-900 sticky top-0 z-20">
				<div v-for="field in database.fields" :key="field.id" :style="{width: colWidths[field.id] + 'px'}"
				     class="cell relative flex-between">
					<DatabaseTableFieldHeader :id="field.id" :view="view" :width="colWidths[field.id]"/>
					<DatabaseTableResizer v-model="colWidths[field.id]" :field="field" :view="view"/>
				</div>
				<div class="cell flex-start pl-2.5 font-medium w-40">
					<DatabaseButtonNewField>
						<UButton class="aspect-square h-8 w-8 flex-center" color="gray" icon="i-heroicons-plus"
						         variant="soft"/>
					</DatabaseButtonNewField>
				</div>
			</div>
			<div v-for="record in database.records" :key="record.id" class="row group">
				<div v-for="field in database.fields" :key="field.id" :style="{width: colWidths[field.id] + 'px'}"
				     class="cell">
					<DatabaseValue v-if="field.id in record.values" :field-id="field.id" :record-id="record.id" :width="colWidths[field.id]"/>
				</div>
				<div class="cell flex-start pl-2.5 w-40">
					<DatabaseButtonDeleteRecord :id="record.id">
						<UButton color="gray" icon="i-heroicons-trash" variant="ghost"/>
					</DatabaseButtonDeleteRecord>
				</div>
			</div>
		</div>
	</div>
	<DatabaseButtonNewRecord>
		<UButton :style="{width: arraySum(Object.values(colWidths)) + 160 + 'px'}" color="gray" icon="i-heroicons-plus"
		         variant="databaseBottom">
			New Element
		</UButton>
	</DatabaseButtonNewRecord>
</template>

<style scoped>
.table {
	.row {
		@apply flex;

		&:last-child .cell {
			border-bottom-color: transparent;
		}
	}

	.cell {
		@apply border-b border-r last:border-r-0 border-gray-200 dark:border-gray-700;
	}
}
</style>

