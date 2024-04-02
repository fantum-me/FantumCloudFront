<script setup lang="ts">
const props = defineProps({
	class: String,
	iconClass: {
		type: String
	},
	icon: {},
	padding: Boolean
})
</script>

<template>
	<ItemIcon :class="props.class ?? ''" :padding="padding">
		<component :is="icon" :class="(props.iconClass ?? 'text-white') + ' h-full w-full'" />
	</ItemIcon>
</template>
