<script setup lang="ts">
import type {FormError} from "#ui/types";
import type {Ref} from "vue";
import type Role from "~/types/permission/Role";
import {getDefaultPermissionObject} from "~/types/permission/PermissionObject";
import type Permission from "~/types/permission/Permission";

const workspace = useWorkspace()
const defaultRoleColor = useRuntimeConfig().public.defaultRoleColor

const selectedRole = defineModel<Role>()

const state = reactive({
	name: "",
	color: "",
	permissions: getDefaultPermissionObject(false)
})

watch(selectedRole, (newVal) => reset(newVal))

const isSubmitting: Ref<boolean> = ref(false)

const validate = (state: any): FormError[] => {
	const errors = []
	if (!state.name) errors.push({path: 'name', message: 'Required'})
	if (state.name.length > 63) errors.push({path: 'name', message: 'Must not exceed 63 characters'})
	if (!state.color) errors.push({path: 'color', message: 'Required'})
	return errors
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
		if (role) selectedRole.value = role
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

function reset(role: Role|undefined) {
	state.name = role?.name ?? ""
	state.color = role?.color ?? defaultRoleColor
	if (role) Object.assign(state.permissions, role.permissions)
}
</script>

<template>
	<div v-if="isSubmitting" @click="useWaitToast('Your changes are being saved, please wait')"
	     class="z-[99] w-screen h-screen fixed top-0 left-0"/>
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
		                  :reset="() => reset(selectedRole)"/>
	</UForm>
</template>
