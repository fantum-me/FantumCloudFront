<script setup lang="ts">
const {isLoading, reset, submit} = defineProps<{
	isLoading?: boolean,
	reset?: () => any,
	submit?: () => any
}>()
</script>

<template>
	<div class="fixed left-0 bottom-4 w-screen flex-center z-50 px-4">
		<UCard class="max-md:ring-0 max-md:w-full">
			<div class="flex-center gap-2">
				<UButton v-if="reset" color="gray" variant="link" size="lg" type="button" @click="reset">
					Reset Changes
				</UButton>
				<UButton type="submit" size="lg" :loading="isLoading" @click="submit">
					Save Changes
				</UButton>
			</div>
		</UCard>
	</div>
</template>
