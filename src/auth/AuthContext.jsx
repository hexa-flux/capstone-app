import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext,
} from "react";

/**
 * AuthContext shape:
 * - user: null | { name: string, ...otherFields }
 * - login(userObj): set user and persist to sessionStorage
 * - logout(): clear user and remove from sessionStorage
 */


export const AuthContext = createContext({
  user: null,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // restore user on mount
  useEffect(() => {
    const raw = sessionStorage.getItem("user");
    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch {
        sessionStorage.removeItem("user");
      }
    }
  }, []);

  // stable login and logout so consumers can safely include them in deps
  const login = useCallback((userObj) => {
    setUser(userObj);
    try {
      sessionStorage.setItem("user", JSON.stringify(userObj));
    } catch (err) {
      console.error("Failed to persist user to sessionStorage", err);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    sessionStorage.removeItem("user");
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
