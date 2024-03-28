import Permission from "@/lib/Permission";

export default interface PermissionObject {
    [Permission.READ]: boolean,
    [Permission.WRITE]: boolean,
    [Permission.TRASH]: boolean,
    [Permission.DELETE]: boolean,
    [Permission.EDIT_PERMISSIONS]: boolean,
}

export function getDefaultPermissionObject(value = false): PermissionObject {
    return <PermissionObject>{
        [Permission.READ]: value,
        [Permission.WRITE]: value,
        [Permission.TRASH]: value,
        [Permission.DELETE]: value,
        [Permission.EDIT_PERMISSIONS]: value,
    }
}
