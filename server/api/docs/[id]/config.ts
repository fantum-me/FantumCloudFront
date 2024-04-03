import serverAuthenticate from "~/server/utils/serverAuthenticate";
import serverFetchApi from "~/server/utils/serverFetchApi";
import {getStorageItemType} from "~/utils/itemTypes";
import {IConfig} from "@onlyoffice/document-editor-vue";
import type File from "~/types/api/File";
import {JWTPayload, SignJWT} from "jose";

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')
    const runtimeConfig = useRuntimeConfig()
    const user = await serverAuthenticate(event)

    const res = await serverFetchApi(event, `/files/${id}`)
    if (res.ok) {
        const file: File = await res.json()
        const documentType = getStorageItemType(file)

        const config: IConfig = {
            document: {
                fileType: file.ext,
                key: file.id + ":" + file.version,
                title: file.name + "." + file.ext,
                url: docsBasePath() + "/api/docs/" + file.id + "/document",
                permissions: {
                    edit: file.access["write"],
                    protect: file.access["edit_permissions"]
                }
            },
            documentType: documentType,
            editorConfig: {
                user: {
                    id: user.id,
                    name: user.name,
                    image: user.avatar,
                },
                mode: file.access["write"] ? "edit" : "view",
                callbackUrl: docsBasePath() + "/api/docs/" + file.id + "/callback",
                customization: {
                    logo: {
                        image: docsBasePath() + "/logo/black.png",
                        imageDark: docsBasePath() + "/logo/white.png",
                        url: docsBasePath()
                    },
                    goback: {
                        blank: false,
                        text: "Back to Cloud",
                        url: `${docsBasePath()}/workspace/${file.workspace_id}/folder/${file.parent_id}`
                    },
                    uiTheme: user.scheme === "dark" ? "theme-dark" : "theme-light",
                    plugins: false,
                    help: false
                }
            }
        }

        const secret = new TextEncoder().encode(runtimeConfig.onlyofficeJwtSecret)
        const alg = 'HS256'

        config.token = await new SignJWT(config as unknown as JWTPayload)
            .setProtectedHeader({alg})
            .sign(secret);

        return {file: file, config: config}
    } else {
        throw createError({statusCode: 400, statusMessage: "Failed to fetch file"})
    }
})
