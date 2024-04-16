<script setup lang="ts">
const props = defineProps<{
	class?: string,
	icon: string,
	iconClass?: string,
	padding?: boolean
}>()
</script>

<template>
	<ItemIcon :class="props.class ?? ''" :padding="padding">
		<UIcon :name="props.icon" :class="(props.iconClass ?? 'text-white') + ' h-full w-full'"/>
	</ItemIcon>
</template>
