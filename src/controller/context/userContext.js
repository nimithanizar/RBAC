/* eslint-disable import/no-cycle */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-no-constructed-context-values */
/* eslint-disable prettier/prettier */
/* eslint-disable no-useless-catch */
import * as Realm from 'realm-web';
import { createContext, useState, useEffect } from 'react';
import { app } from '../services/dbServices';

export const UserContext = createContext();
export function UserProvider({ children }) {
  const [user, setUser] = useState();
  const [customerData, setCustomerData] = useState();
  const isVerified = JSON.parse(localStorage.getItem('isVerified') || 'false');
  const emailPasswordLogin = async (email, password) => {
    const credentials = Realm.Credentials.emailPassword(email, password);
    const authUser = await app.logIn(credentials);
    setUser(authUser);
    return authUser;
  };

  useEffect(() => {
    if (!user && app.currentUser) {
      setUser(app.currentUser);
    }
  }, [app, app.currentUser]);

  const fetchUser = async () => {
    if (!app.currentUser) return false;
    try {
      await app.currentUser.refreshCustomData();
      setUser(app.currentUser);
      return app.currentUser;
    } catch (error) {
      throw error;
    }
  };

  // Function to logout user from our Realm
  const logOutUser = async () => {
    if (!app.currentUser) return false;
    try {
      await app.currentUser.logOut();
      setUser(null);
      return true;
    } catch (error) {
      throw error;
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        fetchUser,
        emailPasswordLogin,
        logOutUser,
        customerData,
        setCustomerData,
        isVerified,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
