import { createContext, useContext, useState } from "react";
import { login as loginApi, register as registerApi } from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("tf_user");
    return stored ? JSON.parse(stored) : null;
  });

  const updateUser = (newUser) => {
    setUser(newUser);
  };

  const login = async (data) => {
    const res      = await loginApi(data);
    const userData = res.data;
    localStorage.setItem("tf_token", userData.token);
    localStorage.setItem("tf_user", JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const register = async (data) => {
    const res = await registerApi(data);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem("tf_token");
    localStorage.removeItem("tf_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);