<script setup lang="ts">
import type {Ref} from "vue";
import type Role from "~/types/api/Role";
import View from "~/types/View";

useView().value = View.PERMISSIONS

const workspace = useWorkspace()
onMounted(() => {
	useRefreshView().value = async () => {
		workspace.value = await fetchWorkspace(workspace.value.id)
	}
})

const selectedRole: Ref<Role | undefined> = ref()

const isCreatingNewRole: Ref<boolean> = ref(false)

async function createNewRole() {
	isCreatingNewRole.value = true
	const res = await useApiFetch(`/workspaces/${workspace.value.id}/roles`, {
		method: "POST",
		body: JSON.stringify({name: "New Role"})
	})
	if (res.ok) {
		await useRefreshView().value()
		useSuccessToast("New role created successfully !")
	} else useErrorToast("Failed to create a new role")
	isCreatingNewRole.value = false
}
</script>

<template>
	<NuxtLayout name="workspace">
		<div class="w-full h-full px-8 py-6 flex flex-col gap-4">
			<h1 class="font-bold text-xl">Roles</h1>
			<div class="flex-1 flex divide-x divide-gray-100 dark:divide-gray-700">
				<div class="h-full w-72 shrink-0 flex flex-col">
					<div class="flex-1 overflow-y-scroll">
						<RoleList v-model="selectedRole"/>
					</div>
					<UDivider class="mt-2 mb-3"/>
					<UButton icon="i-heroicons-plus" class="w-full" color="gray" variant="ghost" size="lg"
					         :loading="isCreatingNewRole" @click="createNewRole">
						New Role
					</UButton>
				</div>
				<div class="pl-4 ml-4">
					<RoleEditionForm v-model="selectedRole"/>
				</div>
			</div>
		</div>
	</NuxtLayout>
</template>
