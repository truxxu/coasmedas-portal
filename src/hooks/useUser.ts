import { useUserContext } from '@/src/contexts';

export function useUser() {
  const { user } = useUserContext();
  return user;
}

export function useSession() {
  const { session } = useUserContext();
  return session;
}
