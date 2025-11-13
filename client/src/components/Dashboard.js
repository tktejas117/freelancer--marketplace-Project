import React from 'react';
import { Navigate } from 'react-router-dom';

const Dashboard = () => {
    // 1. Get the user's role from local storage.
    const userRole = localStorage.getItem('user_role');

    // 2. Decide where to redirect the user based on their role.
    if (userRole === 'client') {
        // If they are a client, send them to the client dashboard.
        return <Navigate to="/client-dashboard" replace />;
    } else if (userRole === 'freelancer') {
        // If they are a freelancer, send them to the freelancer dashboard.
        return <Navigate to="/freelancer-dashboard" replace />;
    } else {
        // 3. If for some reason the role is not set, send them back to login.
        return <Navigate to="/login" replace />;
    }
};

export default Dashboard;

