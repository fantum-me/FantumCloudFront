<script setup lang="ts">
import type {SidebarItem} from "~/components/sidebar/Sidebar.vue";

const {item} = defineProps<{item: SidebarItem}>()

const view = useView()
const workspace = useWorkspace()
</script>

<template>
	<UButton v-if="!item.hidden" color="primary" :variant="view === item.view ? 'active': 'sidebar'" size="sm" block
	         class="justify-start" :icon="view === item.view ? item.activeIcon : item.icon"
	         :to="`/workspace/${workspace.id}/${item.view}`" :data-target="item.view">
		{{ item.label }}
	</UButton>
</template>
