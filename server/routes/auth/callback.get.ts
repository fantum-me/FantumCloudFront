export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const code = query.code

    const {oauthEndpoint,  oauth: {clientId, clientSecret} } = useRuntimeConfig(event)
    const bearer = btoa(clientId + ":" + clientSecret)

    const res = await fetch(oauthEndpoint + "/access_token", {
        method: "POST",
        body: JSON.stringify({code: code}),
        headers: {
            "Authorization": `Bearer ${bearer}`
        }
    })

    if (res.json) {
        const {access_token} = await res.json()

        const expires: Date = new Date();
        expires.setHours(expires.getHours() + 1)
        setCookie(event, "accessToken", access_token, {
            secure: true,
            expires: expires,
            sameSite: "strict"
        })
    }
    await sendRedirect(event, "/")
})
