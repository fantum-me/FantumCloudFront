<script setup lang="ts">
	// import type Folder from "~/types/Folder";
	//
	// const folder: Folder = useState<Folder>("folder").value
	//
	// async function processFile(file: File) {
	// 	const formData = new FormData();
	// 	formData.append('file', file);
	// 	formData.append('folder', folder.id);
	//
	// 	const res = await useApiFetch('/files', {
	// 		method: 'POST',
	// 		body: formData,
	// 	});
	//
	// 	if (!res.ok) {
	// 		throw new Error();
	// 	}
	// 	await refreshFolder();
	// }
</script>

<template>
	<button class="button-primary fixed bottom-16 right-16 z-30">
		<Icon class="icon icon-lg"/>
		<span class="max-md:hidden">
			<slot/>
		</span>
	</button>
</template>
