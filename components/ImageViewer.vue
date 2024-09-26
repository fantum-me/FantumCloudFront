<script setup lang="ts">
import type {Ref} from "vue";
import type File from "~/types/api/File";
import type Folder from "~/types/api/Folder";

const workspace = useWorkspace()
const currentFolder = useFolder()

const item: Ref<File | undefined> = ref()
const isOpen: Ref<boolean> = ref(false)
const enableMove: Ref<boolean> = ref(false)
const loaded = ref(false)
const opacity = ref(0)
const imageRef = ref<HTMLImageElement>()

useImageViewer().value = open

onMounted(() => {
	window.addEventListener("keydown", (e: KeyboardEvent) => {
		if (isOpen.value && item.value) {
			if (e.key === "ArrowLeft" && enableMove.value) previous()
			else if (e.key === "ArrowRight" && enableMove.value) next()
			else if (e.key === "Escape") close()
		}
	})
	window.addEventListener("resize", () => {
		if (isOpen.value && item.value) refreshRatio()
	})
})

function open(target: File, arrows = true) {
	if (getStorageItemType(target) !== "image") return
	loaded.value = false
	enableMove.value = arrows
	item.value = target
	isOpen.value = true
	refreshRatio()
	useWait(1).then(() => opacity.value = 1)
}

function close() {
	opacity.value = 0
	useWait(300).then(() => isOpen.value = false)
}

function previous() {
	if (!item.value || !enableMove.value) return
	const parent = useItem(item.value.parent_id).value as Folder
	if (parent && parent.items) {
		const images = parent.items.filter(i => getStorageItemType(i) === "image") as File[]
		const index = images.indexOf(item.value)
		if (index !== 0) open(images[index - 1])
	}
}

function next() {
	if (!item.value || !enableMove.value) return
	const parent = useItem(item.value.parent_id).value as Folder
	if (parent && parent.items) {
		const images = parent.items.filter(file => getStorageItemType(file) === "image") as File[]
		const index = images.indexOf(item.value)
		if (index + 1 !== images.length) open(images[index + 1])
	}
}

function load() {
	refreshRatio()
	loaded.value = true
}

function refreshRatio() {
	if (!item.value || !item.value.width || !item.value.height || !imageRef.value) return

	const imageRatio = item.value.width / item.value.height
	const ratio = window.innerWidth / window.innerHeight

	if (imageRatio > ratio) imageRef.value.className = "w-full h-auto"
	else imageRef.value.className = "w-auto h-full"
}
</script>

<template>
	<div class="bg-gray-800 bg-opacity-90 text-gray-100 fixed left-0 top-0 w-screen h-screen z-50 transition-opacity duration-300"
	     v-if="item && isOpen" @click="close" :style="{opacity: opacity}">
		<div class="p-3 flex-between">
			<div class="flex-center gap-2 font-medium" @click.stop>
				<span class="h-6 w-6">
					<component :is="getStorageItemIcon(item)" :id="item.id" :name="item.name"/>
				</span>
				{{ item.name }}
			</div>
			<div class="flex-center gap-2">
				<UButton icon="i-heroicons-folder-open" color="white" variant="soft" size="xl"
				         @click.stop="openItem(useItem(item.parent_id).value); useItemsSelection().value = [item.id]"
				         v-if="item.parent_id && currentFolder?.id !== item.parent_id"/>
				<UButton icon="i-heroicons-arrow-down-tray-20-solid" color="white" variant="soft" size="xl"
				         @click.stop="downloadFile(item)"/>
				<UButton icon="i-heroicons-pencil-solid" color="white" variant="soft" size="xl"
				         @click="useRenameItemsModal().value(item)"/>
			</div>
		</div>

		<div class="image-viewer flex-center">
			<img :src="`/api/workspaces/${workspace.id}/files/${item.id}/${loaded && !item.mime.startsWith('image/svg')  ? 'download' : 'preview'}`"
			     :alt="item.name" @load="load" @click.stop ref="imageRef"/>
		</div>

		<UButton color="white" variant="soft" class="-mt-8 p-3 absolute left-2 top-1/2 -translate-y-1/2"
		         @click.stop="previous" v-if="enableMove">
			<UIcon name="i-heroicons-chevron-left" class="h-12 w-12 md:h-16 md:w-16"/>
		</UButton>
		<UButton color="white" variant="soft" class="-mt-8 p-3 absolute right-2 top-1/2 -translate-y-1/2"
		         @click.stop="next" v-if="enableMove">
			<UIcon name="i-heroicons-chevron-right" class="h-12 w-12 md:h-16 md:w-16"/>
		</UButton>
	</div>
</template>

<style>
.image-viewer {
	@apply h-4/5 w-4/5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2;

	img {
		@apply max-w-full max-h-full object-contain;
	}
}
</style>
