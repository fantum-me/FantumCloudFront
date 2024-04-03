import {serverOnlyofficeAuthenticate} from "~/server/utils/serverAuthenticate";
import serverFetchApi from "~/server/utils/serverFetchApi";

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')
    const runtimeConfig = useRuntimeConfig()
    const jwt = await serverOnlyofficeAuthenticate(event)

    const payload: { key: string } = jwt.payload.payload as { key: string }
    if (payload.key !== id) throw createError("invalid token")

    const body = await readBody(event)

    try {
        if (body.url) {
            console.log(body.url)

            const fileRes = await fetch(body.url)

            console.log(fileRes.status, fileRes.statusText)

            const fileBlob = await fileRes.blob();
            const formData = new FormData();
            formData.append('file', fileBlob);

            console.log("fetched !")

            const res = await serverFetchApi(event, `/documents/${id}`, {
                method: 'POST',
                body: formData
            }, runtimeConfig.docsApiAccessKey);

            console.log("updated !")

            if (!res.ok) return {error: 1}
        }
    } catch (e) {
        console.log(e)
        return {error: 1}
    }
    return {error: 0}
})
