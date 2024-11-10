import type Workspace from "~/types/Workspace";

export const getAccessToken = () => useCookie("accessToken")?.value;

export const useApiFetch = async (
    input: string,
    init: RequestInit | undefined = {},
    basePath: string | undefined = ""
): Promise<Response> => {
    if (!basePath && !isAbsoluteUrl(input)) basePath = useRuntimeConfig().public.apiEndpoint

    if (!("headers" in init)) init["headers"] = {};
    // @ts-ignore
    init["headers"]["Authorization"] = "Bearer " + getAccessToken()

    const res = await fetch(basePath + input, init)
    if (res.status === 401) {
        useCookie("auth-redirect").value = useRoute().fullPath
        navigateTo("/auth/retry", {external: true})
    }
    return res
}

export const fetchWorkspace = async (id: string): Promise<Workspace> => {
    const res = await useApiFetch("/workspaces/" + id);
    return await res.json()
}
