import React from 'react';
import { useSelector } from 'react-redux';
import { useLocation, Navigate, Outlet } from "react-router-dom"
// import { useAuth } from '../hooks/useAuth';


const ProtectedRoute: React.FC = () => {
    const { isAuthenticated, isLoading } = useSelector((state: any) => state.auth);
    console.log("ProtectedRoute: isLoading: ", isLoading)
    console.log("ProtectedRoute: isAuthenticated: ", isAuthenticated)
    const location = useLocation();

    return (
        isLoading
            ? <div>Loading...</div>
            :
        isAuthenticated
                ? <Outlet />
                : <Navigate to="/login" state={{ from: location }} replace />
        )
};

export default ProtectedRoute;

export {};