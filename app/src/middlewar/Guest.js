import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getAutherUser } from '../Storage';


const Guest = () => {
    const auth =getAutherUser();
    return <>{!auth ? <Outlet /> : <Navigate to={"/"}/>}</>; 
};

export default Guest;