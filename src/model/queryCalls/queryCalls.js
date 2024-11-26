import { useQuery } from 'react-query';
import { useContext } from 'react';
import { UserContext } from '../../controller/context/userContext';
import {
  app,
  getOneRole,
  getRoles,
  getRegisterRoles,
  getCurrentUser,
  getUserRegisterRoles,
  getOneUser,
  getUsers,
} from '../../controller/services/dbServices';

export const useCurrentUser = () => {
  const { user } = useContext(UserContext);
  return useQuery(['currentUser', user, user?.customData, { id: user?.customData?.entityId || null }], () =>
    getCurrentUser({ id: user?.customData?.entityId || null }),
  );
};

export const useRoles = ({ search }) => {
  const { user } = useContext(UserContext);
  return useQuery(['rolesData', user, search], () => getRoles({ search }));
};

export const useOneRole = ({ id }) => {
  const { user } = useContext(UserContext);
  return useQuery(['oneRole', user, { id }], () => getOneRole({ id }));
};

export const useRegisterRoles = () => {
  return useQuery(['registerRoles', app.currentUser], () => getRegisterRoles());
};

export const useUserRegisterRoles = () => {
  const { user } = useContext(UserContext);
  return useQuery(['userRegisterRoles', user], () => getUserRegisterRoles());
};

export const useOneUser = ({ id }) => {
  const { user } = useContext(UserContext);
  return useQuery(['oneUser', user, { id }], () => getOneUser({ id }));
};

export const useUsers = ({ search }) => {
  const { user } = useContext(UserContext);
  return useQuery(['usersData', user, search], () => getUsers({ search }));
};
