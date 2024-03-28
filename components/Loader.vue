<script setup lang="ts">
const props = defineProps({
	class: {
		type: String,
		default: "w-full h-full"
	}
})
</script>

<template>
	<span :class="props.class + ' border-b-2 border-current rounded-full animate-spin'" />
</template>
