import type Session from "~/types/user/Session";

export const useSession = () => useState<Session>('session')
