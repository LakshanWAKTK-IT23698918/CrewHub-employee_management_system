import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { TOKEN_STORAGE_KEY } from '../api/employeeApi';
import { login as loginRequest } from '../api/authApi';

const USERNAME_STORAGE_KEY = 'ems-auth-username';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => window.localStorage.getItem(TOKEN_STORAGE_KEY));
  const [username, setUsername] = useState(() => window.localStorage.getItem(USERNAME_STORAGE_KEY));

  const login = useCallback(async (usernameInput, password) => {
    const data = await loginRequest(usernameInput, password);
    window.localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
    window.localStorage.setItem(USERNAME_STORAGE_KEY, data.username);
    setToken(data.token);
    setUsername(data.username);
  }, []);

  const logout = useCallback(() => {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
    window.localStorage.removeItem(USERNAME_STORAGE_KEY);
    setToken(null);
    setUsername(null);
  }, []);

  const value = useMemo(
    () => ({ token, username, isAuthenticated: Boolean(token), login, logout }),
    [token, username, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
