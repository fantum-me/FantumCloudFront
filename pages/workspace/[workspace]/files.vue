<script setup lang="ts">
import View from "~/types/View";

useView().value = View.FILES
const workspace = useWorkspace()
</script>

<template>
	<NuxtLayout name="workspace">
		<Folder :id="workspace.root"/>
	</NuxtLayout>
</template>
