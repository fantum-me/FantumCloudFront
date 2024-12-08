<script setup lang="ts">
import {useMouse, useWindowScroll} from "@vueuse/core";
import type Folder from "~/types/filesystem/Folder";
import type {Ref} from "vue";

const {x, y} = useMouse()
const {y: windowY} = useWindowScroll()

const currentFolder = useFolder()
const folder: Ref<Folder | undefined> = ref()
const isOpen = ref(false)
const virtualElement = ref({getBoundingClientRect: () => ({})})

let openAfterCreation = false

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

const newFolder = useNewFolderModal()
const newDocument = useNewDocumentModal()
const newDatabase = useNewDatabaseModal()

const contextMenu = useFolderContextMenu()
contextMenu.value = {
	open: (target: Folder, isOpeningAfterCreated = false) => {
		openAfterCreation = isOpeningAfterCreated
		console.log(target)
		folder.value = target
		onContextMenu()
		useItemsContextMenu().value.close()
		useItemsSelection().value = []
	},
	close: () => isOpen.value = false
}
</script>

<template>
	<UContextMenu v-if="folder" v-model="isOpen" :virtual-element="virtualElement" class="z-[35]">
		<button v-if="currentFolder.id === folder.id && folder.access.write"
		        @click="currentFolder.import_file?.() && contextMenu.close()">
			<UIcon name="i-heroicons-document-arrow-down-solid" class="h-5 w-5"/>
			Import File
		</button>
		<button @click="newFolder(folder, openAfterCreation) & contextMenu.close()">
			<UIcon name="i-heroicons-folder-plus-solid" class="h-5 w-5"/>
			Create Folder
		</button>
		<button @click="newDocument(folder, 'text', openAfterCreation) & contextMenu.close()">
			<span class="h-5 w-5">
				<ItemIconTypeDoc/>
			</span>
			New Text Document
		</button>
		<button @click="newDocument(folder, 'spreadsheet', openAfterCreation) & contextMenu.close()">
			<span class="h-5 w-5">
				<ItemIconTypeSpreadsheet/>
			</span>
			New Spreadsheet
		</button>
		<button @click="newDocument(folder, 'presentation', openAfterCreation) & contextMenu.close()">
			<span class="h-5 w-5">
				<ItemIconTypePresentation/>
			</span>
			New Presentation
		</button>
		<button @click="newDatabase(folder, openAfterCreation) & contextMenu.close()">
			<UIcon name="i-heroicons-circle-stack" class="h-5 w-5"/>
			New Database
		</button>
	</UContextMenu>
</template>
