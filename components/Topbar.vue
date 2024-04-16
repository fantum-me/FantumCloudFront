<script setup lang="ts">
const isOpen = useSidebarOpen();
</script>

<template>
	<UCard class="sticky z-20 top-0 h-20 w-full rounded-none shadow-none"
	       :ui="{body: {padding: 'py-3 sm:py-4', base: 'flex-start gap-3 h-full'}}">
		<UButton class="flex-center w-15 h-15 md:hidden" color="gray" variant="ghost" @click="isOpen = true">
			<UIcon name="i-heroicons-bars-3-solid" class="w-10 h-10"/>
		</UButton>
		<UButton icon="i-heroicons-magnifying-glass" color="gray" size="xl" :ui="{ rounded: 'rounded-2xl' }"
		         label="Search file, folder, user"/>
	</UCard>
</template>
