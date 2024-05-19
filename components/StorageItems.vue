<script setup lang="ts">
import type Folder from "~/types/api/Folder";
import type File from "~/types/api/File";
import {DragSelect} from "@coleqiu/vue-drag-select";
import type {ItemDisplay} from "~/components/item/Item.vue";
import type {Ref} from "vue";


const props = defineProps<{
	folders: Folder[],
	files: File[]
}>()

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
	<drag-select v-model="itemsSelection" class="w-full h-full" :draggable-on-option="false" @click="unfocusInputs">
		<div class="flex-between gap-3">
			<div>
				<slot/>
			</div>
			<UButton v-if="display === 'card'" color="gray" variant="ghost" icon="i-heroicons-list-bullet" @click="setDisplay('line')"/>
			<UButton v-else color="gray" variant="ghost" icon="i-heroicons-squares-2x2" @click="setDisplay('card')"/>
		</div>
		<div :class="'pb-28 transition-[gap] ' + (display === 'card' ? 'items-grid' : 'items-list')">
			<Item :display="display" v-for="folder in props.folders" :item="folder" :key="folder.id"/>
			<Item :display="display" v-for="file in props.files" :item="file" :key="file.id"/>
		</div>
	</drag-select>
</template>

<style>
.drag-select {
	@apply w-full h-full p-6 md:p-12;
	container-type: inline-size;
}

.drag-select__area {
	@apply bg-primary opacity-25 rounded !important;
}
</style>
