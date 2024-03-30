<script lang="ts">
import type Workspace from "~/types/api/Workspace";

const session = useSession()

const res = await useApiFetch("/workspaces", {
	method: "POST",
	body: JSON.stringify({
		name: session.value?.name + "'s Workspace"
	})
})
if (res.ok) {
	const workspace: Workspace = await res.json()
	navigateTo("/workspace/" + workspace.id)
}
</script>

