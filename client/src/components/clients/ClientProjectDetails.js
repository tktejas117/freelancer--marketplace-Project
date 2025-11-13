import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { UserCheck, MessageSquare, DollarSign, Clock, Paperclip, Send } from 'lucide-react';
import '../../styles/Profile.css'; // Re-using some styles for consistency

const mockProposals = [
    { id: 1, freelancer: 'Jane Doe', rate: 50, message: 'I have extensive experience in e-commerce and can deliver a high-quality website that meets your needs.' },
    { id: 2, freelancer: 'John Smith', rate: 55, message: 'Expert in React and Node.js. I am confident I can build the features you require quickly and efficiently.' },
];

const ClientProjectDetails = () => {
    const { projectId } = useParams();
    const userRole = localStorage.getItem('user_role');
    const [proposalSent, setProposalSent] = useState(false);

    const handleProposalSubmit = (e) => {
        e.preventDefault();
        // In a real app, you would send this data to the server
        console.log('Submitting proposal...');
        setProposalSent(true);
    };

    // Client View
    if (userRole === 'client') {
        return (
            <div className="profile-page">
                <div className="profile-container">
                    <h1 className="text-3xl font-bold mb-6">Project Details (ID: {projectId})</h1>
                    <section className="profile-section">
                        <h2>Proposals Received</h2>
                        <div className="space-y-4">
                            {mockProposals.map((proposal) => (
                                <div key={proposal.id} className="border p-4 rounded-lg">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="text-lg font-bold text-blue-600 flex items-center">
                                            <UserCheck className="w-5 h-5 mr-2" />
                                            {proposal.freelancer}
                                        </h3>
                                        <span className="text-lg font-semibold">${proposal.rate}/hr</span>
                                    </div>
                                    <p className="text-gray-600 flex items-start">
                                        <MessageSquare className="w-5 h-5 mr-2 mt-1 flex-shrink-0" />
                                        {proposal.message}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        );
    }

    // Freelancer View
    return (
        <div className="profile-page">
            <div className="profile-container">
                <h1 className="text-3xl font-bold mb-6">Submit a Proposal</h1>
                
                {proposalSent ? (
                    <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md" role="alert">
                        <p className="font-bold">Proposal Sent!</p>
                        <p>The client has been notified. You can track the status on your "My Proposals" page.</p>
                    </div>
                ) : (
                    <form onSubmit={handleProposalSubmit} className="space-y-6">
                        <section className="profile-section">
                            <h2>Your Cover Letter</h2>
                            <textarea
                                className="profile-textarea"
                                rows="6"
                                placeholder="Introduce yourself and explain why you're the best fit for this project..."
                                required
                            ></textarea>
                        </section>

                        <section className="profile-section">
                            <h2>Your Bid</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block font-semibold mb-2">Bid Amount ($)</label>
                                    <div className="relative">
                                        <DollarSign size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input type="number" className="profile-input pl-10" placeholder="e.g., 500" required />
                                    </div>
                                </div>
                                <div>
                                    <label className="block font-semibold mb-2">Estimated Delivery Time</label>
                                    <div className="relative">
                                        <Clock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input type="text" className="profile-input pl-10" placeholder="e.g., 2 weeks" required />
                                    </div>
                                </div>
                            </div>
                        </section>
                        
                        <section className="profile-section">
                            <h2>Attach Files (Optional)</h2>
                             <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                <Paperclip size={24} className="mx-auto text-gray-400" />
                                <p className="mt-2 text-sm text-gray-600">Drag & drop or click to upload</p>
                                <input type="file" className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer" />
                            </div>
                        </section>
                        
                        <button type="submit" className="profile-btn profile-save-btn w-full justify-center">
                            <Send size={16} /> Submit Proposal
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ClientProjectDetails;

