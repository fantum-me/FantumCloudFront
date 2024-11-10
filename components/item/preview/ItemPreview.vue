<script setup lang="ts">
import type StorageItem from "~/types/filesystem/StorageItem";
import {ItemPreviewIcon, ItemPreviewImage} from "#components";

const {item, crop} = defineProps<{
	item: StorageItem,
	crop?: boolean
}>()
</script>

<template>
	<component :is="isFile(item) && item.has_preview ? ItemPreviewImage : ItemPreviewIcon"
	           :crop="crop" :item="item" :icon="getStorageItemIcon(item)"/>
</template>

