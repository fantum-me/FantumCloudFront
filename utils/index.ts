export const useWait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const isClientSide = () => typeof window !== "undefined"

export const unselectAll = () => isClientSide() ? document.getSelection()?.removeAllRanges() : {}

export const isAbsoluteUrl = (url: string): boolean => (/^https?:\/\//i).test(url)

export const asHtmlElement = (target: EventTarget): target is HTMLElement => true

export const capitalize = (string: string) => string[0].toUpperCase() + string.slice(1);

export const getWelcomeMessage = (): string => {
    const hour = new Date().getHours();
    let welcomeMessage;

    if (hour >= 4 && hour < 12) {
        welcomeMessage = "Good morning";
    } else if (hour >= 12 && hour < 18) {
        welcomeMessage = "Good afternoon";
    } else {
        welcomeMessage = "Good evening";
    }

    return `${welcomeMessage}, ${useSession().value.name}`;
}
