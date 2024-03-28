export default defineEventHandler(async (event) => {
    const {baseUrl, oauthEndpoint, oauth: {serviceId}} = useRuntimeConfig()
    const endpoint = oauthEndpoint + "/code/service"
    const redirectUri = baseUrl + "/auth/callback"
    const url = endpoint + `?service=${serviceId}&redirect_uri=${redirectUri}`
    await sendRedirect(event, url, 302)
})
