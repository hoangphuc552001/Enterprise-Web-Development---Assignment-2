import React, { useState } from "react";
import { AuthContext } from "./authContext";

const getStoredAuth = () => {
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  return {
    token,
    username,
    isAuthenticated: Boolean(token && username),
  };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const storedAuth = getStoredAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(
    storedAuth.isAuthenticated,
  );
  const [username, setUsername] = useState<string | null>(storedAuth.username);
  const [token, setToken] = useState<string | null>(storedAuth.token);

  const login = (newUsername: string, newToken: string) => {
    setToken(newToken);
    setUsername(newUsername);
    setIsAuthenticated(true);
    localStorage.setItem("token", newToken);
    localStorage.setItem("username", newUsername);
  };

  const logout = () => {
    setToken(null);
    setUsername(null);
    setIsAuthenticated(false);
    localStorage.removeItem("token");
    localStorage.removeItem("username");
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, username, token, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
