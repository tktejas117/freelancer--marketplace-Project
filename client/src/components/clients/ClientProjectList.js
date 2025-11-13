import React from 'react';
import { Link } from 'react-router-dom';

const mockProjects = [
    { id: 1, title: 'Build a new e-commerce website', status: 'Open', proposals: 12 },
    { id: 2, title: 'Logo Design for a Startup', status: 'In Progress', proposals: 5 },
];

const ClientProjectList = () => {
    return (
        <div className="space-y-4">
            {mockProjects.map((project) => (
                <div key={project.id} className="bg-gray-50 p-4 rounded-lg border flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">{project.title}</h3>
                        <p className="text-sm text-gray-500">{project.status} • {project.proposals} Proposals</p>
                    </div>
                    <Link
                        to={`/projects/${project.id}`}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                    >
                        View Details
                    </Link>
                </div>
            ))}
        </div>
    );
};

export default ClientProjectList;

