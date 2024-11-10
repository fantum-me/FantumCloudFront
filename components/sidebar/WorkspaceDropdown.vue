<script setup lang="ts">
import type {Ref} from "vue";
import type Workspace from "~/types/Workspace";

const currentWorkspace = useWorkspace()
const workspaces: Ref<Workspace[]> = ref([]);
const isOpen = ref(false);

async function fetchWorkspaces() {
	const res = await useApiFetch('/workspaces');
	if (res.ok) workspaces.value = await res.json();
	else useErrorToast("Failed to fetch workspaces")
}

function toggle() {
	if (!isOpen.value) fetchWorkspaces();
	isOpen.value = !isOpen.value;
}

function switchToWorkspace(id: string) {
	// @ts-ignore
	useFolder().value = undefined;
	useItemsSelection().value = [];
	navigateTo("/workspace/" + id)
}
</script>

<template>
	<UPopover disabled :open="isOpen" class="w-full h-16">
		<UButton class="w-full flex-between" size="lg" color="primary" variant="sidebar"
		         trailing-icon="i-heroicons-chevron-down-20-solid" @click.prevent="toggle">
			<span class="text-start flex flex-col space-y-0.5">
				<span>{{ currentWorkspace.name }}</span>
				<span class="text-xs opacity-75">
					{{ currentWorkspace.member_count }} member{{ currentWorkspace.member_count > 1 ? 's' : '' }}
				</span>
			</span>
		</UButton>

		<template #panel>
			<div class="w-96">
				<div class="w-full" v-if="workspaces.length > 0">
					<div v-for="workspace in workspaces">
						<UButton @click="switchToWorkspace(workspace.id)" class="w-full" size="lg"
						         :ui="{ rounded: 'rounded-none' }" color="gray" variant="ghost"
						         :icon="currentWorkspace.id === workspace.id ? 'i-heroicons-check': undefined" trailing>
							<div class="w-full text-start">
								<p :class="currentWorkspace.id === workspace.id ? 'font-bold' : ''">
									{{ workspace.name }}
								</p>
								<p class="text-xs opacity-75 -mt-1">{{ workspace.member_count }}
									member{{ workspace.member_count > 1 ? 's' : '' }}</p>
							</div>
						</UButton>
					</div>
					<div class="p-2 pt-2 mt-2 border-t border-gray-200 dark:border-gray-700">
						<UButton to="/workspace/new" icon="i-heroicons-plus" class="w-full" color="gray"
						         variant="ghost">
							Create a new Workspace
						</UButton>
					</div>
				</div>
				<div v-else class="w-full py-8 flex-center">
					<p>Loading</p>
				</div>
			</div>
		</template>
	</UPopover>
</template>
