import serverFetchApi from "~/server/utils/serverFetchApi";
import type {H3Event} from "h3";
import type User from "~/types/api/User";

export default async function serverAuthenticate(event: H3Event): Promise<User> {
    const {accessToken} = parseCookies(event)
    if (!accessToken) throw createError({statusCode: 400})

    const endpoint = useRuntimeConfig().public.userinfoEndpoint
    const res = await serverFetchApi(event, endpoint)

    return await res.json()
}
