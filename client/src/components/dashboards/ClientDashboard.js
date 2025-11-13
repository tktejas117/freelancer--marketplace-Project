import React from 'react';
import { Link } from 'react-router-dom';
import ClientProjectList from '../clients/ClientProjectList';

const ClientDashboard = () => {
    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Client Dashboard</h1>
                <Link
                    to="/post-project"
                    className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
                >
                    + Post Project
                </Link>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4">My Projects</h2>
                <ClientProjectList />
            </div>
        </div>
    );
};

export default ClientDashboard;

