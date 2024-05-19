<script setup lang="ts">
import View from "~/types/View";
import type Folder from "~/types/api/Folder";

const isSidebarOpen = useSidebarOpen();
const workspaceId = useRoute().params.workspace
const workspace = useWorkspace()
const view = useView()

if (!workspace.value || workspaceId !== workspace.value.id) workspace.value = await fetchWorkspace(workspaceId as string)
if (view.value !== View.FILES && view.value !== View.FOLDER && view.value !== View.TRASH) useFolder().value = {} as Folder
</script>

<template>
	<div class="w-screen min-h-screen overflow-y-auto overflow-x-hidden flex" v-if="workspace">
		<div>
			<USlideover class="md:hidden w-64" v-model="isSidebarOpen" side="left">
				<Sidebar/>
			</USlideover>
			<div class="max-md:hidden sticky top-0 left-0 w-64 shrink-0 z-30">
				<Sidebar/>
			</div>
		</div>

		<div class="flex-1 flex flex-col overflow-x-hidden">
			<Topbar/>
			<ClientOnly>
				<ContextMenuItems/>
				<ModalRenameItem/>
				<ModalAccessControls/>
				<ModalNewFolder/>
				<ModalNewDocument/>
				<DraggingItems/>
				<ImageViewer/>

				<div class="flex-grow appear-0.25">
					<slot/>
				</div>
			</ClientOnly>
		</div>
	</div>
</template>
