import {serverOnlyofficeAuthenticate} from "~/server/utils/serverAuthenticate";

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')
    const runtimeConfig = useRuntimeConfig()
    const jwt = await serverOnlyofficeAuthenticate(event)

    const payload: { url: string } = jwt.payload.payload as { url: string }
    if (payload.url !== docsBasePath() + event.path) throw createError("invalid token")

    const res = await serverFetchApi(
        event,
        `/private/documents/${id}`,
        {},
        runtimeConfig.docsApiAccessKey
    )

    const fileBlob = await res.blob();
    return sendStream(event, fileBlob.stream())
})
