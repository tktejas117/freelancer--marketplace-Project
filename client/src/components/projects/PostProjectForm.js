import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PostProjectForm = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [budget, setBudget] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Posting project:', { title, description, budget });
        navigate('/dashboard');
    };

    return (
        <div className="container mx-auto p-8 max-w-2xl">
            <h1 className="text-3xl font-bold mb-6">Post a New Project</h1>
            <div className="bg-white p-8 rounded-lg shadow-md">
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold">Project Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg mt-1"
                            placeholder="e.g., Need a modern logo design"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold">Project Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg mt-1 h-32"
                            placeholder="Describe your project in detail..."
                            required
                        ></textarea>
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 font-semibold">Budget ($)</label>
                        <input
                            type="number"
                            value={budget}
                            onChange={(e) => setBudget(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg mt-1"
                            placeholder="e.g., 500"
                            required
                        />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                        Submit Project
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PostProjectForm;

