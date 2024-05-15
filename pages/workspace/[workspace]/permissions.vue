<script setup lang="ts">
import type {FormError} from "#ui/types";
import type {Ref} from "vue";
import type Role from "~/types/api/Role";
import {getDefaultPermissionObject} from "~/types/api/PermissionObject";
import View from "~/types/View";
import type Permission from "~/types/Permission";

const defaultRoleColor = useRuntimeConfig().public.defaultRoleColor
useView().value = View.PERMISSIONS

const workspace = useWorkspace()
onMounted(() => {
	useRefreshView().value = async () => {
		workspace.value = await fetchWorkspace(workspace.value.id)
	}
})

const selectedRole: Ref<Role | undefined> = ref()
const isSubmitting: Ref<boolean> = ref(false)

const isCreatingNewRole: Ref<boolean> = ref(false)

const state = reactive({
	name: "",
	color: "",
	permissions: getDefaultPermissionObject(false)
})

const selectRole = (role: Role) => {
	state.name = role.name
	state.color = role.color ?? defaultRoleColor
	Object.assign(state.permissions, role.permissions)

	selectedRole.value = role
}

const validate = (state: any): FormError[] => {
	const errors = []
	if (!state.name) errors.push({path: 'name', message: 'Required'})
	if (state.name.length > 63) errors.push({path: 'name', message: 'Must not exceed 63 characters'})
	if (!state.color) errors.push({path: 'color', message: 'Required'})
	return errors
}

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

async function onSubmit() {
	if (!selectedRole.value || isSubmitting.value) return

	const roleId = selectedRole.value.id

	isSubmitting.value = true
	const res = await useApiFetch(`/workspaces/${workspace.value.id}/roles/${roleId}`, {
		method: "PATCH",
		body: JSON.stringify(state)
	})
	if (res.ok) {
		await useRefreshView().value()
		const role = workspace.value.roles.find(r => r.id === roleId)
		if (role) selectRole(role)
		useSuccessToast("Saved role successfully !")
	} else useErrorToast("Failed to save role")
	isSubmitting.value = false
}

function isRoleDifferent(role: Role): boolean {
	if (state.name !== role.name) return true
	if (state.color !== (role.color ?? defaultRoleColor)) return true

	for (const key of Object.keys(role.permissions)) {
		if (state.permissions[key as Permission] !== role.permissions[key as Permission]) return true
	}
	return false
}
</script>

<template>
	<NuxtLayout name="workspace">
		<div v-if="isSubmitting" @click="useWaitToast('Your changes are being saved, please wait')"
		     class="z-50 w-screen h-screen fixed top-0 left-0"/>
		<div class="w-full h-full p-6 flex gap-6">
			<UCard class="h-full w-80">
				<div class="flex-grow overflow-y-scroll">
					<RoleList :select-role="selectRole" :selected-id="selectedRole?.id"/>
				</div>
				<UDivider class="mt-2 mb-3"/>
				<UButton icon="i-heroicons-plus" class="w-full" color="gray" variant="ghost" size="lg"
				         :loading="isCreatingNewRole" @click="createNewRole">
					New Role
				</UButton>
			</UCard>
			<UCard class="flex-grow h-full">
				<UForm :validate="validate" :state="state" @submit="onSubmit" v-if="selectedRole">
					<div class="space-y-4">
						<UFormGroup label="Name" name="name" v-if="!selectedRole.is_default">
							<UInput v-model="state.name"/>
						</UFormGroup>
						<UFormGroup class="w-16" label="Color" name="color" v-if="!selectedRole.is_default">
							<UInput type="color" v-model="state.color" variant="none" :padded="false"/>
						</UFormGroup>

						<PermissionManager type="boolean" :permissions="state.permissions"/>
					</div>

					<SaveChangesPopup v-if="isRoleDifferent(selectedRole)" :is-loading="isSubmitting"
					                  :reset="() => selectRole(selectedRole as Role)"/>
				</UForm>
			</UCard>
		</div>
	</NuxtLayout>
</template>
