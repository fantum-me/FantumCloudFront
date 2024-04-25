<script setup lang="ts">
import Permission from "~/types/Permission";
import View from "~/types/View";

type sidebarItem = [view: View, label: string, icon: string, activeIcon: string, permission?: Permission]

const sidebarItems: sidebarItem[][] = [
	[
		[View.FILES, "All Files", "i-heroicons-cloud", "i-heroicons-cloud-solid"],
		[View.TRASH, "Trash", "i-heroicons-trash", "i-heroicons-trash-solid"],
	],
	[
		[View.MEMBERS, "Members", "i-heroicons-users", "i-heroicons-users-solid"],
		[View.PERMISSIONS, "Roles & Permissions", "i-heroicons-tag", "i-heroicons-tag-solid", Permission.EDIT_PERMISSIONS],
		[View.SETTINGS, "Settings", "i-heroicons-cog-6-tooth", "i-heroicons-cog-6-tooth-solid"],
	]
]

const view = useView()
const workspace = useWorkspace()

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
</script>

<template>
	<UCard class="h-screen flex flex-col rounded-none divide-gray-100"
	       :ui="{body:{base:'flex-1'}, header:{base: 'h-20', padding: 'p-0 sm:p-0'}}">
		<template #header>
			<WorkspaceDropdown/>
		</template>
		<div class="pb-8" v-for="items in sidebarItems">
			<div v-for="[key, title, icon, activeIcon, permission = null] in items">
				<div class="mb-3" v-if="!permission || workspace.access[permission]">
					<NuxtLink :class="'navigation-button' + (view === key ? ' active' : '')"
					          :to="`/workspace/${workspace.id}/${key}`">
						<UIcon v-if="view === key" :name="activeIcon" class="icon"/>
						<UIcon v-else :name="icon" class="icon"/>
						{{ title }}
					</NuxtLink>
				</div>
			</div>
		</div>
		<NuxtLink class="navigation-button" to="/auth/logout" no-prefetch>
			<UIcon name="i-heroicons-arrow-left-start-on-rectangle" class="icon"/>
			Sign Out
		</NuxtLink>

		<template #footer>
			<UProgress :color="usageColor" indicator size="md" :value="workspace.used_space" :max="workspace.quota"/>
			<p class="text-sm opacity-50 mt-1">
				{{ formatSize(workspace.used_space) }} used on {{ formatSize(workspace.quota) }}
			</p>
		</template>
	</UCard>
</template>

<style>
.navigation-button {
	@apply flex items-center gap-2 px-4 py-3 rounded transition-all active:scale-95;

	@apply hover:bg-primary hover:bg-opacity-25;

	&.active {
		@apply text-gray-50 font-medium bg-primary hover:bg-primary hover:bg-opacity-100;
	}

	.icon {
		@apply h-5 w-5;
	}
}
</style>
