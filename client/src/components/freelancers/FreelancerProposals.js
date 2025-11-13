import React from 'react';
import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';
import '../../styles/Proposals.css';

// Mock data for submitted proposals
const mockProposals = [
    { id: 1, projectId: 1, projectTitle: 'Build a new e-commerce website', status: 'Accepted' },
    { id: 2, projectId: 2, projectTitle: 'Data Analysis for Sales Data', status: 'Viewed' },
    { id: 3, projectId: 3, projectTitle: 'Mobile App UI/UX Redesign', status: 'Sent' },
    { id: 4, projectId: 4, projectTitle: 'Create a Company Logo', status: 'Rejected' },
];

const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
        case 'accepted': return 'status-accepted';
        case 'viewed': return 'status-viewed';
        case 'rejected': return 'status-rejected';
        default: return 'status-sent';
    }
}

const FreelanceProposals = () => {
    return (
        <div className="proposals-page">
            <div className="proposals-container">
                <header className="proposals-header">
                    <h1>My Proposals</h1>
                </header>
                <div className="proposals-list">
                    {mockProposals.map(proposal => (
                        <div key={proposal.id} className="proposal-item">
                            <div className="proposal-item-info">
                                <h2>
                                    <Link to={`/projects/${proposal.projectId}`}>{proposal.projectTitle}</Link>
                                </h2>
                                <p>Status of your proposal</p>
                            </div>
                            <span className={`status-badge ${getStatusClass(proposal.status)}`}>
                                {proposal.status}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FreelanceProposals;

