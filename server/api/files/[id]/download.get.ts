import serverFetchApi from "~/server/utils/serverFetchApi";
import serverAuthenticate from "~/server/utils/serverAuthenticate";

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')
    await serverAuthenticate(event)

    const res = await serverFetchApi(event, `/files/${id}/download`)
    const fileBlob = await res.blob();
    return sendStream(event, fileBlob.stream())
})
