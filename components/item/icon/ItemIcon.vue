<script setup lang="ts">
const props = defineProps({
	class: {
		type: String,
		default: ""
	},
	padding: {
		type: Boolean,
		default: true
	},
})
</script>

<template>
	<div class="w-full h-full" :style="{'container-type': 'size' }">
		<div :class="props.class + ' h-full w-full aspect-square flex-center overflow-hidden'"
		     :style="{'border-radius': '15cqw', 'padding': (props.padding ? '15cqw' : '')}">
			<slot/>
		</div>
	</div>
</template>
