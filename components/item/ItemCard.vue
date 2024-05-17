<script setup lang="ts">
import type StorageItem from "~/types/api/StorageItem";
import moment from "moment/moment";
import {DragSelectOption} from "@coleqiu/vue-drag-select";
import type {Ref} from "vue";

const props = defineProps<{
	item: StorageItem,
}>()

const item: Ref<StorageItem> = useItem(props.item.id, props.item)

const ext = isFile(item.value) ? item.value.ext : ""
const icon = getStorageItemIcon(item.value)

const loadingItems = useLoadingItems()

const cardConfig = {
	divide: "",
	header: {padding: 'p-3 sm:p-4'},
	body: {padding: 'py-0 sm:py-0 px-3 sm:px-4'},
	footer: {padding: 'py-2 sm:py-3 px-3 sm:px-4'}
}
</script>

<template>
	<ItemWrapper :item="item">
		<drag-select-option :value="item.id">
			<UCard class="relative item-card flex flex-col dark:border border-gray-700 divide-none shadow-none"
			       :ui="cardConfig">
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

				<div v-if="loadingItems.includes(item.id)"
				     class="absolute w-full h-full top-0 left-0 bg-gray-200 dark:bg-gray-800 rounded-lg bg-opacity-65 dark:bg-opacity-65 flex-center">
					<Loader :size="36" :thickness="4"/>
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
	</ItemWrapper>
</template>

<style>
.drag-select-option--selected > .item-card {
	@apply ring-2 ring-primary -translate-y-1 transition-transform shadow-lg;
}
</style>
