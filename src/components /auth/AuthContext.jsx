import { createContext, useState, useEffect } from 'react';
import { magic } from '../services/auth';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    magic.user.isLoggedIn().then(setUser);
  }, []);

  const login = async (email) => {
    await magic.auth.loginWithMagicLink({ email });
    setUser(await magic.user.getMetadata());
  };

  const logout = async () => {
    await magic.user.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}