import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getAutherUser } from '../Storage';


const Admin = () => {
    const auth =getAutherUser();
    return <>{auth && auth.role===1  ? <Outlet /> : <Navigate to={"/"}/>}</>; 
};

export default Admin;