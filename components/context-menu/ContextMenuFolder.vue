<script setup lang="ts">
import {DocumentArrowDownIcon, FolderPlusIcon} from "@heroicons/vue/24/solid";
import {useMouse, useWindowScroll} from "@vueuse/core";

const {x, y} = useMouse()
const {y: windowY} = useWindowScroll()

const folder = useFolder()
const isOpen = ref(false)
const virtualElement = ref({getBoundingClientRect: () => ({})})

function onContextMenu() {
	const top = unref(y) - unref(windowY)
	const left = unref(x)

	virtualElement.value.getBoundingClientRect = () => ({
		width: 0,
		height: 0,
		top,
		left
	})

	isOpen.value = true
}

const contextMenu = useFolderContextMenu()
contextMenu.value = {
	open: () => {
		onContextMenu()
		useItemsContextMenu().value.close()
		useItemsSelection().value = []
	},
	close: () => isOpen.value = false
}
</script>

<template>
	<UContextMenu v-model="isOpen" :virtual-element="virtualElement">
		<button @click="folder.import_file?.() && contextMenu.close()">
			<DocumentArrowDownIcon class="h-5 w-5"/>
			Import File
		</button>
		<button  @click="folder.create_folder?.() && contextMenu.close()">
			<FolderPlusIcon class="h-5 w-5"/>
			Create Folder
		</button>
	</UContextMenu>
</template>
