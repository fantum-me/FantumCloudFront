<script setup lang="ts">
const props = defineProps({
	size: {
		type: Number,
		default: 24
	},
	thickness: {
		type: Number,
		default: 3
	}
})
</script>

<template>
	<span class="block border-current border-e-transparent rounded-full animate-spin"
	      :style="{width: props.size + 'px', height: props.size + 'px', borderWidth: props.thickness + 'px'}"/>
</template>
