<script setup lang="ts">
import type PermissionObject from "~/types/permission/PermissionObject";
import Permission from "~/types/permission/Permission";

const permissions = defineModel<PermissionObject>({required: true})
const {type, inline} = defineProps<{
	type: "boolean" | "tri-toggle",
	inline?: boolean
}>()

const workspace = useWorkspace()

const toggles = [
	{
		title: "Can Read",
		description: "Allow user to read files",
		permission: Permission.READ
	},
	{
		title: "Can Write",
		description: "Allow user to write files",
		permission: Permission.WRITE
	},
	{
		title: "Can Trash",
		description: "Allow user to move files to trash",
		permission: Permission.TRASH
	},
	{
		title: "Can Delete",
		description: "Allow user to delete trashed files",
		permission: Permission.DELETE
	},
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

function onClick(permission: Permission) {
	if (type === "boolean" && workspace.value.access[permission]) {
		permissions.value[permission] = !permissions.value[permission]
	}
}
</script>

<template>
	<div :class="'space-y-5 text-left ' + (type === 'boolean' ? '*:cursor-pointer' : '*:cursor-default')">
		<p>{{ JSON.stringify(permissions) }}</p>
		<div v-for="{title, description, permission} in toggles.filter(t => !t.hidden)"
		     :class="{'flex-between gap-4': inline, 'opacity-50': !workspace.access[permission]}"
		     @click.prevent="onClick(permission)">
			<div>
				<p class="font-medium text-sm">
					{{ title }}
					<UIcon v-if="!workspace.access[permission]" class="scale-150 ml-1 -mb-0.5"
					       name="i-heroicons-no-symbol"/>
				</p>
				<p class="text-sm opacity-50">{{ description }}</p>
			</div>
			<TriToggle v-if="type === 'tri-toggle'" v-model="permissions[permission]" :disabled="!workspace.access[permission]"
			           name="read"/>
			<UToggle v-else :disabled="!workspace.access[permission]" :model-value="!!permissions[permission]"
			         name="read"/>
		</div>
	</div>
</template>
