import React, { useState, useRef, useEffect } from 'react';
import { Edit, Save, XCircle, Upload, Plus, Trash2 } from 'lucide-react';
import '../../styles/Profile.css';

const userProfileKey = 'freelancerProfile';

const allSkills = [
    'React', 'Node.js', 'JavaScript', 'TypeScript', 'Angular', 'Vue.js', 'HTML5', 'CSS3',
    'UI/UX Design', 'Figma', 'Adobe XD', 'Sketch',
    'MongoDB', 'PostgreSQL', 'MySQL', 'SQL',
    'Tailwind CSS', 'Bootstrap', 'Sass',
    'Data Analysis', 'Data Visualization', 'Python', 'R', 'Machine Learning',
    'Graphic Design', 'Logo Design', 'Illustration', 'Photoshop',
    'Copywriting', 'Content Writing', 'SEO',
    'Project Management', 'Agile', 'Scrum'
];

const initialFreelancerData = {
    name: 'Jane Doe',
    title: 'Senior React Developer & UI/UX Specialist',
    hourlyRate: 75,
    bio: 'I am a passionate developer with over 8 years of experience building beautiful, responsive, and high-performing web applications. I specialize in the MERN stack and have a keen eye for user-centric design.',
    profilePicture: 'https://placehold.co/120x120/E2E8F0/4A5568?text=JD',
    skills: ['React', 'Node.js', 'JavaScript', 'UI/UX Design', 'MongoDB', 'Tailwind CSS', 'Figma'],
    portfolio: [
        { id: 1, title: 'E-commerce Platform', description: 'A full-stack e-commerce site with payment integration.', image: 'https://placehold.co/400x300/6366F1/FFFFFF?text=Project+1' },
        { id: 2, title: 'SaaS Dashboard', description: 'A complex data visualization dashboard for a SaaS product.', image: 'https://placehold.co/400x300/3B82F6/FFFFFF?text=Project+2' },
        { id: 3, title: 'Mobile Banking App', description: 'UI/UX redesign for a leading mobile banking application.', image: 'https://placehold.co/400x300/10B981/FFFFFF?text=Project+3' },
    ]
};

