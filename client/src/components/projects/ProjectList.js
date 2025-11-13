// client/src/components/projects/ProjectList.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Tag, Clock, DollarSign } from 'lucide-react';

const mockProjects = [
    { id: 1, title: 'Build a new e-commerce website', budget: 2000, skills: ['React', 'Node.js', 'MongoDB'], posted: '2 days ago' },
    { id: 2, title: 'Mobile App Design (UI/UX)', budget: 1500, skills: ['Figma', 'UI/UX'], posted: '5 days ago' },
    { id: 3, title: 'Logo Design for a Startup', budget: 500, skills: ['Illustrator', 'Branding'], posted: '1 week ago' },
];

const ProjectCard = ({ project }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow border border-transparent hover:border-blue-500">
        <h3 className="text-xl font-bold text-gray-800">{project.title}</h3>
        <div className="flex flex-wrap items-center gap-4 text-gray-500 my-3">
            <span className="flex items-center"><DollarSign size={16} className="mr-1"/> Budget: ${project.budget.toLocaleString()}</span>
            <span className="flex items-center"><Clock size={16} className="mr-1"/> Posted {project.posted}</span>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
            {project.skills.map(skill => (
                <span key={skill} className="bg-gray-200 text-gray-800 text-xs font-semibold px-2.5 py-1 rounded-full">{skill}</span>
            ))}
        </div>
        <Link to={`/project/${project.id}`} className="font-semibold text-blue-600 hover:underline">
            View Details & Apply
        </Link>
    </div>
);

const ProjectList = () => {
    return (
        <div className="space-y-8">
            <h1 className="text-4xl font-bold text-gray-800">Browse Projects</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockProjects.map(project => (
                    <ProjectCard key={project.id} project={project} />
                ))}
            </div>
        </div>
    );
};

export default ProjectList;
