<script setup lang="ts">
import type File from "~/types/filesystem/File";

const workspace = useWorkspace()

const {crop, item} = defineProps<{
	item: File,
	crop: boolean
}>()
</script>

<template>
	<img :src="`/api/workspaces/${workspace.id}/files/${item.id}/preview`" :alt="item.name"
	     :class="(item.mime.startsWith('image') ? 'image' : 'document') + ' preview-image ' + (crop ? 'crop' : '')"/>
<!--	<img v-if="item.mime.startsWith('image')" :src="`/api/workspaces/${workspace.id}/files/${item.id}/preview`"-->
<!--	     :alt="item.name" class="w-full aspect-video object-center object-cover rounded pointer-events-none"/>-->
<!--	<img v-else :src="`/api/workspaces/${workspace.id}/files/${item.id}/preview`" :alt="item.name"-->
<!--	     class="w-full aspect-video object-top object-cover rounded-t bg-white pointer-events-none"/>-->
</template>

<style>
.preview-image {
	@apply w-full pointer-events-none;

	&.crop {
		@apply aspect-video object-cover;
	}

	&.image {
		@apply object-center rounded;

		&.crop {
			@apply aspect-video object-cover;
		}
	}

	&.document {
		@apply aspect-square object-cover object-top rounded-t-lg bg-gray-50;

		&.crop {
			@apply aspect-video;
		}
	}
}
</style>
