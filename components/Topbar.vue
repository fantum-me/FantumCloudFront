<script setup lang="ts">
const isOpen = useSidebarOpen();
</script>

<template>
	<UCard class="sticky z-20 top-0 h-20 w-full rounded-none shadow-none"
	       :ui="{body: {padding: 'py-3 sm:py-4', base: 'flex-between gap-3 h-full'}}">
		<div class="flex-start gap-3">
			<UButton class="flex-center w-15 h-15 md:hidden" color="gray" variant="ghost" @click="isOpen = true">
				<UIcon name="i-heroicons-bars-3-solid" class="w-10 h-10"/>
			</UButton>
			<UButton icon="i-heroicons-magnifying-glass" color="gray" size="xl"
			         class="w-72 transition-transform hover:scale-105" label="Search file, folder..."/>
		</div>
	</UCard>
</template>
