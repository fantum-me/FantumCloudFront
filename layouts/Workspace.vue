<script setup lang="ts">
const isSidebarOpen = useSidebarOpen();
const workspaceId = useRoute().params.workspace
const workspace = useWorkspace()
if (!workspace.value || workspaceId !== workspace.value.id) workspace.value = await fetchWorkspace(workspaceId as string)
</script>

<template>
	<div class="flex" v-if="workspace">
		<div>
			<USlideover class="md:hidden w-80" v-model="isSidebarOpen" side="left">
				<Sidebar/>
			</USlideover>
			<div class="max-md:hidden sticky top-0 left-0 w-80 shrink-0 z-30">
				<Sidebar/>
			</div>
		</div>

		<div class="w-full min-h-screen flex flex-col">
			<Topbar/>
			<ClientOnly>
				<div class="flex-grow">
					<slot/>
				</div>
			</ClientOnly>
		</div>
	</div>
</template>
