import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("tf_user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (credentials) => {
    // TODO: replace with real API call
    const mockUser = {
      id:            "1",
      firstName:     "Alen",
      lastName:      "Smrkovic",
      email:         credentials.email,
      role:          "Owner",
      workspaceName: "Acme Corp",
      token:         "mock-jwt-token",
    };
    localStorage.setItem("tf_user", JSON.stringify(mockUser));
    localStorage.setItem("tf_token", mockUser.token);
    setUser(mockUser);
    return mockUser;
  };

  const register = async (data) => {
    // TODO: replace with real API call
    const mockUser = {
      id:            "1",
      firstName:     data.firstName,
      lastName:      data.lastName,
      email:         data.email,
      role:          "Owner",
      workspaceName: data.workspaceName,
      token:         "mock-jwt-token",
    };
    localStorage.setItem("tf_user", JSON.stringify(mockUser));
    localStorage.setItem("tf_token", mockUser.token);
    setUser(mockUser);
    return mockUser;
  };

  const logout = () => {
    localStorage.removeItem("tf_user");
    localStorage.removeItem("tf_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);