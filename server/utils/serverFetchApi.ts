import type {H3Event} from "h3";

export default async function serverFetchApi(
    event: H3Event,
    input: string,
    init: RequestInit | undefined = {},
    basePath: string | undefined = ""
): Promise<Response> {
    const cookies = parseCookies(event)
    if (!cookies.accessToken) throw createError({statusCode: 401})

    if (!basePath && !isAbsoluteUrl(input)) basePath = useRuntimeConfig().public.apiEndpoint

    if (!("headers" in init)) init["headers"] = {};
    // @ts-ignore
    init["headers"]["Authorization"] = "Bearer " + cookies.accessToken

    const res = await fetch(basePath + input, init)
    if (res.ok) return res
    else throw createError({statusCode: res.status, statusText: res.statusText})
}

function isAbsoluteUrl(url: string) {
    try {
        new URL(url);
        return true;
    } catch (error) {
        return false;
    }
}

