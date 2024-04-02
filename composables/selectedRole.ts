import type Role from "~/types/api/Role";

export const useSelectedRole = () => useState<Role>('selected-role')
