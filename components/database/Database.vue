<script lang="ts" setup>
import type {Ref} from "vue";
import {EventSourcePolyfill} from "event-source-polyfill";
import DatabaseViewType, {getViewTypeIcon} from "~/types/database/DatabaseViewType";
import type Database from "~/types/database/Database";
import type TableField from "~/types/database/TableField";
import type {DatabaseUpdateTypes} from "~/types/database/DatabaseUpdateType";
import type TableRecord from "~/types/database/TableRecord";
import type DatabaseView from "~/types/database/DatabaseView";
import {isFilterTypeNeedValue} from "~/types/database/DatabaseViewFilterType";
import {DatabaseModalEditRecord} from "#components";

const {id} = defineProps({id: String})

const status: Ref<"loaded" | "loading" | "failed"> = ref("loading");
const database = useDatabase()
const workspace = useWorkspace()
const modal = useModal()

const selectedView = useDatabaseView()
const creatingRecord = ref(false)
const isOptionBarOpen = ref(false)
const hasActiveFilter = computed(() => {
	if (!selectedView.value.settings.filters) return false
	for (const filter of selectedView.value.settings.filters) {
		if (filter.operation && (filter.value.trim() || !isFilterTypeNeedValue(filter.operation))) return true
	}
	return false
})

const eventSourceRef: Ref<EventSourcePolyfill | null> = ref(null);

onMounted(async () => {
	await fetchDatabase()
	useRefreshView().value = fetchDatabase
	subscribeDatabaseUpdates()
})

onUnmounted(() => eventSourceRef.value?.close())

async function fetchDatabase() {
	console.log("fetching database")
	const res = await useApiFetch(`/workspaces/${workspace.value.id}/items/${id}`);
	status.value = "loading"

	if (res.ok) {
		database.value = await res.json() as Database;
		useItem(database.value.id).value = database.value
		status.value = "loaded"
	} else {
		console.log(res.status, await res.text());
		status.value = "failed"
	}

	if (!selectedView.value || !database.value.views.find(v => v.id === selectedView.value.id)) {
		selectedView.value = database.value.views[0]
	}
}

const records = computed(() => {
	if (!database.value?.records || !selectedView.value) return []
	return database.value.records.filter(record => doesRecordValidateFilters(record, selectedView.value))
})

async function addView(view: DatabaseViewType) {
	const res = await useApiFetch(`/workspaces/${workspace.value.id}/databases/${database.value.id}/views`, {
		method: "POST",
		body: JSON.stringify({
			name: capitalize(view),
			type: view
		})
	});

	if (!res.ok) useErrorToast("Failed to add view")
}

function subscribeDatabaseUpdates() {
	if (!database.value || !database.value.update_url || !database.value.update_token) return
	eventSourceRef.value = new EventSourcePolyfill(database.value.update_url, {
		headers: {
			'Authorization': 'Bearer ' + database.value.update_token
		},
	})

	eventSourceRef.value.onopen = () => useRefreshView().value = () => {
	}

	eventSourceRef.value.onerror = () => {
		eventSourceRef.value?.close()
		useRefreshView().value = fetchDatabase
	}

	eventSourceRef.value.onmessage = (event) => {
		const data = JSON.parse(event.data)
		console.log("New update detected: " + data.type)
		console.log(data)
		handleDatabaseUpdate(data.type, data.object)
	}
}

