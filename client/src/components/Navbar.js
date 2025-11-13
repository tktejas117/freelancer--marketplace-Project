import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, User, LogOut, LayoutDashboard, Bell, Mail, Gift, DollarSign, Search, FileText } from 'lucide-react';
import '../styles/Navbar.css';

// Mock data for notifications...
const mockNotifications = [
    { id: 1, type: 'message', text: 'New message from Innovate Inc. regarding Mobile App Redesign.', time: '2 hours ago', read: false },
    { id: 2, type: 'invite', text: 'You have been invited to apply for the "Corporate Website Overhaul" project.', time: '1 day ago', read: false },
    { id: 3, type: 'payment', text: 'Payment of $500 for "Logo Design" has been released.', time: '3 days ago', read: true }
];

const NotificationIcon = ({ type }) => {
    // ... switch statement remains the same
    switch (type) {
        case 'message': return <Mail size={20} className="notification-item-icon" />;
        case 'invite': return <Gift size={20} className="notification-item-icon" />;
        case 'payment': return <DollarSign size={20} className="notification-item-icon" />;
        default: return <Bell size={20} className="notification-item-icon" />;
    }
};


const Navbar = () => {
    const navigate = useNavigate();
    const userRole = localStorage.getItem('user_role');
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [notifications, setNotifications] = useState(mockNotifications);

    // ... handleNotificationClick and other functions remain the same
    const handleNotificationClick = (id) => {
        setNotifications(currentNotifications =>
            currentNotifications.map(notification =>
                notification.id === id ? { ...notification, read: true } : notification
            )
        );
    };
    const unreadCount = notifications.filter(n => !n.read).length;
    const handleLogout = () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_role');
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/dashboard" className="navbar-logo">
                    Freelancer
                </Link>
                <div className="navbar-menu">
                    {userRole === 'freelancer' && (
                        <Link to="/browse-projects" className="navbar-link">
                            <Search size={20} />
                            <span>Browse Projects</span>
                        </Link>
                    )}

                    <Link to="/dashboard" className="navbar-link">
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </Link>
                    
                    {userRole === 'freelancer' && (
                        <>
                            <Link to="/proposals" className="navbar-link">
                                <FileText size={20} />
                                <span>My Proposals</span>
                            </Link>
                            {/* --- The order of the next two links has been swapped --- */}
                            <Link to="/active-work" className="navbar-link">
                                <Briefcase size={20} />
                                <span>Active Work</span>
                            </Link>
                            <Link to="/profile" className="navbar-link">
                                <User size={20} />
                                <span>My Profile</span>
                            </Link>
                        </>
                    )}
                    
                    <div className="notification-widget">
                        <button 
                            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} 
                            className="notification-icon-button"
                        >
                            <Bell size={24} />
                            {unreadCount > 0 && (
                                <span className="notification-badge">{unreadCount}</span>
                            )}
                        </button>
                        {isNotificationsOpen && (
                            <div className="notification-dropdown">
                                <div className="notification-dropdown-header">Notifications</div>
                                <div>
                                    {notifications.map(notification => (
                                        <div 
                                            key={notification.id} 
                                            className={`notification-dropdown-item ${notification.type} ${notification.read ? 'read' : ''}`}
                                            onClick={() => handleNotificationClick(notification.id)}
                                        >
                                            <NotificationIcon type={notification.type} />
                                            <div className="notification-item-content">
                                                <p>{notification.text}</p>
                                                <span>{notification.time}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    
                    <button onClick={handleLogout} className="navbar-logout-button">
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

