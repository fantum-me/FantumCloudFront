import serverAuthenticate from "~/lib/serverAuthenticate";
import serverFetchApi from "~/lib/serverFetchApi";

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')
    await serverAuthenticate(event)

    const res = await serverFetchApi(event, `/files/${id}/download`)
    const fileBlob = await res.blob();
    return sendStream(event, fileBlob.stream())
})
