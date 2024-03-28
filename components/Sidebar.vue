<script setup lang="ts">
import {
	ArrowLeftStartOnRectangleIcon as LogoutIcon,
	ChartPieIcon as StorageIcon,
	CloudIcon,
	Cog6ToothIcon as SettingsIcon,
	CreditCardIcon,
	StarIcon,
	TagIcon,
	TrashIcon,
	UsersIcon
} from "@heroicons/vue/24/outline";
import {
	ChartPieIcon as StorageSolidIcon,
	CloudIcon as CloudSolidIcon,
	Cog6ToothIcon as SettingsSolidIcon,
	CreditCardIcon as CreditCardSolidIcon,
	StarIcon as StarSolidIcon,
	TagIcon as TagSolidIcon,
	TrashIcon as TrashSolidIcon,
	UsersIcon as UsersSolidIcon,
} from "@heroicons/vue/24/solid";
import Permission from "~/lib/Permission";
import View from "~/lib/View";

const sidebarItems = [
	[
		[View.FILES, "All Files", CloudIcon, CloudSolidIcon],
		[View.FAVORITES, "Favorites", StarIcon, StarSolidIcon],
		[View.TRASH, "Trash", TrashIcon, TrashSolidIcon],
	],
	[
		[View.MEMBERS, "Members", UsersIcon, UsersSolidIcon],
		[View.PERMISSIONS, "Roles & Permissions", TagIcon, TagSolidIcon, Permission.EDIT_PERMISSIONS],
	],
	[
		[View.STORAGE, "Storage", StorageIcon, StorageSolidIcon],
		[View.BILLINGS, "Plans & Billing", CreditCardIcon, CreditCardSolidIcon],
		[View.SETTINGS, "Settings", SettingsIcon, SettingsSolidIcon],
	]
]

const view = useView()
const workspace = useWorkspace()
</script>

<template>
	<UCard class="h-screen flex flex-col rounded-none divide-gray-100"
	       :ui="{body:{base:'flex-1'}, header:{base: 'h-20', padding: 'p-0 sm:p-0'}}">
		<template #header>
			<WorkspaceDropdown/>
		</template>
		<div class="pb-8" v-for="items in sidebarItems">
			<div v-for="[key, title, DefaultIcon, ActiveIcon, permission = null] in items">
				<div class="mb-3" v-if="!permission || workspace.access[permission]">
					<NuxtLink :class="view === key ? 'button-primary static' : 'button hover:bg-secondary'"
					          :href="`/workspace/${workspace.id}/${key}`">
						<component :is="view === key ? ActiveIcon : DefaultIcon" class="icon"/>
						{{ title }}
					</NuxtLink>
				</div>
			</div>
		</div>
		<a class="button hover:bg-secondary" href="/auth/logout">
			<component :is="LogoutIcon" class="icon"/>
			Sign Out
		</a>
	</UCard>
</template>
