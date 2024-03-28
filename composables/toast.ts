export const useSuccessToast = (title: string, actions: any[] | undefined = undefined) => {
    useToast().add({
        icon: "i-heroicons-check",
        color: "green",
        title: title,
        actions: actions
    })
}

export const useErrorToast = (title: string, actions: any[] | undefined = undefined) => {
    useToast().add({
        icon: "i-heroicons-x-mark",
        color: "red",
        title: title,
        actions: actions
    })
}

export const useWaitToast = (title: string, actions: any[] | undefined = undefined) => {
    useToast().add({
        icon: "i-heroicons-clock",
        color: "amber",
        title: title,
        actions: actions
    })
}
