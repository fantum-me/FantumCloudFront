<script setup lang="ts">
import type PermissionObject from "~/types/permission/PermissionObject";
import Permission from "~/types/permission/Permission";

const {permissions, type, inline} = defineProps<{
	permissions: PermissionObject,
	type: "boolean" | "tri-toggle",
	inline?: boolean
}>()

const toggles = [
	{
		title: "Can Read",
		description: "Allow user to read files",
		permission: Permission.READ},
	{
		title: "Can Write",
		description: "Allow user to write files",
		permission: Permission.WRITE},
	{
		title: "Can Trash",
		description: "Allow user to move files to trash",
		permission: Permission.TRASH},
	{
		title: "Can Delete",
		description: "Allow user to delete trashed files",
		permission: Permission.DELETE},
	{
		title: "Can Edit Permissions",
		description: "Allow user to edit files permissions",
		permission: Permission.EDIT_PERMISSIONS
	},
	{
		title: "Can Manage Members",
		description: "Allow user to list and kick workspace members",
		permission: Permission.MANAGE_MEMBERS,
		hidden: type !== "boolean"
	},
]

const workspace = useWorkspace()
</script>

<template>
	<div :class="'space-y-5 text-left ' + (type === 'boolean' ? '*:cursor-pointer' : '*:cursor-default')">
		<div v-for="{title, description, permission} in toggles.filter(t => !t.hidden)"
		     :class="(inline ? 'flex-between gap-4' : '') + ' ' + (workspace.access[permission] ? '' : 'opacity-50')"
		     @click.prevent="type === 'boolean' && workspace.access[permission] ?
		     permissions[permission] = !permissions[permission] : null">
			<div>
				<p class="font-medium text-sm">
					{{ title }}
					<UIcon name="i-heroicons-no-symbol" v-if="!workspace.access[permission]" class="scale-150 ml-1 -mb-0.5" />
				</p>
				<p class="text-sm opacity-50">{{ description }}</p>
			</div>
			<TriToggle v-if="type === 'tri-toggle'" name="read" v-model="permissions[permission]" :disabled="!workspace.access[permission]"/>
			<UToggle v-else name="read" :model-value="!!permissions[permission]" :disabled="!workspace.access[permission]"/>
		</div>
	</div>
</template>
