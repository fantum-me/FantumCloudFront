<script setup lang="ts">
import View from "~/types/View";

export type SidebarItem = { view: View, label: string, icon: string, activeIcon: string, hidden?: boolean }

const session = useSession()
const view = useView()
const folder = useFolder()
const workspace = useWorkspace()

const sidebarItems: { before: SidebarItem[], after: SidebarItem[] } = {
	before: [
		{
			view: View.HOME,
			label: "Home",
			icon: "i-heroicons-home",
			activeIcon: "i-heroicons-home-solid"
		},
		{
			view: View.MEMBERS,
			label: "Members",
			icon: "i-heroicons-users",
			activeIcon: "i-heroicons-users-solid",
			hidden: !workspace.value.access.manage_members
		},
		{
			view: View.PERMISSIONS,
			label: "Roles & Permissions",
			icon: "i-heroicons-tag",
			activeIcon: "i-heroicons-tag-solid",
			hidden: !workspace.value.access.edit_permissions
		}
	],
	after: [
		{
			view: View.SETTINGS,
			label: "Settings",
			icon: "i-heroicons-cog-6-tooth",
			activeIcon: "i-heroicons-cog-6-tooth-solid"
		},
		{
			view: View.TRASH,
			label: "Trash",
			icon: "i-heroicons-trash",
			activeIcon: "i-heroicons-trash-solid"
		}
	]
}

const usage = ref(workspace.value.used_space / workspace.value.quota * 100)

const usageColor = computed(() => {
	switch (true) {
		case usage.value < 10:
			return 'green'
		case usage.value < 70:
			return 'primary'
		case usage.value < 80:
			return 'amber'
		case usage.value < 95:
			return 'orange'
		default:
			return 'red'
	}
})

function addNew() {
	useFolderContextMenu().value.open(
		[View.FILES, View.FOLDER].includes(view.value) ? folder.value : useItem(workspace.value.root).value,
		true
	)
}
</script>

<template>
	<div class="h-full w-64 shrink-0 flex flex-col pb-2">
		<div class="w-full h-16 flex-start pl-5 shrink-0">
			<NuxtImg :src="`/logo/${session.scheme === 'light' ? 'black' : 'white'}.png`" class="w-32"/>
		</div>

		<div class="flex-1 h-full flex flex-col gap-2 overflow-hidden">
			<SidebarWorkspaceDropdown/>
			<div>
				<UButton color="black" icon="i-heroicons-plus" size="lg" class="mb-3 pr-5"
				         :ui="{ rounded: 'rounded-full' }"
				         @click="addNew">
					Add New
				</UButton>
			</div>


			<SidebarLink v-for="item in sidebarItems.before" :item="item"/>

			<p class="text-xs opacity-75 ml-2 mt-4">Cloud</p>
			<div class="flex-1 mb-5 overflow-y-scroll overflow-x-hidden">
				<SidebarExplorer/>
			</div>

			<SidebarLink v-for="item in sidebarItems.after" :item="item"/>
		</div>

		<div class="mt-8 mx-2">
			<UProgress :color="usageColor" indicator size="md" :value="workspace.used_space" :max="workspace.quota"/>
			<p class="text-sm opacity-50 mt-1">
				{{ formatSize(workspace.used_space) }} used on {{ formatSize(workspace.quota) }}
			</p>
		</div>
	</div>
</template>
