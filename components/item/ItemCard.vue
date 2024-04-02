<script setup lang="ts">
import type StorageItem from "~/types/api/StorageItem";
import moment from "moment/moment";
import {DragSelectOption} from "@coleqiu/vue-drag-select";
import type StorageItemSummary from "~/types/api/StorageItemSummary";

const {item} = defineProps<{
	item: StorageItem,
}>()

const ext = isFile(item) ? item.ext : ""
const icon = getStorageItemIcon(item)
const type = isFile(item) ? "file" : "folder"

const itemsSelection = useItemsSelection()
const itemsDragging = useItemsDragging()
const hiddenItems = useHiddenItems()
let lastSelection: Array<string> = []

const summary = {
	id: item.id,
	type: type,
	ext: ext,
	name: item.name,
	access: item.access
} as StorageItemSummary
const encodedSummary = encodeSummary(summary)

function onContextMenu() {
	if (!itemsSelection.value.includes(encodedSummary)) itemsSelection.value = [encodedSummary]
	useItemsContextMenu().value.open()
}

function onDragStart() {
	if (!itemsSelection.value.includes(encodedSummary)) itemsSelection.value = [encodedSummary]
	lastSelection = itemsSelection.value
	itemsDragging.value = true
	window.addEventListener("mouseup", onDragEnd)
}

function onDragEnd(e: MouseEvent) {
	itemsDragging.value = false
	useWait(1) // executing after the onClick event to reselect elements
		.then(() => {
			itemsSelection.value = lastSelection
			window.removeEventListener("mouseup", onDragEnd)

			if (useFolder().value && e.target && asHtmlElement(e.target)) {
				const target = e.target.closest('[data-type="folder"]')
				if (target) {
					const targetId = target.getAttribute("id")
					if (targetId) {
						const items: StorageItemSummary[] = lastSelection.map(item => decodeSummary(item))
						moveItems(items, useFolder().value.id, targetId)
					}
				}
			}
		})
}

const cardConfig = {
	divide: "",
	header: {padding: 'p-3 sm:p-4'},
	body: {padding: 'py-0 sm:py-0 px-3 sm:px-4'},
	footer: {padding: 'py-2 sm:py-3 px-3 sm:px-4'}
}

const onDblClick = () => type === "folder" ? navigateTo(`/workspace/${useWorkspace().value.id}/folder/${item.id}`) : {}
</script>

<template>
	<drag-select-option :value="encodedSummary" @contextmenu.prevent="onContextMenu" @dblclick="onDblClick"
	                    @dragstart.prevent="onDragStart" draggable="true" :id="item.id" :data-type="type"
						v-if="!hiddenItems.includes(item.id)">
		<UCard class="item-card flex flex-col dark:border border-gray-700 divide-none shadow-none" :ui="cardConfig">
			<template #header>
				<div class="flex-start" :title="item.name + (ext ? '.' + ext : '')">
					<span class=" shrink-0 h-5 w-5 mr-3">
						<icon :id="item.id" :ext="ext"/>
					</span>
					<span class="font-medium text-sm truncate">{{ item.name }}{{ ext ? '.' + ext : '' }}</span>
				</div>
			</template>
			<div>
				<ItemPreview :crop="true" :item="item"/>
			</div>
			<template #footer>
				<div class="flex-start gap-1.5 opacity-60 text-xs">
					{{ formatSize(item.size) }}
					<span class="rounded-full w-[3px] aspect-square shrink-0 bg-current opacity-90 mt-0.5"/>
					<span>{{ moment.unix(item.updated_at).fromNow() }}</span>
				</div>
			</template>
		</UCard>
	</drag-select-option>
</template>

<style>
.drag-select-option--selected > .item-card {
	@apply ring-2 ring-primary -translate-y-1 transition-transform shadow-lg;
}
</style>
