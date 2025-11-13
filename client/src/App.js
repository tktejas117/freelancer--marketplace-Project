import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import all components
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import ClientDashboard from './components/dashboards/ClientDashboard';
import FreelancerDashboard from './components/dashboards/FreelancerDashboard';
import ClientProjectDetails from './components/clients/ClientProjectDetails';
import FreelancerProfile from './components/freelancers/FreelancerProfile';
import FreelancerActiveWork from './components/freelancers/FreelancerActiveWork';
import BrowseProjects from './components/projects/BrowseProjects';
// Corrected the import path below to match your likely filename
import FreelancerProposals from './components/freelancers/FreelancerProposals'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/client-dashboard" element={<ClientDashboard />} />
            <Route path="/freelancer-dashboard" element={<FreelancerDashboard />} />
            <Route path="/projects/:projectId" element={<ClientProjectDetails />} />
            <Route path="/profile" element={<FreelancerProfile />} />
            <Route path="/active-work" element={<FreelancerActiveWork />} />
            <Route path="/browse-projects" element={<BrowseProjects />} />
            {/* Updated the component name used in the route */}
            <Route path="/proposals" element={<FreelancerProposals />} /> 
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

