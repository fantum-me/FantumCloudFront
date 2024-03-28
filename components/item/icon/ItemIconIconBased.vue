<script setup lang="ts">
type Props = {
	class: string | undefined,
	iconClass: string | undefined,
	icon: any,
	padding: boolean
}
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
