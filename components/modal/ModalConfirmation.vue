<script lang="ts" setup>
defineProps({
	title: String,
	description: String,
	warning: String,
	buttonLabel: String,
	color: {
		type: String,
		default: "primary"
	}
})

const modal = useModal()

const emit = defineEmits(['success'])

function onSuccess() {
	emit('success')
	modal.close()
}
</script>

<template>
	<UModal>
		<UCard>
			<template #header>
				<div class="flex items-center justify-between font-semibold">{{ title }}</div>
			</template>

			<p class="ml-2 mb-3">{{description}}</p>
			<UAlert v-if="warning" color="red" variant="soft" :description="warning" icon="i-heroicons-exclamation-triangle"/>

			<template #footer>
				<div class="flex-end">
					<UButton color="gray" variant="ghost" @click="modal.close">
						Cancel
					</UButton>
					<UButton :color="color" @click="onSuccess">
						{{ buttonLabel }}
					</UButton>
				</div>
			</template>
		</UCard>
	</UModal>
</template>
