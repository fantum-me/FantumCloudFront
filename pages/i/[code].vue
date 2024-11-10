<script setup lang="ts">
import type Workspace from "~/types/Workspace";

const failed = ref(false)
const code: string = useRoute().params.code as string

onMounted(async () => {
	const res = await useApiFetch("/workspaces/join", {
		method: "POST",
		body: JSON.stringify({
			code: code
		})
	})
	if (res.ok) {
		const workspace: Workspace = await res.json()
		navigateTo("/workspace/" + workspace.id)
	} else {
		useErrorToast("Code is invalid or expired")
		failed.value = true
	}
})
</script>

<template>
	<div v-if="failed" class="w-screen h-screen flex-center">
		<UCard class="text-center">
			<div class="space-y-8">
				<div class="flex">
					<UButton color="gray" variant="ghost" icon="i-heroicons-arrow-left"
					         @click="navigateTo('/')">
						Back
					</UButton>
				</div>
				<icon name="i-heroicons-face-frown" class="h-24 w-24"/>
				<p class="text-center">Failed to Join the workspace. <br> Code may be invalid or expired.</p>
			</div>
		</UCard>
	</div>
</template>
