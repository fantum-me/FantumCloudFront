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
	<UCard class="h-screen flex flex-col rounded-none divide-none shadow-none ring-0 bg-transparent dark:bg-transparent"
	       :ui="{body:{base:'flex-1 overflow-hidden', padding: 'px-3 py-2 sm:px-3 sm:pb-2 sm:pt-0.5'}, header:{base: 'h-16', padding: 'p-0 sm:p-0'}}">
		<template #header>
			<div class="w-full h-full flex-start ml-5">
				<NuxtImg :src="`/logo/${session.scheme === 'light' ? 'black' : 'white'}.png`" class="w-32"/>
			</div>
		</template>

		<div class="h-full flex flex-col gap-2">
			<SidebarWorkspaceDropdown/>
			<div>
				<UButton color="black" icon="i-heroicons-plus" size="lg" class="mb-3 pr-5"
				         :ui="{ rounded: 'rounded-full' }"
				         @click="addNew">
					Add New
				</UButton>
			</div>


			<SidebarLink v-for="item in sidebarItems.before" :item="item"/>

			<div class="flex-1 py-5 space-y-1 overflow-y-scroll overflow-x-hidden">
				<p class="text-xs opacity-75 ml-2">Cloud</p>
				<SidebarExplorer/>
			</div>

			<SidebarLink v-for="item in sidebarItems.after" :item="item"/>
		</div>

		<template #footer>
			<UProgress :color="usageColor" indicator size="md" :value="workspace.used_space" :max="workspace.quota"/>
			<p class="text-sm opacity-50 mt-1">
				{{ formatSize(workspace.used_space) }} used on {{ formatSize(workspace.quota) }}
			</p>
		</template>
	</UCard>
</template>
