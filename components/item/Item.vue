<script setup lang="ts">
import type StorageItem from "~/types/api/StorageItem";
import moment from "moment/moment";
import {DragSelectOption} from "@coleqiu/vue-drag-select";
import type {Ref} from "vue";

export type ItemDisplay = "card" | "line"

const props = defineProps<{
	item: StorageItem,
	display: ItemDisplay
}>()

const item: Ref<StorageItem> = useItem(props.item.id, props.item)

const icon = getStorageItemIcon(item.value)

const loadingItems = useLoadingItems()
const itemsSelection = useItemsSelection()
const itemsContextMenu = useItemsContextMenu()

function click(e: MouseEvent) {
	if (e.ctrlKey || e.shiftKey) {
		if (itemsSelection.value.includes(item.value.id)) itemsSelection.value = itemsSelection.value.filter(id => item.value.id !== id)
		else itemsSelection.value.push(item.value.id)
	} else itemsSelection.value = [item.value.id]
}

const cardConfig = {
	divide: "",
	header: {padding: 'p-3 sm:p-4'},
	body: {padding: 'py-0 sm:py-0 px-3 sm:px-4'},
	footer: {padding: 'py-2 sm:py-3 px-3 sm:px-4'}
}
</script>

<template>
	<ItemWrapper :id="item.id" :type="display">
		<drag-select-option :value="item.id">
			<UCard :class="(itemsSelection.includes(item.id) ? 'selected' : '') + ' item ' + display"
			       :ui="cardConfig" @click.stop="click">
				<template #header>
					<div class="flex-between gap-3">
						<div class="flex-start gap-3 min-w-0" :title="item.name">
							<span class=" shrink-0 h-5 w-5">
								<icon :id="item.id" :name="item.name"/>
							</span>
							<span class="font-medium text-sm truncate">{{ item.name }}</span>
						</div>
						<UButton v-if="display === 'card'" icon="i-heroicons-ellipsis-vertical" color="gray"
						         variant="ghost" @click="itemsSelection = [item.id]; itemsContextMenu.open()"/>
					</div>
				</template>

				<div v-if="display === 'card' && isFile(item)">
					<ItemPreview :crop="true" :item="item"/>
				</div>

				<div v-if="loadingItems.includes(item.id)"
				     class="absolute w-full h-full top-0 left-0 bg-gray-200 dark:bg-gray-800 rounded-lg bg-opacity-65 dark:bg-opacity-65 flex-center">
					<Loader :size="36" :thickness="4"/>
				</div>

				<template #footer v-if="display === 'line' || isFile(item)">
					<div class="flex-start gap-1.5 opacity-60 text-xs">
						<UIcon v-if="item.in_trash" name="i-heroicons-trash"
						       :class="(display === 'card' ? 'order-1 ' : '') + 'h-4 w-4 mr-2'"/>
						<span>{{ formatSize(item.size) }}</span>
						<span class="dot"/>
						<span>{{ moment.unix(item.updated_at).fromNow() }}</span>
						<div class="relative flex-center w-5 ml-3" v-if="display === 'line'">
							<UButton icon="i-heroicons-ellipsis-vertical" color="gray" class="absolute"
							         variant="ghost" @click="itemsSelection = [item.id]; itemsContextMenu.open()"/>
						</div>
					</div>
				</template>
			</UCard>
		</drag-select-option>
	</ItemWrapper>
</template>

<style>
.item {
	@apply relative divide-none shadow-none;

	&.card {
		@apply flex flex-col dark:border border-gray-700 transition-transform;

		&.selected {
			@apply ring-2 ring-primary -translate-y-1 shadow-lg;
		}
	}

	&.line {
		@apply flex justify-between items-center gap-2.5 rounded-none transition-colors ring-0;

		&.selected {
			@apply bg-primary-100 dark:bg-primary-500 dark:bg-opacity-30;
		}
	}

}
</style>
