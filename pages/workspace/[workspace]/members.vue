<script setup lang="ts">
import type {Ref} from "vue";
import type Member from "~/types/user/Member";
import type Role from "~/types/permission/Role";
import View from "~/types/View";
import type InviteCode from "~/types/InviteCode";
import Permission from "~/types/permission/Permission";

useView().value = View.MEMBERS
const runtimeConfig = useRuntimeConfig()
const workspace = useWorkspace()
const defaultRoleColor = runtimeConfig.public.defaultRoleColor

const columns = [{
	key: 'name',
	label: 'Name'
}, {
	key: 'user.email',
	label: 'Email'
}, {
	key: 'roles',
	label: 'Roles'
}, {
	key: 'actions',
	label: 'Actions'
}]

const members: Ref<Member[]> = ref([])
const selected: Ref<Member[]> = ref([])

const isLoading: Ref<boolean> = ref(true)
const loadingRoleIds: Ref<string[]> = ref([])

const isCreatingInviteCode: Ref<boolean> = ref(false)
const inviteCode: Ref<InviteCode | undefined> = ref()

const isTransferringOwnership: Ref<boolean> = ref(false)
const ownershipTransferTarget: Ref<Member | undefined> = ref()

const isKickingMember: Ref<boolean> = ref(false)
const kickTarget: Ref<Member | undefined> = ref()

const fetchMembers = async () => {
	const res = await useApiFetch("/workspaces/" + workspace.value.id + "/members")
	if (res.ok) {
		members.value = await res.json() as Member[]
		isLoading.value = false
	} else useErrorToast("Error while trying to fetch members.")
}

onMounted(() => {
	fetchMembers()
	useRefreshView().value = fetchMembers
})


async function toggleRole(member: Member, role: Role) {
	if (loadingRoleIds.value.includes(role.id)) return
	loadingRoleIds.value.push(role.id)

	function toggle() {
		if (!!member.roles.find(r => r.id === role.id)) member.roles = member.roles.filter(r => r.id !== role.id)
		else member.roles.push(role)
		member.roles.sort((a, b) => b.position - a.position);
	}

	toggle()

	async function checkResponse(res: Response): Promise<boolean> {
		const newMember: Member = await res.json()
		return !!member.roles.find(r => r.id === role.id) === !!newMember.roles.find(r => r.id === role.id)
	}

	const res = await useApiFetch(`/workspaces/${workspace.value.id}/members/${member.id}`, {
		method: "PATCH",
		body: JSON.stringify({
			roles: member.roles.map(r => r.id)
		})
	})

	if (!res.ok || !(await checkResponse(res))) {
		toggle()
		useErrorToast("Unable to edit member roles")
	}
	loadingRoleIds.value = loadingRoleIds.value.filter(id => id !== role.id)
}

async function createInviteCode() {
	if (isCreatingInviteCode.value) return
	if (inviteCode.value) {
		await copyCode()
		return
	}

	isCreatingInviteCode.value = true
	const res = await useApiFetch(`/workspaces/${workspace.value.id}/invites`, {
		method: "POST"
	})
	if (res.ok) {
		inviteCode.value = await res.json()
		await copyCode()
	} else useErrorToast("Failed to create an invite code")
	isCreatingInviteCode.value = false
}

async function copyCode() {
	if (inviteCode.value) {
		await navigator.clipboard.writeText(runtimeConfig.public.baseUrl + "/i/" + inviteCode.value.code)
		useSuccessToast("Invite code copied !")
	}
}

async function openTransferOwnershipModal(target: Member) {
	isTransferringOwnership.value = true
	ownershipTransferTarget.value = target
}


async function openKickMemberModal(target: Member) {
	isKickingMember.value = true
	kickTarget.value = target
}
</script>

