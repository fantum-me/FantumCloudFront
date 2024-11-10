<script setup lang="ts">
import type Member from "~/types/user/Member";

const isOpen = defineModel()

const {target} = defineProps<{
	target: Member
}>()

const workspace = useWorkspace()
const isLoading = ref(false)

async function submit() {
	isLoading.value = true

	const res = await useApiFetch(`/workspaces/${workspace.value.id}/members/${target.id}/kick`, {
		method: "POST"
	})

	if (res.ok) {
		useRefreshView().value()
		useSuccessToast(`Successfully kicked ${target.user.name} !`)
	} else useErrorToast(`Failed to kick ${target.user.name}`)

	isLoading.value = false
	isOpen.value = false
}
</script>

<template>
	<UModal v-model="isOpen as boolean" :prevent-close="isLoading">
		<UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-700' }">
			<template #header>
				<div class="flex items-center justify-between font-semibold">
					<span>
						Are you sure you want to Kick
						<span class="font-bold px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded">
							{{ target.user.name }}
						</span>
						 ?
					</span>
					<UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid"
					         class="-my-1" @click="!isLoading ? isOpen = false : null"/>
				</div>
			</template>

			<div class="space-y-8">
				<p class="text-gray-800 dark:text-gray-200 text-sm">
					They will be able to join the workspace again if they have a valid invitation link.
				</p>
			</div>

			<template #footer>
				<div class="flex-end">
					<UButton color="gray" variant="ghost" @click="isOpen = false">
						Cancel
					</UButton>
					<UButton color="red" variant="soft" icon="i-heroicons-user-minus" @click="submit">
						Kick
					</UButton>
				</div>
			</template>
		</UCard>
	</UModal>
</template>
