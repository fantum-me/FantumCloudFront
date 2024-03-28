<script setup lang="ts">
const accessToken = getAccessToken()
if (!accessToken) await navigateTo("/auth/login")

const endpoint = useRuntimeConfig().public.userinfoEndpoint
const res = await useApiFetch(endpoint)

const authenticated = res.ok
if (authenticated) useSession().value = await res.json()
</script>

<template>
	<slot v-if="authenticated"/>
	<p v-if="!authenticated">Failed to authenticate user</p>
</template>
