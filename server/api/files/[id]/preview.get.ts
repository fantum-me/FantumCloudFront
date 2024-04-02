import serverAuthenticate from "~/server/utils/serverAuthenticate";
import serverFetchApi from "~/server/utils/serverFetchApi";

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')
    await serverAuthenticate(event)

    const res = await serverFetchApi(event, `/files/${id}/preview`)
    const fileBlob = await res.blob();
    return sendStream(event, fileBlob.stream())
})
