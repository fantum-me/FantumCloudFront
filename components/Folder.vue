<script setup lang="ts">
import type ParentFolder from "~/types/api/ParentFolder";
import type Folder from "~/types/api/Folder";
import type {Ref} from "vue";
import {EventSourcePolyfill} from "event-source-polyfill";

const {id} = defineProps({id: String})

const status: Ref<"loaded" | "loading" | "failed"> = ref("loading");
const folder = useFolder();
const workspace = useWorkspace()
const path = "/workspace/" + workspace.value.id

const eventSourceRef: Ref<EventSourcePolyfill | null> = ref(null);

onMounted(async () => {
	await fetchFolder()
	useRefreshView().value = fetchFolder
	subscribeVersionUpdates()
})

onUnmounted(() => eventSourceRef.value?.close())

async function fetchFolder() {
	console.log("fetching current folder")
	const res = await useApiFetch(`/workspaces/${workspace.value.id}/items/${id}`);
	status.value = "loading"
	const current_folder = folder.value
	if (res.ok) {
		folder.value = await res.json() as Folder;
		useItem(folder.value.id).value = folder.value
		folder.value.items?.forEach(i => {
			const item = useItem(i.id)
			item.value = {...item.value, ...i}
		})
		if (current_folder) folder.value.import_file = current_folder.import_file
		status.value = "loaded"
	} else {
		console.log(res.status, await res.text());
		status.value = "failed"
	}
}

function getParentFolderPath(parent: ParentFolder) {
	return parent.is_root ? path + '/files'
		: parent.id === 'trash' ? path + '/trash'
			: path + '/folder/' + parent.id
}

function onContextMenu(e: MouseEvent) {
	if (e.target && asHtmlElement(e.target)) {
		if (!e.target.closest(".item-card")) useFolderContextMenu().value.open(folder.value)
	}
}

function subscribeVersionUpdates() {
	console.log("a")
	if (!folder.value || !folder.value.version_update_url || !folder.value.version_update_token) return
	console.log("b")
	eventSourceRef.value = new EventSourcePolyfill(folder.value.version_update_url, {
		headers: {
			'Authorization': 'Bearer ' + folder.value.version_update_token
		},
	})

	eventSourceRef.value.onopen = () => useRefreshView().value = () => {
	}

	eventSourceRef.value.onerror = () => {
		eventSourceRef.value?.close()
		useRefreshView().value = fetchFolder
	}

	eventSourceRef.value.onmessage = (event) => {
		if (Number(event.data) != folder.value.version) {
			console.log("New update detected")
			fetchFolder()
		}
	}
}
</script>


<template>
	<div v-if="status == 'loading'" class="w-full h-full flex-center appear-after-1s">
		<Loader/>
	</div>
	<div v-else-if="status == 'failed'" class="w-full h-full flex-center">
		<p>Failed to access folder. Please ty again later...</p>
	</div>
	<div v-else-if="status == 'loaded'" class="w-full h-full appear-0.1">
		<ItemWrapper :id="folder.id" type="main" class="w-full h-full"
		             @contextmenu.prevent="onContextMenu" @click="unselectAll">
			<FileDropzone>
				<StorageItems :items="folder.items ?? []">
					<div class="flex-start -ml-2.5">
						<div v-for="(parent, index) in folder.parents">
							<div :key="index" class="flex-center" data-type="folder" :data-item-id="parent.id">
								<UButton color="gray" variant="ghost" class="text-base font-semibold"
								         :to="getParentFolderPath(parent)">
									{{ parent.is_root ? "Files" : parent.name }}
								</UButton>
								<UIcon name="i-heroicons-chevron-right-20-solid" class="ml-1 mr-1.5 h-4 w-4"/>
							</div>
						</div>
						<UButton @click="fetchFolder" color="gray" variant="ghost" class="text-base font-bold">
							{{ folder.is_root ? "Files" : folder.name }}
						</UButton>
					</div>
				</StorageItems>
			</FileDropzone>
		</ItemWrapper>
	</div>
</template>
