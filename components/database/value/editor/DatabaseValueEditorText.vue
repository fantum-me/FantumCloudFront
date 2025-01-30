<script setup lang="ts">
import TableFieldType from "~/types/database/TableFieldType";
import type TableField from "~/types/database/TableField";

const newValue = defineModel<string>()

const {field, endEditing} = defineProps<{
	field: TableField,
	endEditing: () => void
}>()

function onKeydown(event: KeyboardEvent) {
	const target = (event.target as HTMLInputElement)
	const cursorPosition = target.selectionStart;
	const textLength = target.value.length;

	if (event.key === 'Enter') {
		if (cursorPosition === textLength && !event.shiftKey) {
			event.preventDefault();
			endEditing()
		}
	}
}

function onInput(event: InputEvent) {
	const target = (event.target as HTMLInputElement)
	if (field && field.type === TableFieldType.NumberType) {
		target.value = target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1')
	}
}
</script>

<template>
	<form class="w-full" @submit.prevent="endEditing">
		<UTextarea v-model="newValue" :placeholder="field.name" :rows="1" autofocus autoresize color="gray"
		           size="xl" @input="onInput" @keydown="onKeydown"/>
	</form>
</template>
