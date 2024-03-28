<script setup lang="ts">
const isWorkspace = useRoute().params.workspace
</script>

<template>
	<NuxtLoadingIndicator :height="2" color="repeating-linear-gradient(to right,#3b5dd2,#1E3BA3)"/>
	<NuxtLayout name="auth-required">
		<NuxtLayout name="scheme">
			<NuxtLayout :name="isWorkspace ? 'workspace' : ''">
				<NuxtPage/>
			</NuxtLayout>
		</NuxtLayout>
	</NuxtLayout>
	<UNotifications/>
</template>
