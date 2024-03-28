<script setup lang="ts">
import View from "~/lib/View";

useView().value = View.FILES
const workspace = useWorkspace()
</script>

<template>
	<Folder :id="workspace.root"/>
</template>
