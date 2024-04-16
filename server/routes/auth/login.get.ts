export default defineEventHandler(async (event) => {
    const runtimeConfig = useRuntimeConfig()
    const endpoint = runtimeConfig.oauthEndpoint + "/code/service"
    const redirectUri = runtimeConfig.public.baseUrl + "/auth/callback"
    const url = endpoint + `?service=${runtimeConfig.oauth.serviceId}&redirect_uri=${redirectUri}`
    await sendRedirect(event, url, 302)
})
