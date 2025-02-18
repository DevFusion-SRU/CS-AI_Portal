import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from "./AuthContext"; 

const AdminRoute = () => {
    const { currentUserRole } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {

        if (currentUserRole==='student') {
            navigate("/");
            alert('Authorized users only')
        }
    }, [currentUserRole]); 
    return currentUserRole==='staff' ? <Outlet/> : null;
}

export default AdminRoute
