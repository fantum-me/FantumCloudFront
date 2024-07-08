enum View {
    HOME = "home",

    SEARCH = "search",
    FOLDER = "folder",

    FILES = "files",
    TRASH = "trash",

    MEMBERS = "members",
    PERMISSIONS = "permissions",
    SETTINGS = "settings",
}

export default View

export function isDetailsPanelOnView(view: View): boolean {
    return ![View.MEMBERS, View.PERMISSIONS, View.SETTINGS].includes(view);
}
