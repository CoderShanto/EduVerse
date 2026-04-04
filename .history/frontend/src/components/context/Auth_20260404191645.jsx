import { createContext, useState, useContext, useEffect } from "react";

export const AuthContext = createContext();

// ✅ Safe parser — never throws, never returns corrupted data
const safeParseAuth = () => {
  try {
    const raw = localStorage.getItem("userInfoLms");
    if (!raw || raw === "undefined" || raw === "null") return null;
    const parsed = JSON.parse(raw);
    // Must have both token and user to be valid
    if (!parsed?.token || !parsed?.user) return null;
    return parsed;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => safeParseAuth());

  // ✅ On mount: sync token key in case it's missing
  useEffect(() => {
    const auth = safeParseAuth();
    if (auth?.token) {
      // Make sure all keys are in sync
      localStorage.setItem("token", auth.token);
      localStorage.setItem("user", JSON.stringify(auth.user));
    }
  }, []);

  const login = (data) => {
    if (!data?.token || !data?.user) {
      console.error("login() called with invalid data", data);
      return;
    }

    // ✅ Store in all keys for compatibility
    localStorage.setItem("userInfoLms", JSON.stringify(data));
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    setUser(data);
  };

  const logout = () => {
    localStorage.removeItem("userInfoLms");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("auth");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
