<script setup lang="ts">
import type Role from "~/types/permission/Role";

const selectedRole = defineModel<Role>()

const workspace = useWorkspace()
const draggingRoleId = ref<number | null>(null);
const dropIndex = ref<number | null>(null);
const isLoading = ref(false);

const handleDragStart = (e: DragEvent, role: Role) => {
	if (role.is_default) e.preventDefault()
	else draggingRoleId.value = role.position;
};

const handleDragEnd = () => {
	draggingRoleId.value = null;
	dropIndex.value = null;
};

const handleDragOver = (e: DragEvent, index: number) => {
	e.preventDefault();
	if (draggingRoleId.value) {
		if (draggingRoleId.value - 1 === index || draggingRoleId.value === index) dropIndex.value = null
		else dropIndex.value = index
	}
};

const handleDrop = async (targetRole: Role) => {
	if (isLoading.value || draggingRoleId.value === null || dropIndex.value === null) return;
	if (!targetRole.editable) return;
	isLoading.value = true;

	const role = workspace.value.roles.find((r: Role) => r.position === draggingRoleId.value);
	if (!role) return
	let targetPos = targetRole.position;

	if (targetPos < role.position) targetPos++;

	const res = await useApiFetch(`/workspaces/${workspace.value.id}/roles/${role.id}`, {
		method: 'PATCH',
		body: JSON.stringify({
			position: targetPos
		})
	});
	if (res.ok) useRefreshView().value();
	else useErrorToast('Failed to reorder roles');

	dropIndex.value = null;
	draggingRoleId.value = null;
	isLoading.value = false;
};
</script>

<template>
	<div class="w-full">
		<div v-if="isLoading" class="z-50 fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-25 flex-center">
			<p class="-mt-32">Loading...</p>
		</div>
		<div class="space-y-2">
			<div class="space-y-1">
				<div v-for="role in workspace.roles" :key="role.position" class="relative">
					<span v-if="role.editable && dropIndex === role.position" class="absolute z-50 h-1 w-full bg-primary"></span>
					<UButton color="gray" variant="ghost" class="w-full p-0" size="lg"
					         draggable="true" @dragstart="handleDragStart($event, role)" @dragend="handleDragEnd"
					         @dragover="handleDragOver($event, role.position)" @drop="handleDrop(role)">
						<p :class="(role.id === selectedRole?.id ? 'bg-gray-200 dark:bg-gray-700 ' : '') + 'px-3 py-2.5 w-full text-start flex-start gap-3 rounded select-none'"
						   @click="role.editable ? selectedRole = role : null">
							<UIcon v-if="!role.editable" name="i-heroicons-lock-closed-solid" class="h-5 w-5 opacity-75"/>
							<span class="h-3 w-3 rounded-full" :style="{ backgroundColor: role.color ?? '#555' }"/>
							{{ role.name }}
						</p>
					</UButton>
				</div>
			</div>
		</div>
	</div>
</template>
