export const setScheme = async (scheme: "light" | "dark") => {
    const res = await useApiFetch(useRuntimeConfig().public.userinfoEndpoint, {
        method: "PATCH",
        body: JSON.stringify({
            scheme: scheme
        })
    })
    if (res.ok) {
        useSession().value.scheme = scheme
        useColorMode().preference = scheme
        useSuccessToast("Successfully switched scheme")
    } else useErrorToast("Failed to switch scheme")
}

export const switchScheme = () => setScheme(useSession().value.scheme === 'light' ? 'dark' : 'light')