const FreelancerProfile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [showSaveMessage, setShowSaveMessage] = useState(false);

    const [profileData, setProfileData] = useState(() => {
        try {
            const savedProfile = localStorage.getItem(userProfileKey);
            return savedProfile ? JSON.parse(savedProfile) : initialFreelancerData;
        } catch (error) {
            console.error("Failed to parse profile from localStorage", error);
            return initialFreelancerData;
        }
    });

    const [originalProfileData, setOriginalProfileData] = useState(null);
    const fileInputRef = useRef(null);
    const portfolioFileInputRefs = useRef([]);
    const [skillInput, setSkillInput] = useState('');
    const [skillSuggestions, setSkillSuggestions] = useState([]);

    const handleEditClick = () => {
        setOriginalProfileData(profileData);
        setIsEditing(true);
    };

    const handleSaveClick = () => {
        localStorage.setItem(userProfileKey, JSON.stringify(profileData));
        setIsEditing(false);
        // Show the save confirmation message
        setShowSaveMessage(true);
        setTimeout(() => {
            setShowSaveMessage(false);
        }, 2000); // Hide message after 2 seconds
    };

    const handleCancelClick = () => {
        setProfileData(originalProfileData);
        setIsEditing(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prevData => ({ ...prevData, [name]: value }));
    };

    const handlePictureChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileData(prevData => ({ ...prevData, profilePicture: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleSkillInputChange = (e) => {
        const value = e.target.value;
        setSkillInput(value);
        if (value) {
            const suggestions = allSkills.filter(skill => 
                skill.toLowerCase().includes(value.toLowerCase()) && 
                !profileData.skills.includes(skill)
            );
            setSkillSuggestions(suggestions);
        } else {
            setSkillSuggestions([]);
        }
    };

    const addSkill = (skillToAdd) => {
        if (skillToAdd && !profileData.skills.includes(skillToAdd)) {
            setProfileData(prevData => ({ ...prevData, skills: [...prevData.skills, skillToAdd] }));
            setSkillInput('');
            setSkillSuggestions([]);
        }
    };

    const removeSkill = (skillToRemove) => {
        setProfileData(prevData => ({
            ...prevData,
            skills: prevData.skills.filter(skill => skill !== skillToRemove)
        }));
    };

    const handlePortfolioChange = (index, e) => {
        const { name, value } = e.target;
        const updatedPortfolio = [...profileData.portfolio];
        updatedPortfolio[index] = { ...updatedPortfolio[index], [name]: value };
        setProfileData(prevData => ({ ...prevData, portfolio: updatedPortfolio }));
    };

    const handlePortfolioImageChange = (index, e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const updatedPortfolio = [...profileData.portfolio];
                updatedPortfolio[index] = { ...updatedPortfolio[index], image: reader.result };
                setProfileData(prevData => ({ ...prevData, portfolio: updatedPortfolio }));
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="profile-page">
            <div className="profile-container">
                <div 
                    className={`save-confirmation ${showSaveMessage ? 'visible' : ''}`}
                >
                    Profile Saved!
                </div>
                <div className="profile-actions">
                    {isEditing ? (
                        <>
                            <button onClick={handleSaveClick} className="profile-btn profile-save-btn">
                                <Save size={16} /> Save Changes
                            </button>
                            <button onClick={handleCancelClick} className="profile-btn profile-cancel-btn">
                                <XCircle size={16} /> Cancel
                            </button>
                        </>
                    ) : (
                        <button onClick={handleEditClick} className="profile-btn profile-edit-btn">
                            <Edit size={16} /> Edit Profile
                        </button>
                    )}
                </div>

                <header className="profile-header">
                     <div className="profile-picture-container">
                        <img src={profileData.profilePicture} alt={profileData.name} className="profile-picture" />
                        {isEditing && (
                            <>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePictureChange}
                                    className="hidden-file-input"
                                    ref={fileInputRef}
                                />
                                <button onClick={() => fileInputRef.current.click()} className="profile-picture-upload-btn">
                                    <Upload size={14} /> Change Photo
                                </button>
                            </>
                        )}
                    </div>
                    <div className="profile-info">
                        {isEditing ? (
                            <input type="text" name="name" value={profileData.name} onChange={handleInputChange} className="profile-input" style={{ fontSize: '2rem', fontWeight: '700' }} />
                        ) : ( <h1>{profileData.name}</h1> )}
                        {isEditing ? (
                            <input type="text" name="title" value={profileData.title} onChange={handleInputChange} className="profile-input" style={{ fontSize: '1.1rem' }} />
                        ) : ( <p>{profileData.title}</p> )}
                        <div className="profile-rate">
                            ${isEditing ? (
                                <input type="number" name="hourlyRate" value={profileData.hourlyRate} onChange={handleInputChange} className="profile-input" style={{ width: '80px', display: 'inline-block' }}/>
                            ) : ( profileData.hourlyRate )}/hr
                        </div>
                    </div>
                </header>
                <main className="profile-body">
                    <section className="profile-section">
                        <h2>About Me</h2>
                        {isEditing ? (
                            <textarea name="bio" value={profileData.bio} onChange={handleInputChange} className="profile-textarea" rows="5"></textarea>
                        ) : ( <p>{profileData.bio}</p> )}
                    </section>
                    
                    <section className="profile-section">
                        <h2>Skills</h2>
                        {isEditing ? (
                             <div className="skills-edit-container">
                                <input
                                    type="text"
                                    value={skillInput}
                                    onChange={handleSkillInputChange}
                                    className="profile-input"
                                    placeholder="Start typing a skill..."
                                />
                                <button onClick={() => addSkill(skillInput)} className="skill-add-btn">
                                    <Plus size={16} /> Add
                                </button>
                                {skillSuggestions.length > 0 && (
                                    <div className="suggestions-dropdown">
                                        {skillSuggestions.map(suggestion => (
                                            <div 
                                                key={suggestion} 
                                                className="suggestion-item"
                                                onClick={() => addSkill(suggestion)}
                                            >
                                                {suggestion}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : null}
                        <div className="skills-list">
                            {profileData.skills.map(skill => (
                                <span key={skill} className="skill-tag">
                                    {skill}
                                    {isEditing && (
                                        <button onClick={() => removeSkill(skill)} className="skill-remove-btn">
                                            <Trash2 size={12} />
                                        </button>
                                    )}
                                </span>
                            ))}
                        </div>
                    </section>

                     <section className="profile-section">
                        <h2>Portfolio</h2>
                        <div className="portfolio-grid">
                            {profileData.portfolio.map((item, index) => (
                                <div key={item.id}>
                                    {isEditing ? (
                                        <div className="portfolio-item-edit">
                                            <div className="portfolio-edit-image-container">
                                                <img src={item.image} alt="Portfolio preview" className="portfolio-edit-preview" />
                                                <div>
                                                    <input 
                                                        type="file" 
                                                        accept="image/*"
                                                        className="hidden-file-input"
                                                        ref={el => portfolioFileInputRefs.current[index] = el}
                                                        onChange={(e) => handlePortfolioImageChange(index, e)}
                                                    />
                                                    <button type="button" onClick={() => portfolioFileInputRefs.current[index].click()} className="portfolio-upload-btn">
                                                        Upload Image
                                                    </button>
                                                </div>
                                            </div>

                                            <label>Project Title</label>
                                            <input type="text" name="title" value={item.title} onChange={(e) => handlePortfolioChange(index, e)} className="profile-input"/>
                                            <label>Description</label>
                                            <textarea name="description" value={item.description} onChange={(e) => handlePortfolioChange(index, e)} className="profile-textarea" rows="3"></textarea>
                                        </div>
                                    ) : (
                                        <div className="portfolio-item">
                                            <img src={item.image} alt={item.title} className="portfolio-image" />
                                            <div className="portfolio-info">
                                                <h3>{item.title}</h3>
                                                <p>{item.description}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default FreelancerProfile;

