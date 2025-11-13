import React from 'react';

// Mock data for projects where the freelancer was hired
const mockActiveProjects = [
    { id: 2, title: 'Logo Design for a Startup', status: 'In Progress', client: 'Innovate Inc.' },
    { id: 5, title: 'Build a landing page', status: 'In Progress', client: 'Marketing Solutions Ltd.' },
];

const FreelancerActiveWork = () => {
    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">My Active Work</h1>
            <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
                {mockActiveProjects.length > 0 ? (
                    mockActiveProjects.map((project) => (
                        <div key={project.id} className="border p-4 rounded-lg flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-semibold">{project.title}</h3>
                                <p className="text-sm text-gray-500">Client: {project.client}</p>
                            </div>
                            <span className="bg-yellow-200 text-yellow-800 text-sm font-medium px-3 py-1 rounded-full">
                                {project.status}
                            </span>
                        </div>
                    ))
                ) : (
                    <p>You have no active projects.</p>
                )}
            </div>
        </div>
    );
};

export default FreelancerActiveWork;

