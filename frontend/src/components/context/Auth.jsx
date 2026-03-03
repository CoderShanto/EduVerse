import { createContext, useState, useContext, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const storedUser = localStorage.getItem('userInfoLms');

    const [user, setUser] = useState(
        storedUser ? JSON.parse(storedUser) : null
    );

    const login = (data) => {
        // data should contain: token + user
        localStorage.setItem('userInfoLms', JSON.stringify(data));
        setUser(data);
    };

    const logout = () => {
        localStorage.removeItem('userInfoLms');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// custom hook (very important)
export const useAuth = () => useContext(AuthContext);