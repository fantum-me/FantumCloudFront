<script lang="ts" setup>
const value = defineModel()

const boolValue = computed({
	get: () => value.value === "true",
	set: (newValue) => value.value = newValue ? "true" : "false"
})
</script>

<template>
	<div class="p-3 mt-0.5">
		<UToggle v-model="boolValue"/>
	</div>
</template>
