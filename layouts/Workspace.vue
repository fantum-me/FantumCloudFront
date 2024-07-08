<script setup lang="ts">
import View, {isDetailsPanelOnView} from "~/types/View";
import type Folder from "~/types/api/Folder";

const isSidebarOpen = useSidebarOpen();
const detailsPanel = useDetailsPanel()
const workspaceId = useRoute().params.workspace
const workspace = useWorkspace()
const view = useView()

if (!workspace.value || workspaceId !== workspace.value.id) workspace.value = await fetchWorkspace(workspaceId as string)
if (view.value !== View.FILES && view.value !== View.FOLDER && view.value !== View.TRASH) useFolder().value = {} as Folder
</script>

<template>
	<div class="w-screen min-h-screen flex" v-if="workspace">
		<div>
			<USlideover class="md:hidden w-64" v-model="isSidebarOpen" side="left">
				<div class="w-64 bg-primary-50 border-r border-primary-200">
					<Sidebar/>
				</div>
			</USlideover>
			<div class="max-md:hidden w-64 shrink-0">
				<Sidebar/>
			</div>
		</div>

		<div class="w-full h-screen flex flex-col">
			<Topbar/>
			<ClientOnly>
				<ContextMenuItems/>
				<ContextMenuFolder/>
				<ModalRenameItem/>
				<ModalAccessControls/>
				<ModalNewFolder/>
				<ModalNewDocument/>
				<DraggingItems/>
				<ImageViewer/>

				<div class="flex md:mb-6 md:mr-6 gap-6">
					<div class="flex-1 panel main-panel">
						<slot/>
					</div>
					<div v-if="isDetailsPanelOnView(view) && detailsPanel" class="max-lg:hidden panel w-80 shrink-0">
						<DetailsPanel/>
					</div>
				</div>
			</ClientOnly>
		</div>
	</div>
</template>

<style>
.panel {
	@apply bg-white dark:bg-gray-900 shadow overflow-hidden max-md:rounded-b-none rounded-2xl;
}

.main-panel {
	height: calc(100vh - 4rem);
	@media (min-width: 768px) {
		height: calc(100vh - 4rem - 1.5rem);
	}
}
</style>
