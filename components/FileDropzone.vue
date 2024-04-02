<script setup lang="ts">
import {FolderPlusIcon, XMarkIcon} from "@heroicons/vue/24/solid";
import {useDropzone} from "vue3-dropzone";
import Permission from "~/types/Permission";

const folder = useFolder()

async function processFile(file: File) {
	const formData = new FormData();
	formData.append('file', file);
	formData.append('folder', folder.value.id);

	const res = await useApiFetch("/files", {
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

		for (const file of acceptedFiles) {
			await processFile(file)
		}

		await useRefreshView().value()
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
				<FolderPlusIcon class="h-32 w-32"/>
				<p class="text-2xl font-bold">Drag'n Drop</p>
			</template>
			<template v-else>
				<XMarkIcon class="h-32 w-32"/>
				<p class="text-2xl font-bold">Can't upload here</p>
			</template>
		</div>
		<slot/>
	</div>
</template>
