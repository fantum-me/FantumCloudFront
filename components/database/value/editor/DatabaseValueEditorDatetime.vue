<script lang="ts" setup>
const newValue = defineModel<string>()
const {endEditing} = defineProps<{ endEditing: () => void }>()
</script>

<template>
	<div class="p-2 w-full" @click="endEditing">
		<UCard class="w-fit" @click.stop>
			<DatetimePicker v-model="newValue" allow-range/>
		</UCard>
	</div>
</template>
