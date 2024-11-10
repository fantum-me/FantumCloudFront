import type Role from "~/types/permission/Role";

export const useSelectedRole = () => useState<Role>('selected-role')
