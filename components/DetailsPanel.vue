<script setup lang="ts">
import type StorageItem from "~/types/api/StorageItem";
import type {Ref} from "vue";
import {ItemPreview} from "#components";
import moment from "moment/moment";

const session = useSession()

const itemsSelection = useItemsSelection()
let item: Ref<StorageItem | undefined> = ref(undefined);

watch(() => itemsSelection.value, (newVal) => {
	item.value = undefined;
	if (newVal.length === 1) {
		item.value = useItem(newVal[0]).value;
	}
}, {immediate: true});
</script>

<template>
	<UCard class="w-full h-full" :ui="{header: {base: 'h-14', padding: 'py-0'}}">
		<template #header>
			<div v-if="item" class="h-full flex-start gap-3" :title="item.name">
					<span class=" shrink-0 h-5 w-5">
						<component :is="getStorageItemIcon(item)" :id="item.id" :name="item.name"/>
					</span>
				<span class="font-medium text-sm truncate">{{ item.name }}</span>
			</div>
			<div v-else-if="itemsSelection.length > 1" class="flex-start h-full gap-3">
				<UIcon name="i-heroicons-check-circle" class="shrink-0 h-6 w-6 text-primary"/>
				<span class="font-medium text-sm truncate">{{ itemsSelection.length }} items selected</span>
			</div>
			<div v-else class="h-full flex-start">
				<span class="font-medium text-sm truncate">Please select items</span>
			</div>
		</template>

		<template #default v-if="item">
			<ItemPreview :crop="false" :item="item"/>

			<div class="text-xs space-y-4 mt-6">
				<div>
					<p class="font-semibold">Type</p>
					<p>{{ capitalize(getStorageItemType(item)) }}</p>
				</div>
				<div>
					<p class="font-semibold">Size</p>
					<p>{{ formatSize(item.size) }}</p>
				</div>
				<div>
					<p class="font-semibold">Modified At</p>
					<p>{{ moment.unix(item.updated_at).format("MMM d, y HH:ss") }}</p>
				</div>
				<div>
					<p class="font-semibold">Created At</p>
					<p>{{ moment.unix(item.created_at).format("MMM d, y HH:ss") }}</p>
				</div>
			</div>
		</template>

		<template #default v-else>
			<div v-if="itemsSelection.length > 1">
				<NuxtImg :src="`/illustration/${session.scheme}/items-transport.png`" class="opacity-90"/>
			</div>
		</template>
	</UCard>
</template>
