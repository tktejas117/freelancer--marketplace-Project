// client/src/components/projects/ProjectDetails.js
import React from 'react';
import { useParams } from 'react-router-dom';

const mockProject = {
    id: 1,
    title: 'Build a new e-commerce website',
    description: 'We are looking for an experienced full-stack developer to build a modern, responsive e-commerce platform. The platform should include features like product listings, a shopping cart, secure checkout, and a user account dashboard. We prefer the MERN stack (MongoDB, Express, React, Node.js).',
    budget: 2000,
    skills: ['React', 'Node.js', 'MongoDB', 'Express', 'E-commerce'],
    posted: '2 days ago',
    client: { name: 'John Doe', rating: 4.8 }
};

const ProjectDetails = () => {
    const { id } = useParams(); // In a real app, you'd fetch project details using this ID
    
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white p-8 rounded-xl shadow-lg">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">{mockProject.title}</h1>
                <div className="flex flex-wrap gap-2 mb-6">
                    {mockProject.skills.map(skill => (
                        <span key={skill} className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">{skill}</span>
                    ))}
                </div>
                <h2 className="text-2xl font-semibold text-gray-700 mb-3 border-b pb-2">Project Description</h2>
                <p className="text-gray-600 leading-relaxed">{mockProject.description}</p>
            </div>
            
            <div className="space-y-6">
                 <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                    <button className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition text-lg">
                        Apply Now (${mockProject.budget})
                    </button>
                    <p className="text-gray-500 text-sm mt-3">You can submit a proposal for this project.</p>
                 </div>
                 <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h3 className="text-xl font-semibold text-gray-700 mb-3">About the Client</h3>
                    <p className="font-bold text-gray-800">{mockProject.client.name}</p>
                    <p className="text-yellow-500 font-bold">{mockProject.client.rating} ★★★★☆</p>
                 </div>
            </div>
        </div>
    );
};

export default ProjectDetails;
