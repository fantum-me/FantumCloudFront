<script setup lang="ts">
import View from "~/types/View";

const session = useSession()
useView().value = View.SETTINGS
</script>


<template>
	<NuxtLayout name="workspace">
		<div class="p-5">
			<p>
				Dark Mode
				<UToggle color="primary" on-icon="i-heroicons-moon" off-icon="i-heroicons-sun"
				         :model-value="session.scheme === 'dark'" @click="switchScheme()"/>
			</p>
		</div>
	</NuxtLayout>
</template>
