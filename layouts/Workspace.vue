<script setup lang="ts">
const isSidebarOpen = useSidebarOpen();
useWorkspace().value = await fetchWorkspace(useRoute().params.workspace as string)
</script>

<template>
	<div class="flex">
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