<template>
	<ModalWorkspaceOwnershipTransfer v-model="isTransferringOwnership" :target="ownershipTransferTarget"
	                                 v-if="ownershipTransferTarget"/>
	<ModalKickMember v-model="isKickingMember" :target="kickTarget" v-if="kickTarget"/>

	<NuxtLayout name="workspace">
		<div class="py-6 px-8 space-y-4 w-full">
			<div class="flex-between">
				<h1 class="font-bold text-xl">Members</h1>
				<UButton icon="i-heroicons-plus" @click="createInviteCode" :loading="isCreatingInviteCode">
					Invite a Member
				</UButton>
			</div>
			<UTable v-model="selected" :columns="columns" :rows="members" :loading="isLoading">
				<template #loading-state>
					<div class="flex-center h-32">
						<Loader :size="28"/>
					</div>
				</template>

				<template #name-data="{ row: member }">
					<div :class="[selected.find(m => m.id === member.id) && 'font-bold', 'flex-start gap-2']">
						{{ member.user.name }}
						<IconOwner class="h-4" v-if="member.is_owner"/>
					</div>
				</template>

				<template #roles-data="{ row: member }">
					<div class="flex flex-wrap gap-2 text-gray-700 dark:text-gray-300">
							<span v-for="role in member.roles.filter((r: Role) => !r.is_default)">
								<span class="group py-1 px-2 rounded flex-center gap-2 text-sm"
								      :style="{backgroundColor: ((role.color ?? defaultRoleColor) + '20')}">
										<span class="h-3 w-3 flex-center rounded-full"
										      :style="{backgroundColor: role.color ?? defaultRoleColor}">
											<UIcon name="i-heroicons-x-mark-16-solid" @click="toggleRole(member, role)"
											       class="hidden group-hover:block opacity-75 hover:opacity-100 cursor-pointer"
											       v-if="role.editable && workspace.access[Permission.EDIT_PERMISSIONS]"
											       :style="{color: getContrastColor(role.color ?? defaultRoleColor)}"/>
										</span>
										{{ role.name }}
								</span>
							</span>
						<div v-if="workspace.access[Permission.EDIT_PERMISSIONS]">
							<UPopover>
								<UButton color="white" icon="i-heroicons-plus"/>

								<template #panel>
									<UButton
										v-for="role in workspace.roles.filter(r => !r.is_default && r.editable)"
										color="gray" variant="ghost" @click="toggleRole(member, role)"
										class="w-full flex-between gap-5 rounded-none cursor-pointer">
										<div class="flex-center gap-2">
												<span class="h-3 w-3 rounded-full"
												      :style="{backgroundColor: role.color ?? defaultRoleColor}"/>
											<span class="truncate">{{ role.name }}</span>
										</div>
										<Loader v-if="loadingRoleIds.includes(role.id)" :size="12" :thickness="2"/>
										<UCheckbox v-else
										           :model-value="!!member.roles.find((r: Role) => r.id === role.id)"/>
									</UButton>
								</template>
							</UPopover>
						</div>
					</div>
				</template>

				<template #actions-data="{ row: member }">
					<div v-if="workspace.member.id !== member.id && workspace.owner_id !== member.id
									&& (workspace.member.position > member.position || workspace.owner)">
						<UPopover>
							<UButton color="white" icon="i-heroicons-ellipsis-vertical"/>

							<template #panel>
								<UButton v-if="workspace.owner " color="gray" variant="ghost" size="md"
								         block :ui="{block: 'justify-start', rounded: 'rounded-none'}"
								         icon="i-heroicons-user-minus" @click="openKickMemberModal(member)">
									Kick
								</UButton>
								<UButton v-if="workspace.owner " color="red" variant="ghost" icon="i-heroicons-key"
								         size="md" block :ui="{block: 'justify-start', rounded: 'rounded-none'}"
								         @click="openTransferOwnershipModal(member)">
									Transfer ownership
								</UButton>
							</template>
						</UPopover>
					</div>
				</template>
			</UTable>
		</div>
	</NuxtLayout>
</template>
