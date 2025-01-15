<script lang="ts" setup>
const newValue = defineModel<string>()
</script>

<template>
	<UCard class="m-2 w-fit">
		<DatetimePicker v-model="newValue" allow-range/>
	</UCard>
</template>
