<script setup lang="ts">
const props = defineProps({
	class: {
		type: String,
		default: ""
	},
	text: {
		type: String,
		required: true
	}
})

const fontSize = props.text.length < 4 ? props.text.length < 3 ? '55cqw' : '40cqw' : '20cqw'

</script>

<template>
	<ItemIcon :class="props.class">
		<p :style="'font-size: ' + fontSize" class="font-extrabold text-white -mt-px">
			{{ props.text }}
		</p>
	</ItemIcon>
</template>
