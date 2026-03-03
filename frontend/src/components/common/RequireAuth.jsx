import React, { useContext } from 'react';
import { AuthContext } from '../context/Auth';
import { Navigate } from 'react-router-dom';

export const RequireAuth = ({ children }) => {

    const { user } = useContext(AuthContext);

    // If no auth data or no token → redirect
    if (!user || !user.token) {
        return <Navigate to="/account/login" replace />;
    }

    return children;
};