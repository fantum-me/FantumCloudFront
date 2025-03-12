<script setup lang="ts">
import View, {isDetailsPanelOnView} from "~/types/View";
import type Folder from "~/types/filesystem/Folder";

const isSidebarOpen = useSidebarOpen();
const detailsPanel = useDetailsPanel()
const workspaceId = useRoute().params.workspace
const workspace = useWorkspace()
const view = useView()

if (!workspace.value || workspaceId !== workspace.value.id) workspace.value = await fetchWorkspace(workspaceId as string)
if (view.value !== View.FILES && view.value !== View.FOLDER && view.value !== View.TRASH) useFolder().value = {} as Folder
</script>

<template>
	<div class="w-screen h-screen flex p-4 pt-1 gap-6 overflow-hidden" v-if="workspace">
		<USlideover class="md:hidden w-64" v-model="isSidebarOpen" side="left">
			<div class="h-full p-2 bg-primary-50 border-r border-primary-200">
				<Sidebar/>
			</div>
		</USlideover>
		<Sidebar class="max-md:hidden h-full"/>

		<div class="flex-1 flex flex-col overflow-y-hidden">
			<Topbar/>

			<div class="flex-1 flex gap-4 overflow-x-hidden">
				<div class="flex-1 panel">
					<slot/>
				</div>
				<div v-if="isDetailsPanelOnView(view) && detailsPanel" class="max-lg:hidden panel w-80 shrink-0">
					<DetailsPanel/>
				</div>
			</div>
		</div>

		<ClientOnly>
			<ContextMenuItems/>
			<ContextMenuFolder/>
			<DraggingItems/>
			<ImageViewer/>
		</ClientOnly>
	</div>
</template>

<style>
.panel {
	@apply bg-white dark:bg-gray-900 shadow overflow-hidden max-md:rounded-b-none rounded-2xl;
}
</style>
