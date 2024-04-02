import type Session from "~/types/api/Session";

export const useSession = () => useState<Session>('session')
