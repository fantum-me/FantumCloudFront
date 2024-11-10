<script setup lang="ts">
import {type FileRejectReason, type InputFile, useDropzone} from "vue3-dropzone";
import Permission from "~/types/permission/Permission";
import type {Ref} from "vue";
import type Folder from "~/types/filesystem/Folder";

type UploadEntry = {
	label: string
	file: File | InputFile,
	status: "success" | "uploading" | "waiting" | "failed"
}

type FileUpload = {
	status: "success" | "progress",
	entries: UploadEntry[],
	reduced: boolean,
	hidden: boolean,
	folders: {
		path: string,
		id: string
	}[]
}

const workspace = useWorkspace()
const folder = useFolder()
const upload: Ref<FileUpload | undefined> = useState("file-dropdown-current-upload")
const isQuotaModalOpen = ref(false)

async function processFile(file: File, folderId: string): Promise<boolean> {
	console.log(file.webkitRelativePath)
	console.log(file.type)

	const formData = new FormData();
	formData.append('file', file);
	formData.append('folder', folderId);

	const res = await useApiFetch(`/workspaces/${workspace.value.id}/files/upload`, {
		method: "POST",
		body: formData,
	})

	return res.ok
}

async function createSubfolders(): Promise<boolean> {
	if (!upload.value) return false;
	for (const entry of upload.value.entries) {
		if (entry.status !== "waiting") continue;
		const file = entry.file as File;
		const path = file.webkitRelativePath.split("/")
		path.pop()

		let tempPath = ""
		for (const subPath of path) {
			if (!path) continue;
			const parent = tempPath ? upload.value.folders.find(f => f.path === tempPath) : folder.value
			if (!parent) return false;
			tempPath += (tempPath ? '/' : '') + subPath
			if (!upload.value.folders.find(f => f.path === tempPath)) {
				const res = await useApiFetch(`/workspaces/${workspace.value.id}/items`, {
					method: "POST",
					body: JSON.stringify({
						type: "folder",
						name: subPath,
						parent_id: parent.id,
					})
				})
				const folder: Folder = await res.json()
				upload.value.folders.push({
					path: tempPath,
					id: folder.id
				})
			}
		}
	}
	return true
}

async function processUpload(acceptedFiles: File[], fileRejections: FileRejectReason[]) {
	if (!folder.value.access[Permission.WRITE]) {
		useErrorToast('You don\'t have permission to write in this folder!');
		return;
	}
	if (upload.value && upload.value.status === "progress") {
		useErrorToast("Wait until the current upload is finished first")
		return
	}

	upload.value = {
		status: "progress",
		entries: [],
		reduced: false,
		hidden: false,
		folders: [{
			path: "",
			id: folder.value.id
		}]
	}

	let uploadSize = 0;
	acceptedFiles.forEach((file: File) => uploadSize += file.size)

	if (uploadSize > workspace.value.quota - workspace.value.used_space) {
		isQuotaModalOpen.value = true
		upload.value = undefined
		return
	}

	fileRejections.forEach((fileRejection: FileRejectReason) => {
		upload.value?.entries.push({
			label: fileRejection.file.type,
			file: fileRejection.file,
			status: "failed"
		})
	})

	acceptedFiles.forEach((file: File) => {
		upload.value?.entries.push({
			label: file.name,
			file: file,
			status: "waiting"
		})
	})

	if (!(await createSubfolders())) {
		useErrorToast("Failed to process folder path")
		upload.value = undefined
		return
	}

	for (const entry of upload.value?.entries) {
		if (entry.status === "waiting") {
			if (entry.file) {
				const file = entry.file as File
				const path = file.webkitRelativePath.split("/")
				path.pop()
				const folderId = upload.value.folders.find(f => f.path === path.join("/"))?.id as string

				entry.status = "uploading"
				const success = await processFile(file, folderId)
				entry.status = success ? "success" : "failed"
			} else {
				entry.status = "failed"
			}
		}
	}

	upload.value.status = "success"

	await useRefreshView().value()
	await refreshWorkspace()
}

