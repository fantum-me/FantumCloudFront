export default async function refreshWorkspace(scopes: string[] = []) {
    const workspace = useWorkspace()
    const scopeParameter: string = scopes.length ? "scope=" + scopes.join(",") : "scope="
    const res = await useApiFetch("/workspaces/" + workspace.value.id + "?" + scopeParameter)
    if (res.ok) {
        const newWorkspace = await res.json()
        workspace.value = {...workspace.value, ...newWorkspace}
    }
}
