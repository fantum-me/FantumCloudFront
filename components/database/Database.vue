<script setup lang="ts">
import type {Ref} from "vue";
import {EventSourcePolyfill} from "event-source-polyfill";
import type Database from "~/types/database/Database";
import DatabaseViewType, {getViewTypeIcon} from "~/types/database/DatabaseViewType";

const {id} = defineProps({id: String})

const status: Ref<"loaded" | "loading" | "failed"> = ref("loading");
const database = useDatabase()
const workspace = useWorkspace()

const selectedView = ref<DatabaseViewType>()

const eventSourceRef: Ref<EventSourcePolyfill | null> = ref(null);

onMounted(async () => {
	await fetchDatabase()
	useRefreshView().value = fetchDatabase
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

	selectedView.value = database.value?.views[0]
}

async function addView(view: DatabaseViewType) {
	const res = await useApiFetch(`/workspaces/${workspace.value.id}/databases/${database.value.id}`, {
		method: "PATCH",
		body: JSON.stringify({views: database.value.views.concat([view])})
	});

	if (res.ok) database.value = await res.json() as Database;
	else useErrorToast("Failed to create edit database")
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
			<div v-for="view in database.views" :class="view === selectedView ? 'view-option selected' : 'view-option'">
				<UButton color="gray" variant="ghost" @click="selectedView = view">
					<component :is="getViewTypeIcon(view)"/>
					{{ capitalize(view) }}
				</UButton>
			</div>
			<div class="flex-center px-1.5">
				<UPopover :ui="{trigger: 'w-auto'}" :popper="{ placement: 'right-start', arrow: true }">
					<UButton color="gray" variant="ghost" icon="i-heroicons-plus" size="xs"/>

					<template #panel="{ close }">
						<div class="w-56 p-1 space-y-1">
							<div class="flex-between gap-4">
								<p class="pt-0.5 pl-2.5">Add view</p>
								<UButton color="gray" variant="ghost" icon="i-heroicons-x-mark" @click="close"/>
							</div>
							<div class="flex flex-col gap-1">
								<UButton color="gray" variant="ghost" @click="addView(view)"
								         v-for="view in Object.values(DatabaseViewType).filter(v => !database.views.includes(v))">
									<component :is="getViewTypeIcon(view)" class="opacity-75"/>
									{{ capitalize(view) }}
								</UButton>
							</div>
						</div>
					</template>
				</UPopover>
			</div>
		</div>
		<hr class="mx-8 mb-3 -mt-px border-gray-200 dark:border-gray-700" />
		<DatabaseTable v-if="selectedView === DatabaseViewType.TableView"/>
		<DatabaseBoard v-else-if="selectedView === DatabaseViewType.BoardView"/>
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
