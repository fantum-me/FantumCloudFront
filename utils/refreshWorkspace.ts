export default async function refreshWorkspace() {
    const workspace = useWorkspace()
    const res = await useApiFetch("/workspaces/" + workspace.value.id + "?scopes=")
    if (res.ok) {
        const newWorkspace = await res.json()
        Object.assign(workspace.value, newWorkspace);
    }
}
