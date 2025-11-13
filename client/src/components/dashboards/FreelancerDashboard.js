import React from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, Briefcase, FileText } from 'lucide-react';
import '../../styles/Dashboard.css';

// Get the saved profile data from localStorage
const savedProfile = localStorage.getItem('freelancerProfile');
// Parse it, or use a default object if no saved data exists
const profileData = savedProfile ? JSON.parse(savedProfile) : { name: 'Freelancer' };

// Mock data for the dashboard
const dashboardData = {
    earnings: 4500,
    pendingPayouts: 1250,
    activeProjects: 2,
    activeProjectsList: [
        { id: 1, title: 'Mobile App UI/UX Redesign', client: 'Innovate Inc.' },
        { id: 2, title: 'Data Analysis for Sales Data', client: 'SalesCo' },
    ],
    recentProposals: [
        { id: 4, title: 'Build a new e-commerce website', status: 'Viewed' },
        { id: 5, title: 'SEO Content Strategy', status: 'Sent' },
    ]
};

const FreelancerDashboard = () => {
    return (
        <div className="dashboard-page">
            <div className="dashboard-container">
                <header className="dashboard-header">
                    {/* The h1 tag now uses the name from the saved profile data */}
                    <h1>Welcome Back, {profileData.name}!</h1>
                    <p>Here's a summary of your activity.</p>
                </header>

                {/* --- Stats Grid --- */}
                <div className="stats-grid">
                    <div className="stat-card green">
                        <div className="stat-icon"><DollarSign /></div>
                        <div className="stat-info">
                            <h3>Earnings (This Month)</h3>
                            <p>${dashboardData.earnings.toLocaleString()}</p>
                        </div>
                    </div>
                    <div className="stat-card orange">
                        <div className="stat-icon"><DollarSign /></div>
                        <div className="stat-info">
                            <h3>Pending Payouts</h3>
                            <p>${dashboardData.pendingPayouts.toLocaleString()}</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon"><Briefcase /></div>
                        <div className="stat-info">
                            <h3>Active Projects</h3>
                            <p>{dashboardData.activeProjects}</p>
                        </div>
                    </div>
                </div>

                {/* --- Active Projects Section --- */}
                <section className="dashboard-section">
                    <div className="dashboard-section-header">
                        <h2>Active Projects</h2>
                        <Link to="/active-work">View All</Link>
                    </div>
                    <div>
                        {dashboardData.activeProjectsList.map(job => (
                            <div key={job.id} className="list-item">
                                <div>
                                    <p className="list-item-title">{job.title}</p>
                                    <p className="list-item-subtitle">Client: {job.client}</p>
                                </div>
                                <span className="status-badge status-inprogress">In Progress</span>
                            </div>
                        ))}
                    </div>
                </section>
                
                {/* --- Recent Proposals Section --- */}
                <section className="dashboard-section">
                    <div className="dashboard-section-header">
                        <h2>Recent Proposals</h2>
                        <Link to="/proposals">View All</Link>
                    </div>
                    <div>
                        {dashboardData.recentProposals.map(proposal => (
                            <div key={proposal.id} className="list-item">
                                <p className="list-item-title">{proposal.title}</p>
                                <span className={`status-badge ${proposal.status === 'Viewed' ? 'status-viewed' : 'status-sent'}`}>
                                    {proposal.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default FreelancerDashboard;

