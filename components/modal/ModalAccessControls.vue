<script setup lang="ts">
import type {Ref} from "vue";
import type AccessControl from "~/types/api/AccessControl";
import type Role from "~/types/api/Role";
import {getDefaultPermissionObject} from "~/types/api/PermissionObject";
import type StorageItem from "~/types/api/StorageItem";

const workspace = useWorkspace()
const {defaultRoleColor} = useRuntimeConfig().public
const item: Ref<StorageItem | undefined> = ref()
const accessControls: Ref<AccessControl[] | undefined> = ref()
const selectedAccessControl: Ref<AccessControl | undefined> = ref()
const isOpen = ref(false)
const isSubmitting = ref(false)

useAccessControlsModal().value = (targetItem: StorageItem) => {
	reorder(targetItem.access_controls)
	item.value = targetItem
	accessControls.value = JSON.parse(JSON.stringify(targetItem.access_controls))
	isOpen.value = true
}

async function save() {
	if (!isOpen.value || !item.value || !accessControls.value || isSubmitting.value) return
	isSubmitting.value = true

	const res = await useApiFetch(`/workspaces/${workspace.value.id}/items/${item.value.id}/access-controls`, {
		method: "PATCH",
		body: JSON.stringify({
			access_controls: accessControls.value
		})
	})

	if (res.ok) {
		const newItem: StorageItem = await res.json()
		reorder(newItem.access_controls)
		item.value.access_controls = newItem.access_controls
		useSuccessToast(`Successfully saved new ${item.value.name} permission !`)
	} else useErrorToast(`Failed to save ${item.value.name} permissions`)

	isSubmitting.value = false
}

function haveChanged() {
	return accessControls.value && item.value
		&& (
			JSON.stringify(accessControls.value.map(ac => ac.permissions)) !== JSON.stringify(item.value.access_controls.map(ac => ac.permissions))
			|| JSON.stringify(accessControls.value.map(ac => ac.role_id)) !== JSON.stringify(item.value.access_controls.map(ac => ac.role_id))
		)
}

function resetChanges(unselect = true) {
	accessControls.value = JSON.parse(JSON.stringify(item.value?.access_controls))
	if (unselect) selectedAccessControl.value = undefined
}

function findRole(id: string): Role | undefined {
	return workspace.value.roles.find(r => r.id === id)
}

function removeAccessControl(accessControl: AccessControl) {
	if (!accessControls.value) return
	if (accessControl === selectedAccessControl.value) selectedAccessControl.value = undefined
	accessControls.value = accessControls.value.filter(ac => ac.role_id !== accessControl.role_id)
}

function addRole(id: string) {
	if (!accessControls.value || accessControls.value.find(ac => ac.role_id === id)) return
	const ac = {role_id: id, permissions: getDefaultPermissionObject()}
	accessControls.value.push(ac)
	reorder(accessControls.value)
	selectedAccessControl.value = ac
}

function reorder(array: AccessControl[]) {
	const roleIds = workspace.value.roles.map(role => role.id)
	array.sort((a, b) => roleIds.indexOf(a.role_id) - roleIds.indexOf(b.role_id))
}

async function close() {
	if (isSubmitting.value) return
	isOpen.value = false
	await useWait(200)
	item.value = undefined
	accessControls.value = undefined
	selectedAccessControl.value = undefined
}
</script>

<template>
	<Teleport to="body"> <!-- To make it appear over the modal -->
		<SaveChangesPopup v-if="item && accessControls && haveChanged()" :submit="save" :reset="resetChanges"
		                  :is-loading="isSubmitting"/>
	</Teleport>

	<UModal class="z-40" v-if="item && accessControls" v-model="isOpen" :prevent-close="isSubmitting" @close="close"
	        :ui="{base: haveChanged() ? 'max-md:mb-24' : ''}">
		<UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }" @click.prevent>
			<template #header>
				<div class="flex items-center justify-between font-semibold">
					<span>
						Manage
						<span class="font-bold px-2 py-1 bg-gray-100 dark:bg-gray-600 rounded">
							{{ item.name }}{{ item.ext ? "." + item.ext : "" }}
						</span>
						Access
					</span>
					<UButton v-if="!isSubmitting" color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid"
					         class="-my-1" @click="close"/>
				</div>
			</template>

			<template #default>
				<div class="flex md:divide-x divide-gray-200 dark:divide-gray-700" v-if="item && accessControls">
					<div :class="(selectedAccessControl ? 'max-md:hidden ' : '') + 'space-y-2 max-md:w-full md:mr-4'">
						<UButton v-for="accessControl in accessControls" color="gray" variant="ghost" block
						         class="group flex-between gap-2" @click="selectedAccessControl = accessControl">
							<span class="flex-start gap-1.5">
								<span class="w-2.5 h-2.5 rounded-full"
								      :style="{backgroundColor: findRole(accessControl.role_id)?.color ?? defaultRoleColor}"/>
								<span class="text-nowrap">{{ findRole(accessControl.role_id)?.name }}</span>
							</span>
							<UIcon name="i-heroicons-x-mark-20-solid"
							       class="md:opacity-0 group-hover:md:opacity-95 transition-opacity"
							       @click.stop="removeAccessControl(accessControl)"/>
						</UButton>

						<span v-if="workspace.roles.find(r => !accessControls?.find(ac => ac.role_id === r.id))">
							<UDivider class="my-2 opacity-0"/>

							<UPopover>
								<UButton color="gray" variant="ghost" class="text-nowrap" block
								         leading-icon="i-heroicons-plus-20-solid">
									Add Role
								</UButton>

								<template #panel="{ close }">
									<span v-for="role in workspace.roles">
										<UButton v-if="!accessControls.find(ac => ac.role_id === role.id)" size="sm"
										         block color="gray" variant="ghost" @click="addRole(role.id); close();">
											<span class="flex-start gap-1.5 w-full">
												<span class="w-2.5 h-2.5 rounded-full"
												      :style="{backgroundColor: role.color ?? defaultRoleColor}"/>
												{{ role.name }}
											</span>
										</UButton>
									</span>
								</template>
							</UPopover>
						</span>
					</div>
					<div :class="(selectedAccessControl ? '' : 'max-md:hidden ') + 'md:pl-4 w-full text-left'">
						<div v-if="selectedAccessControl">
							<button class="md:hidden mb-2 font-semibold flex-start gap-1.5 hover:underline"
							        @click="() => selectedAccessControl = undefined">
								<UIcon name="i-heroicons-arrow-left-16-solid"/>
								Back
							</button>
							<div class="flex-start gap-1.5">
								<span class="w-3 h-3 rounded-full"
								      :style="{backgroundColor: findRole(selectedAccessControl.role_id)?.color ?? defaultRoleColor}"/>
								<p class="text-lg font-semibold">{{ findRole(selectedAccessControl.role_id)?.name }}</p>
							</div>
							<p class="text-sm opacity-60">
								Manage permissions of @{{ findRole(selectedAccessControl.role_id)?.name }} for this item
							</p>
							<UDivider class="my-3 opacity-50"/>
							<PermissionManager type="tri-toggle" :permissions="selectedAccessControl.permissions"
							                   inline/>
						</div>
					</div>
				</div>
			</template>
		</UCard>
	</UModal>
</template>