const {getRootProps, getInputProps, isDragActive, open} = useDropzone({
	maxSize: 100000000,
	noClick: true,
	onDrop: processUpload
});
useFolder().value.import_file = open

const uploadCard = {
	base: 'overflow-hidden w-96',
	rounded: 'rounded-b-none',
	header: {
		padding: 'p-0 sm:p-0'
	},
	body: {
		padding: 'p-0 sm:p-0'
	}
}
</script>

<template>
	<div class="w-full h-full" v-bind="getRootProps()">
		<input v-bind="getInputProps()"/>
		<div v-if="isDragActive"
		     class="fixed w-screen h-screen top-0 left-0 bg-black bg-opacity-50 z-50 flex-center flex-col text-white">
			<template v-if="folder.access[Permission.WRITE]">
				<UIcon name="i-heroicons-folder-plus" class="h-32 w-32"/>
				<p class="text-2xl font-bold">Drop your files here</p>
			</template>
			<template v-else>
				<UIcon name="i-heroicons-x-mark" class="h-32 w-32"/>
				<p class="text-2xl font-bold">Can't upload here</p>
			</template>
		</div>
		<slot/>
	</div>

	<UCard v-if="upload && !upload.hidden" class="fixed bottom-0 right-16 z-30" :ui="uploadCard">
		<template #header>
			<div class="bg-gray-200 dark:bg-gray-700 flex-between" @click="upload.reduced = false">
				<p v-if="upload.status === 'progress'" class="font-medium truncate mx-4">
					Uploading {{ upload.entries.length }} files...
				</p>
				<p v-else class="font-medium truncate mx-4">
					Uploaded {{ upload.entries.length }} files
				</p>

				<div class="flex">
					<button class="px-4 py-2 flex-center bg-transparent hover:bg-gray-300 hover:dark:bg-gray-600"
					        @click.stop="upload.reduced = !upload.reduced">
						<UIcon :class="'w-5 h-5 transition-transform' + (upload.reduced ? ' rotate-180' : '')"
						       name="i-heroicons-chevron-down-20-solid"/>
					</button>
					<button class="px-4 py-2 flex-center bg-transparent hover:bg-gray-300 hover:dark:bg-gray-600"
					        @click.stop="upload.hidden = true" v-if="upload.status === 'success'">
						<UIcon class="w-5 h-5" name="i-heroicons-x-mark-20-solid"/>
					</button>
				</div>
			</div>
		</template>

		<div :class="'overflow-y-scroll transition-[max-height] ' + (upload.reduced ? 'max-h-0': 'max-h-72')">
			<div v-for="entry in upload.entries" class="py-2 px-3 flex-between gap-2">
				<div class="flex-start gap-2">
					<UIcon v-if="entry.status === 'failed'" name="i-heroicons-x-mark"
					       class="text-red-500 w-6 h-6"/>
					<UIcon v-else-if="entry.status === 'waiting'" name="i-heroicons-minus" class="w-6 h-6"/>
					<span v-else-if="entry.status === 'uploading'" class="w-6 h-6 flex-center">
						<Loader :size="16"/>
					</span>
					<UIcon v-else name="i-heroicons-check-circle" class="text-green-500 w-6 h-6"/>

					<p class="truncate font-medium">{{ entry.label }}</p>
				</div>
				<p class="text-sm opacity-75">{{ entry.file?.size ? formatSize(entry.file.size) : '' }}</p>
			</div>
		</div>
	</UCard>

	<UModal v-model="isQuotaModalOpen">
		<UAlert
			icon="i-heroicons-exclamation-circle" color="red" variant="soft" title="Workspace quota exceeded !"
			description="The storage quota associated with your workspace will be exceeded if you upload these files.
				Please update your subscription or contact your administrator."
			:close-button="{ icon: 'i-heroicons-x-mark-20-solid', color: 'red', variant: 'link', padded: false }"
			@close="isQuotaModalOpen = false"
		/>
	</UModal>
</template>
