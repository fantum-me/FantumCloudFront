import Permission from "@/types/Permission";

export default interface PermissionObject {
    [Permission.READ]: true | false | null,
    [Permission.WRITE]: true | false | null,
    [Permission.TRASH]: true | false | null,
    [Permission.DELETE]: true | false | null,
    [Permission.EDIT_PERMISSIONS]: true | false | null,
}

export function getDefaultPermissionObject(value: true | false | null = null): PermissionObject {
    return <PermissionObject>{
        [Permission.READ]: value,
        [Permission.WRITE]: value,
        [Permission.TRASH]: value,
        [Permission.DELETE]: value,
        [Permission.EDIT_PERMISSIONS]: value,
    }
}
