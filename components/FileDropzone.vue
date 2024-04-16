<script setup lang="ts">
import {useDropzone} from "vue3-dropzone";
import Permission from "~/types/Permission";

const workspace = useWorkspace()
const folder = useFolder()
const isQuotaModalOpen = ref(false)

async function processFile(file: File) {
	const formData = new FormData();
	formData.append('file', file);
	formData.append('folder', folder.value.id);

	const res = await useApiFetch("/files/upload", {
		method: "POST",
		body: formData,
	})

	if (res.ok) useSuccessToast("Successfully uploaded " + file.name)
	else useErrorToast("Error while trying to upload " + file.name)
}

const {getRootProps, getInputProps, isDragActive, open} = useDropzone({
	maxSize: 100000000,
	noClick: true,
	onDrop: async (acceptedFiles, fileRejections) => {
		if (!folder.value.access[Permission.WRITE]) {
			useErrorToast('You don\'t have permission to write in this folder!');
			return;
		}

		fileRejections.forEach((file) => useErrorToast(`${file.file.type} is too large !\nMax: 100Mo`));

		let totalSize = 0
		acceptedFiles.forEach(file => totalSize += file.size)

		if (workspace.value.used_space + totalSize > workspace.value.quota) {
			isQuotaModalOpen.value = true
			return
		}

		for (const file of acceptedFiles) {
			await processFile(file)
		}

		await useRefreshView().value()
		await refreshWorkspace()
	}
});
useFolder().value.import_file = open
</script>

<template>
	<div class="w-full h-full" v-bind="getRootProps()">
		<input v-bind="getInputProps()"/>
		<div v-if="isDragActive"
		     class="fixed w-screen h-screen top-0 left-0 bg-black bg-opacity-50 z-50 flex-center flex-col text-white">
			<template v-if="folder.access[Permission.WRITE]">
				<UIcon name="i-heroicons-folder-plus" class="h-32 w-32"/>
				<p class="text-2xl font-bold">Drag'n Drop</p>
			</template>
			<template v-else>
				<UIcon name="i-heroicons-x-mark" class="h-32 w-32"/>
				<p class="text-2xl font-bold">Can't upload here</p>
			</template>
		</div>
		<slot/>
	</div>

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
