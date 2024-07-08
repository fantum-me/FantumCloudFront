<script setup lang="ts">
import {DragSelect} from "@coleqiu/vue-drag-select";
import type {ItemDisplay} from "~/components/item/Item.vue";
import type {Ref} from "vue";
import type StorageItem from "~/types/api/StorageItem";


const props = defineProps<{
	items: StorageItem[],
}>()

const session = useSession()
const detailsPanel = useDetailsPanel()
const itemsSelection = useItemsSelection()

const display: Ref<ItemDisplay> = ref(localStorage.getItem("items_display") as ItemDisplay ?? "card")
const setDisplay = (value: ItemDisplay) => {
	localStorage.setItem("items_display", value)
	display.value = value
}


function unfocusInputs() {
	document.querySelectorAll('input:focus').forEach((element) => {
		if (element instanceof HTMLInputElement) element.blur();
	});
}
</script>

<template>
	<div class="h-14 px-6 flex-between gap-3 border-b border-gray-100 dark:border-gray-700"
	     @click="itemsSelection = []">
		<div>
			<slot/>
		</div>
		<div>
			<UButton v-if="display === 'card'" color="gray" variant="ghost" icon="i-heroicons-list-bullet"
			         @click="setDisplay('line')"/>
			<UButton v-else color="gray" variant="ghost" icon="i-heroicons-squares-2x2"
			         @click="setDisplay('card')"/>
			<UButton color="primary" :variant="detailsPanel ? 'ghost' : 'inactive'"
			         class="hover:bg-primary-50 dark:hover:bg-primary-300 dark:hover:bg-opacity-25 max-lg:hidden"
			         :ui="{rounded: 'rounded-full'}"
			         icon="i-heroicons-information-circle" @click="detailsPanel = !detailsPanel"/>
		</div>
	</div>
	<drag-select v-model="itemsSelection" class="h-full w-full" :draggable-on-option="false"
	             @click="unfocusInputs">
		<div v-if="props.items.length > 0" :class="(display === 'card' ? 'space-y-8 ' : '') + 'p-8'">
			<div v-if="props.items.filter(i => isFolder(i)).length > 0" class="space-y-2">
				<p class="text-sm text-gray-700 dark:text-gray-300 font-medium select-none" v-if="display === 'card'">
					Folders
				</p>
				<div :class="'transition-[gap] ' + (display === 'card' ? 'items-grid' : 'items-list')">
					<Item :display="display" v-for="f in props.items.filter(i => isFolder(i))" :item="f" :key="f.id"/>
				</div>
			</div>
			<div v-if="props.items.filter(i => isFile(i)).length > 0" class="space-y-2">
				<p class="text-sm text-gray-700 dark:text-gray-300 font-medium select-none" v-if="display === 'card'">
					Files
				</p>
				<div :class="'transition-[gap] ' + (display === 'card' ? 'items-grid' : 'items-list')">
					<Item :display="display" v-for="f in props.items.filter(i => isFile(i))" :item="f" :key="f.id"/>
				</div>
			</div>
		</div>
		<div v-else class="w-full h-full flex-center flex-col gap-8 select-none">
			<h1 class="text-2xl font-semibold">No items found</h1>
			<NuxtImg :src="`/illustration/${session.scheme}/inspect.png`" class="max-w-64 opacity-90"/>
		</div>
	</drag-select>
</template>

<style>
.drag-select {
	@apply w-full h-full flex flex-col overflow-y-auto relative pb-20;
	container-type: inline-size;
}

.drag-select__area {
	@apply bg-primary opacity-25 rounded !important;
}
</style>
