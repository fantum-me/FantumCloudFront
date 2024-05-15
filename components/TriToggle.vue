<script setup lang="ts">
const model = defineModel<false | null | true>()

const {disabled} = defineProps({disabled: Boolean})

const buttonUi = {
	variant: {
		solid: "dark:text-gray-900"
	},
	rounded: 'rounded-none',
	color: {
		gray: {
			solid: 'ring-0 bg-gray-100 dark:bg-gray-700'
		}
	}
}
</script>

<template>
	<span class="inline-flex rounded ring-1 ring-gray-200 dark:ring-gray-700 overflow-hidden">
		<UButton icon="i-heroicons-x-mark-20-solid" color="red" :variant="model === false ? 'solid' : 'ghost'"
		         :ui="buttonUi" @click="model = false" :disabled="disabled"/>

		<UButton icon="i-heroicons-minus-20-solid" color="gray" :variant="model === null ? 'solid' : 'ghost'"
		         :ui="buttonUi" @click="model = null" :disabled="disabled"/>

		<UButton icon="i-heroicons-check-20-solid" color="green" :variant="model === true ? 'solid' : 'ghost'"
		         :ui="buttonUi" @click="model = true" :disabled="disabled"/>
	</span>
</template>
