<script setup lang="ts">
import type {Ref} from "vue";
import type Workspace from "~/types/api/Workspace";

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
</script>

<template>
	<UPopover disabled :open="isOpen" class="w-full h-20">
		<UButton class="w-full h-20 px-6 flex-between" color="white" variant="ghost" :label="currentWorkspace.name"
		         trailing-icon="i-heroicons-chevron-down-20-solid" @click.prevent="toggle"/>

		<template #panel>
			<div class="w-96">
				<div class="w-full" v-if="workspaces.length > 0">
					<div v-for="workspace in workspaces">
						<UButton :to="'/workspace/' + workspace.id" class="w-full" size="lg"
						         :ui="{ rounded: 'rounded-none' }"  color="gray" variant="ghost"
						         :icon="currentWorkspace.id === workspace.id ? 'i-heroicons-check': null" trailing>
							<div class="w-full flex-between">
								<div>
									<p>{{ workspace.name }}</p>
									<p class="text-xs opacity-75 -mt-1">{{ workspace.member_count }}
										member{{ workspace.member_count > 1 ? 's' : '' }}</p>
								</div>
							</div>
						</UButton>
					</div>
					<div class="p-2 pt-2 mt-2 border-t border-gray-200 dark:border-gray-700">
						<UButton to="/workspace/new" icon="i-heroicons-plus" class="w-full" color="gray" variant="ghost">
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
