<script setup lang="ts">
import type Member from "~/types/user/Member";

const isOpen = defineModel()

const {target} = defineProps<{
	target: Member
}>()

const workspace = useWorkspace()
const isLoading = ref(false)

async function transferOwnership() {
	isLoading.value = true

	const res = await useApiFetch(`/workspaces/${workspace.value.id}/members/${target.id}`, {
		method: "PATCH",
		body: JSON.stringify({is_owner: true})
	})

	if (res.ok) {
		await refreshWorkspace(["access"])
		useSuccessToast(`Successfully transferred workspace ownership to ${target.user.name} !`)
	} else useErrorToast(`Failed to transfer ownership to ${target.user.name}`)

	isLoading.value = false
	isOpen.value = false
}
</script>

<template>
	<UModal v-model="isOpen as boolean" :prevent-close="isLoading">
		<UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-700' }">
			<template #header>
				<div class="flex items-center justify-between font-semibold">
					Ownership Transfer
					<UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid"
					         class="-my-1" @click="!isLoading ? isOpen = false : null"/>
				</div>
			</template>

			<div class="space-y-8">
				<h1 class="text-center">Transfer <b>{{ workspace.name }}</b> ownership to <b>{{ target.user.name }}</b></h1>

				<div class="flex-center gap-6">
					<div class="text-center">
						<UAvatar :src="useSession().value.avatar" size="3xl"/>
					</div>
					<icon name="i-heroicons-arrow-right" class="w-8 h-8"/>
					<UAvatar :src="target.user.avatar" size="3xl"/>
				</div>

				<UAlert color="red" variant="soft" title="Warning"
				        description="Transferring ownership will grant full control to the recipient"/>
			</div>

			<template #footer>
				<div class="flex-end">
					<UButton color="gray" variant="ghost" @click="isOpen = false">
						Cancel
					</UButton>
					<UButton color="red" variant="soft" icon="i-heroicons-key" @click="transferOwnership">
						Transfer ownership
					</UButton>
				</div>
			</template>
		</UCard>
	</UModal>
</template>
