<script setup lang="ts">
import View from "~/lib/View";

const session = useSession()
useView().value = View.SETTINGS
</script>


<template>
	<div class="p-5">
		<p>
			Dark Mode
			<UToggle color="primary" on-icon="i-heroicons-moon" off-icon="i-heroicons-sun"
			         :model-value="session.scheme === 'dark'" @click="switchScheme()"/>
		</p>
	</div>
</template>
