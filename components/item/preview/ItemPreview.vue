<script setup lang="ts">
import type StorageItem from "~/types/api/StorageItem";
import {ItemPreviewIcon, ItemPreviewImage} from "#components";

const {item, crop} = defineProps<{
	item: StorageItem,
	crop?: boolean
}>()

const icon = getStorageItemIcon(item)
const preview = isFile(item) && item.has_preview ? ItemPreviewImage : ItemPreviewIcon
</script>

<template>
	<preview :crop="crop" :item="item" :icon="icon"/>
</template>