function handleDatabaseUpdate(type: DatabaseUpdateTypes, data: object) {
	if (!database.value.fields || !database.value.records || !("id" in data)) return
	switch (type) {
		case "table_field_insert":
			database.value.fields.push(data as TableField)
			database.value.records.forEach(r => r.values[data.id as string] = (data as TableField).default_value)
			break;
		case "table_field_update":
			const field = database.value.fields.find(f => f.id === data.id);
			if (field) Object.assign(field, data as TableField);
			break;
		case "table_field_reposition":
			if ("position" in data)
				repositionField(data.id as string, data.position as number);
			break;
		case "table_field_delete":
			database.value.records?.forEach(record => {
				delete record.values[data.id as number]
			})
			database.value.fields = database.value.fields.filter(f => f.id !== data.id)
			break;

		case "table_record_insert":
			database.value.records.push(data as TableRecord)
			if (creatingRecord.value) {
				creatingRecord.value = false
				modal.open(DatabaseModalEditRecord, {record: database.value.records.at(-1) as TableRecord})
			}
			break;
		case "table_record_delete":
			database.value.records = database.value.records.filter(f => f.id !== data.id)
			break;

		case "table_value_update":
			if (!("record_id" in data) || !("field_id" in data) || !("value" in data)) return
			const record = database.value.records.find(r => r.id === data.record_id)
			if (record) record.values[data.field_id as string] = data.value as string;
			break;

		case "database_view_insert":
			const view = data as DatabaseView;
			database.value.views.push(data as DatabaseView)
			if (view.created_by.user.id === useSession().value.id) selectedView.value = view
			break;
		case "database_view_update":
			Object.assign(
				database.value.views.find(v => v.id === data.id) as DatabaseView,
				data as DatabaseView
			);
			break;
		case "database_view_delete":
			database.value.views = database.value.views.filter(v => v.id !== data.id)
			if (selectedView.value && data.id === selectedView.value.id) {
				selectedView.value = database.value.views[0]
			}
			break;
	}
}
</script>

<template>
	<div v-if="status == 'loading'" class="w-full h-full flex-center appear-after-1s">
		<Loader/>
	</div>
	<div v-else-if="status == 'failed'" class="w-full h-full flex-center">
		<p>Failed to access database. Please ty again later...</p>
	</div>
	<div v-else-if="status == 'loaded' && database" class="w-full h-full py-5 appear-0.1">
		<div class="w-full mx-8 flex">
			<div v-for="view in database.views" :key="view.id"
			     :class="{'view-option' : true, 'selected': view.id === selectedView.id}">
				<UButton color="gray" variant="ghost" @click="selectedView = view">
					<component :is="getViewTypeIcon(view.type)"/>
					{{ capitalize(view.name) }}
				</UButton>
			</div>
			<div class="flex-center px-1.5">
				<UPopover :popper="{ placement: 'right-start', arrow: true }" :ui="{trigger: 'w-auto'}">
					<UButton color="gray" icon="i-heroicons-plus" size="xs" variant="ghost"/>

					<template #panel="{ close }">
						<div class="w-56 p-1 space-y-1">
							<div class="flex-between gap-4">
								<p class="pt-0.5 pl-2.5">Add view</p>
								<UButton color="gray" icon="i-heroicons-x-mark" variant="ghost" @click="close"/>
							</div>
							<div class="flex flex-col gap-1">
								<UButton v-for="view in Object.values(DatabaseViewType)" color="gray" variant="ghost"
								         @click="addView(view)">
									<component :is="getViewTypeIcon(view)" class="opacity-75"/>
									{{ capitalize(view) }}
								</UButton>
							</div>
						</div>
					</template>
				</UPopover>
			</div>
		</div>
		<hr class="mx-8 mb-3 -mt-px border-gray-200 dark:border-gray-700"/>
		<div v-if="selectedView" :key="selectedView.id" class="w-full max-h-full px-10 pb-16 flex flex-col gap-2">
			<DatabaseValueEditor/>
			<div class="w-full flex-between">
				<DatabaseViewTitle/>
				<div class="flex-center gap-3">
					<UButton :color="hasActiveFilter ? 'primary' : 'gray'" icon="i-heroicons-funnel"
					         variant="soft" @click="isOptionBarOpen = !isOptionBarOpen"/>
					<DatabaseButtonViewSettings/>
					<span class="h-full w-px border-l border-gray-500">&nbsp;</span>
					<DatabaseButtonNewRecord @click="creatingRecord = true">
						<UButton>New</UButton>
					</DatabaseButtonNewRecord>
				</div>
			</div>
			<DatabaseViewOptionBar v-if="isOptionBarOpen"/>

			<DatabaseTable v-if="selectedView.type === DatabaseViewType.TableView" v-model="records"/>
			<DatabaseCalendar v-else-if="selectedView.type === DatabaseViewType.CalendarView" v-model="records"/>
		</div>
	</div>
</template>

<style>
.view-option {
	@apply text-sm pb-1.5 opacity-60;

	&.selected {
		@apply border-b border-black dark:border-white opacity-100;
	}
}
</style>
