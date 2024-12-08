<script setup lang="ts">
import type TableRecord from "~/types/database/TableRecord";
import TableFieldType from "~/types/database/TableFieldType";

const workspace = useWorkspace()
const database = useDatabase()

async function createNewRecord() {
	if (!(database.value?.records)) return

	const res = await useApiFetch(
		`/workspaces/${workspace.value.id}/databases/${database.value.id}/records`,
		{method: "POST"}
	)

	if (res.ok) {
		const item: TableRecord = await res.json()
		database.value.records.push(item)
	} else useErrorToast(`Failed to create record`)
}

async function deleteRecord(id: string) {
	if (!(database.value?.records)) return

	const res = await useApiFetch(
		`/workspaces/${workspace.value.id}/databases/${database.value.id}/records/${id}`,
		{method: "DELETE"}
	)

	if (res.ok) database.value.records = database.value.records.filter(r => r.id !== id)
	else useErrorToast(`Failed to delete record`)
}
</script>

<template>
	<div class="w-full max-h-full px-10 pb-16 flex flex-col">
		<div class="flex-1 w-full overflow-scroll">
			<table class="w-full table-fixed">
				<thead class="bg-white sticky top-0 z-20">
				<tr>
					<th v-for="field in database.fields" :key="field.id"
					    :class="field.type === TableFieldType.BooleanType ? 'w-32' : 'w-40'">
						<DatabaseTableFieldHeader :id="field.id"/>
					</th>
					<th class="px-2.5 font-medium w-40">
						<DatabaseNewFieldPopover/>
					</th>
				</tr>
				</thead>
				<tbody>
				<tr v-for="record in database.records" :key="record.id" class="group">
					<td v-for="field in database.fields" :key="field.id">
						<DatabaseTableCell v-if="field.id in record.values" :record-id="record.id"
						                   :field-id="field.id"/>
					</td>
					<td>
						<div>
							<UButton icon="i-heroicons-trash" color="gray" variant="ghost"
							         @click="deleteRecord(record.id)"/>
						</div>
					</td>
				</tr>
				</tbody>
			</table>
		</div>
		<UButton color="gray" variant="databaseBottom" @click="createNewRecord" icon="i-heroicons-plus" class="w-full">
			New Element
		</UButton>
	</div>
</template>

<style scoped>
th, td {
	@apply relative;

	&::before {
		content: '';
		@apply absolute bottom-0 w-full h-px border-b group-last:border-b-0 border-gray-200 dark:border-gray-600 -left-px;
	}

	&::after {
		content: '';
		@apply absolute right-0 h-full border-r last:border-r-0 border-gray-200 dark:border-gray-600 block -top-px;
	}
}
</style>

