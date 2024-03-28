<script setup lang="ts">
import View from "~/lib/View";
import type {Ref} from "vue";
import type Member from "~/types/api/Member";
import type Role from "~/types/api/Role";

useView().value = View.MEMBERS
const workspace = useWorkspace()
const defaultRoleColor = useRuntimeConfig().public.defaultRoleColor

const columns = [{
	key: 'name',
	label: 'Name'
}, {
	key: 'email',
	label: 'Email'
}, {
	key: 'roles',
	label: 'Roles'
}]

const members: Ref<Member[]> = ref([])

const isLoading: Ref<boolean> = ref(true)
const loadingRoleIds: Ref<string[]> = ref([])
const selected = ref([])

onMounted(async () => {
	const res = await useApiFetch("/workspaces/" + workspace.value.id + "/members")
	if (res.ok) {
		members.value = await res.json() as Member[]
		isLoading.value = false
	} else useErrorToast("Error while trying to fetch members.")
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
		method: "POST",
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
</script>

<template>
	<div class="p-6 w-full">
		<UCard class="w-full">
			<UTable v-model="selected" :columns="columns" :rows="members" :loading="isLoading">
				<template #loading-state>
					<div class="flex-center h-32">
						<p>Loading...</p>
					</div>
				</template>

				<template #name-data="{ row: member }">
					<div :class="[selected.find(m => m.id === member.id) && 'font-bold', 'flex-start gap-2']">
						{{ member.name }}
						<IconOwner class="h-4"/>
					</div>
				</template>

				<template #roles-data="{ row: member }">
					<div class="flex flex-wrap gap-2 text-gray-700 dark:text-gray-300">
						<span v-for="role in member.roles.filter(r => !r.is_default)">
							<span class="py-1 px-2 rounded flex-center gap-2 text-sm"
							      :style="{backgroundColor: ((role.color ?? defaultRoleColor) + '20')}">
									<span class="h-3 w-3 flex-center rounded-full group cursor-pointer"
									      :style="{backgroundColor: role.color ?? defaultRoleColor}"
									      @click="toggleRole(member, role)">
										<UIcon name="i-heroicons-x-mark"
										       class="hidden group-hover:block m-px text-white"/>
									</span>
									{{ role.name }}
							</span>
						</span>
						<div> <!-- This fix the popover display bug -->
							<UPopover>
								<UButton color="white" icon="i-heroicons-plus"/>

								<template #panel>
									<UButton v-for="role in workspace.roles.filter(r => !r.is_default)"
									         color="gray" variant="ghost" @click="toggleRole(member, role)"
									         class="w-full flex-between gap-5 rounded-none cursor-pointer">
										<div class="flex-center gap-2">
												<span class="h-3 w-3 rounded-full"
												      :style="{backgroundColor: role.color ?? defaultRoleColor}"/>
											<span class="truncate">{{ role.name }}</span>
										</div>
										<Loader v-if="loadingRoleIds.includes(role.id)" class="h-3 w-3"/>
										<UCheckbox v-else
										           :model-value="!!member.roles.find(r => r.id === role.id)"/>
									</UButton>
								</template>
							</UPopover>
						</div>
					</div>
				</template>
			</UTable>
		</UCard>
	</div>
</template>
