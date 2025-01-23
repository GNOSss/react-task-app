import { useTypedSelector } from './redux';

export function useAuth() {
  const { id, email, displayName } = useTypedSelector((state) => state.user);

  return {
    isAuth: !!email,
    email: email,
    id: id,
    displayName: displayName,
  };
}
