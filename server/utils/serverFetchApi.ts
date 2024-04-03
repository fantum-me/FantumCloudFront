import type {H3Event} from "h3";

export default async function serverFetchApi(
    event: H3Event,
    input: string,
    init: RequestInit | undefined = {},
    accessToken: string = ""
): Promise<Response> {
    if (!accessToken) {
        const cookies = parseCookies(event)
        if (!cookies.accessToken) throw createError({statusCode: 401})
        accessToken = cookies.accessToken
    }

    const basePath = isAbsoluteUrl(input) ? "" : useRuntimeConfig().public.apiEndpoint

    if (!("headers" in init)) init["headers"] = {};
    // @ts-ignore
    init["headers"]["Authorization"] = "Bearer " + accessToken

    const res = await fetch(basePath + input, init)
    if (res.ok) return res
    else {
        console.log(accessToken, basePath + input, res.status, res.statusText)
        throw createError({statusCode: res.status, statusText: res.statusText})
    }
}

function isAbsoluteUrl(url: string) {
    try {
        new URL(url);
        return true;
    } catch (error) {
        return false;
    }
}

