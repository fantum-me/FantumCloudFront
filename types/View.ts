enum View {
    HOME = "home",

    SEARCH = "search",
    FOLDER = "folder",
    DATABASE = "database",

    FILES = "files",
    TRASH = "trash",

    MEMBERS = "members",
    PERMISSIONS = "permissions",
    SETTINGS = "settings",
}

export default View

export function isDetailsPanelOnView(view: View): boolean {
    return [View.FILES, View.FOLDER, View.SEARCH, View.TRASH].includes(view);
}
