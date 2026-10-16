import { useMemo, useState } from "react";
import { AuthContext } from "./auth-context";

function getStoredUser() {
  const storedUser = localStorage.getItem("user");

  if (!storedUser) return null;

  try {
    return JSON.parse(storedUser);
  } catch (error) {
    if (!(error instanceof SyntaxError)) throw error;

    localStorage.removeItem("user");
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(getStoredUser);

  const value = useMemo(
    () => ({
      token,
      user,
      login: (newToken, authenticatedUser) => {
        localStorage.setItem("token", newToken);
        if (authenticatedUser)
          localStorage.setItem("user", JSON.stringify(authenticatedUser));
        else localStorage.removeItem("user");

        setToken(newToken);
        setUser(authenticatedUser || null);
      },
      updateUser: (updatedUser) => {
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
      },
      logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
      },
    }),
    [token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
