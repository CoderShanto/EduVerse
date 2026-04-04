import { createContext, useState, useContext } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const storedAuth = localStorage.getItem("userInfoLms");
  const parsedAuth = storedAuth ? JSON.parse(storedAuth) : null;

  const [user, setUser] = useState(parsedAuth);

  const login = (data) => {
    // data should contain: token + user
    localStorage.setItem("userInfoLms", JSON.stringify(data));

    // ✅ also store separately for pages that read token directly
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    setUser(data);
  };

  const logout = () => {
    localStorage.removeItem("userInfoLms");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
