export default defineEventHandler(async (event) => {
    deleteCookie(event, "accessToken")
    await sendRedirect(event, "/auth/login")
})
