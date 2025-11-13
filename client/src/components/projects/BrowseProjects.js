import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, Clock, Bookmark, SlidersHorizontal, Search } from 'lucide-react';
import '../../styles/BrowseProjects.css';

// Mock data for projects
const mockProjects = [
    { id: 1, title: 'Build a new e-commerce website', budget: 2000, description: 'Looking for an expert to build a fully responsive e-commerce site with payment integration.', posted: '4 hours ago', skills: ['React', 'Node.js', 'E-commerce'] },
    { id: 2, title: 'Data Analysis for Sales Data', budget: 1200, description: 'We need a data analyst to process our quarterly sales data and provide insights and visualizations.', posted: '1 day ago', skills: ['Python', 'SQL', 'Data Visualization'] },
    { id: 3, title: 'Mobile App UI/UX Redesign', budget: 3500, description: 'Redesign our existing mobile banking app to improve user experience and modernize the interface.', posted: '2 days ago', skills: ['Figma', 'UI/UX Design', 'Mobile App'] },
    { id: 4, title: 'Create a Company Logo', budget: 750, description: 'We are a new startup in the tech space and need a modern, memorable logo.', posted: '5 days ago', skills: ['Graphic Design', 'Logo Design'] },
];

const allSkills = ['React', 'Node.js', 'E-commerce', 'Python', 'SQL', 'Data Visualization', 'Figma', 'UI/UX Design', 'Mobile App', 'Graphic Design', 'Logo Design'];


const BrowseProjects = () => {
    const [projects, setProjects] = useState(mockProjects);
    const [savedProjects, setSavedProjects] = useState(new Set());
    
    // Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [budget, setBudget] = useState(5000);
    const [selectedSkill, setSelectedSkill] = useState('All');

    useEffect(() => {
        let filtered = mockProjects;

        // Filter by search term (project name)
        if (searchTerm) {
            filtered = filtered.filter(p => 
                p.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by budget
        filtered = filtered.filter(p => p.budget <= budget);

        // Filter by skill
        if (selectedSkill !== 'All') {
            filtered = filtered.filter(p => p.skills.includes(selectedSkill));
        }

        setProjects(filtered);
    }, [searchTerm, budget, selectedSkill]);

    const toggleSaveProject = (projectId) => {
        setSavedProjects(prev => {
            const newSet = new Set(prev);
            if (newSet.has(projectId)) {
                newSet.delete(projectId);
            } else {
                newSet.add(projectId);
            }
            return newSet;
        });
    };

    return (
        <div className="browse-page">
            <div className="browse-container">
                {/* --- Filters Sidebar --- */}
                <aside className="filters-sidebar">
                    <div className="filter-group">
                        <h3><SlidersHorizontal size={18} className="inline-block mr-2" />Filters</h3>
                    </div>
                    <div className="filter-group">
                        <label htmlFor="budget-filter">Max Budget</label>
                        <input
                            id="budget-filter"
                            type="range"
                            min="500"
                            max="5000"
                            step="100"
                            value={budget}
                            onChange={(e) => setBudget(Number(e.target.value))}
                        />
                        <div className="budget-display">${budget.toLocaleString()}</div>
                    </div>
                    <div className="filter-group">
                        <label htmlFor="skill-filter">Skills</label>
                        <select
                            id="skill-filter"
                            value={selectedSkill}
                            onChange={(e) => setSelectedSkill(e.target.value)}
                        >
                            <option>All</option>
                            {allSkills.map(skill => <option key={skill}>{skill}</option>)}
                        </select>
                    </div>
                </aside>

                {/* --- Project Listings --- */}
                <main className="project-listings">
                    <div className="listings-header">
                        <h1>Browse Projects</h1>
                        <div className="search-container">
                            <Search size={20} className="search-icon" />
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Search by project name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    
                    {projects.length > 0 ? (
                        projects.map(project => (
                            <div key={project.id} className="project-card">
                                <div className="project-card-header">
                                    <h2><Link to={`/projects/${project.id}`}>{project.title}</Link></h2>
                                    <button
                                        onClick={() => toggleSaveProject(project.id)}
                                        className={`save-button ${savedProjects.has(project.id) ? 'saved' : ''}`}
                                        title="Save for later"
                                    >
                                        <Bookmark size={18} />
                                    </button>
                                </div>
                                <div className="project-meta">
                                    <span><DollarSign size={14} /> Budget: ${project.budget.toLocaleString()}</span>
                                    <span><Clock size={14} /> Posted: {project.posted}</span>
                                </div>
                                <p className="project-description">{project.description}</p>
                                <div className="project-skills">
                                    {project.skills.map(skill => (
                                        <span key={skill} className="skill-tag">{skill}</span>
                                    ))}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-projects-found">
                            <p>No projects found matching your criteria.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default BrowseProjects;

