<script lang="ts" setup>
const value = defineModel()
const {small} = defineProps({small: Boolean})

const boolValue = computed({
	get: () => value.value === "true",
	set: (newValue) => value.value = newValue ? "true" : "false"
})
</script>

<template>
	<div :class="(small ? '' : 'p-3 ') + 'mt-0.5'">
		<UToggle v-model="boolValue"/>
	</div>
</template>
