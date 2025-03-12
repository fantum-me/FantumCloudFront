<script setup lang="ts">
import type {Ref} from "vue";
import type AccessControl from "~/types/permission/AccessControl";
import type Role from "~/types/permission/Role";
import {getDefaultPermissionObject} from "~/types/permission/PermissionObject";
import type StorageItem from "~/types/filesystem/StorageItem";

const {item} = defineProps<{ item: StorageItem }>()

const modal = useModal()
const {defaultRoleColor} = useRuntimeConfig().public

const workspace = useWorkspace()

const selectedAccessControl: Ref<AccessControl | undefined> = ref(item.access_controls.length ? item.access_controls[0] : undefined)
const notAddedRoles = computed(() => workspace.value.roles.filter(r => !item.access_controls?.find(ac => ac.role_id === r.id)))

const defaultAccessControls = JSON.stringify(item.access_controls)

async function submit() {
	const res = await useApiFetch(`/workspaces/${workspace.value.id}/items/${item.id}/access-controls`, {
		method: "PATCH",
		body: JSON.stringify({
			access_controls: item.access_controls
		})
	})

	if (res.ok) item.access_controls = (await res.json() as StorageItem).access_controls
	else useErrorToast(`Failed to save ${item.name} permissions`)
}

function findRole(id: string): Role | undefined {
	return workspace.value.roles.find(r => r.id === id)
}

function removeAccessControl(accessControl: AccessControl) {
	if (accessControl.role_id === selectedAccessControl.value?.role_id) selectedAccessControl.value = undefined
	item.access_controls = item.access_controls.filter(ac => ac.role_id !== accessControl.role_id)
	submit()
}

function addRole(id: string) {
	if (item.access_controls.find(ac => ac.role_id === id)) return
	const ac = {role_id: id, permissions: getDefaultPermissionObject()}
	item.access_controls.push(ac)

	const roleIds = workspace.value.roles.map(role => role.id)
	item.access_controls.sort((a, b) => roleIds.indexOf(a.role_id) - roleIds.indexOf(b.role_id))

	selectedAccessControl.value = ac
	submit()
}

function reset() {
	item.access_controls = JSON.parse(defaultAccessControls)
}
</script>

<template>
	<UModal :ui="{base: 'mb-24'}" @close="submit">
		<Teleport to="body">
			<div class="absolute text-center w-screen bottom-2 text-xs z-50 flex-center gap-1">
				<p class="opacity-50">Close the modal to save changes.</p>
				<span class="opacity-50 hover:opacity-75 hover:underline cursor-pointer" @click="reset">Reset ?</span>
			</div>
		</Teleport>

		<UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
			<template #header>
				<div class="flex items-center justify-between font-semibold">
					<span>
						Manage
						<span class="font-bold px-2 py-1 bg-gray-100 dark:bg-gray-600 rounded">
							{{ item.name }}
						</span>
						Access
					</span>
					<UButton class="-my-1" color="gray" icon="i-heroicons-x-mark-20-solid"
					         variant="ghost" @click="modal.close"/>
				</div>
			</template>

			<div class="flex md:divide-x divide-gray-200 dark:divide-gray-700">
				<div :class="(selectedAccessControl ? 'max-md:hidden ' : '') + 'space-y-2 max-md:w-full md:mr-4 mb-5'">
					<div class="flex-between gap-4">
						<span class="text-xs">Roles</span>
						<UPopover v-if="notAddedRoles.length">
							<UButton color="gray" icon="i-heroicons-plus-20-solid" size="xs" square variant="ghost"/>

							<template #panel="{ close }">
								<UButton v-for="role in notAddedRoles" class="flex-start gap-1.5 w-full" color="gray" size="sm"
								         variant="ghost" @click="addRole(role.id); close();">
									<span :style="{backgroundColor: role.color ?? defaultRoleColor}"
									      class="w-2.5 h-2.5 rounded-full"/>
									{{ role.name }}
								</UButton>
							</template>
						</UPopover>
					</div>

					<UButton v-for="accessControl in item.access_controls" block class="group flex-between gap-2" color="gray"
					         variant="ghost" @click="selectedAccessControl = accessControl">
							<span class="flex-start gap-1.5">
								<span :style="{backgroundColor: findRole(accessControl.role_id)?.color ?? defaultRoleColor}"
								      class="w-2.5 h-2.5 rounded-full"/>
								<span class="text-nowrap">{{ findRole(accessControl.role_id)?.name }}</span>
							</span>
						<UIcon class="md:opacity-0 group-hover:md:opacity-75 transition-opacity" name="i-heroicons-x-mark-20-solid"
						       @click.stop="removeAccessControl(accessControl)"/>
					</UButton>

				</div>

				<div v-if="selectedAccessControl" class="md:pl-4 w-full text-left">
					<UButton class="md:hidden -ml-3 -mt-3 mb-3" color="gray"
					         icon="i-heroicons-arrow-left-16-solid" size="xs" variant="ghost" @click="selectedAccessControl = undefined">
						Back
					</UButton>
					<div class="flex-start gap-1.5 mb-4">
						<span :style="{backgroundColor: findRole(selectedAccessControl.role_id)?.color ?? defaultRoleColor}"
						      class="w-3 h-3 rounded-full"/>
						<p class="text-lg font-semibold">{{ findRole(selectedAccessControl.role_id)?.name }}</p>
					</div>
					<PermissionManager v-model="selectedAccessControl.permissions" inline type="tri-toggle"/>
				</div>
			</div>
		</UCard>
	</UModal>
</template>
