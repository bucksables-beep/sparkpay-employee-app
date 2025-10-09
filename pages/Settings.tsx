import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

const Settings: React.FC = () => {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const [profile, setProfile] = useState({
        fullName: 'Aisha Adebayo',
        email: 'a.adebayo@sparkpay.ng',
        phone: '+234 801 234 5678',
    });
    const [profilePicture, setProfilePicture] = useState('https://picsum.photos/200');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePicture(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleEditPictureClick = () => {
        fileInputRef.current?.click();
    };

    const handleLogout = () => {
        navigate('/login');
    };

    return (
        <div className="flex flex-col">
            <header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm">
                <div className="flex items-center justify-center p-4">
                    <h1 className="text-lg font-bold text-text-light dark:text-text-dark">Profile</h1>
                </div>
            </header>
            <main className="flex-grow px-4 pb-8">
                <div className="flex flex-col items-center mt-6 space-y-4">
                    <div className="relative">
                        <img alt="Aisha Adebayo profile picture" className="w-32 h-32 rounded-full object-cover border-4 border-background-light dark:border-background-dark" src={profilePicture} />
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handlePictureChange}
                            accept="image/*"
                            className="sr-only"
                        />
                        <button onClick={handleEditPictureClick} className="absolute bottom-1 right-1 bg-primary text-white rounded-full p-2 flex items-center justify-center shadow-md interactive-scale" aria-label="Edit profile picture">
                            <span className="material-symbols-outlined text-base">edit</span>
                        </button>
                    </div>
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-text-light dark:text-text-dark">{profile.fullName}</h2>
                        <p className="text-base text-subtext-light dark:text-subtext-dark">Account Manager</p>
                    </div>
                </div>
                <div className="mt-8 space-y-6">
                    <div className="space-y-4">
                        <label className="block">
                            <span className="text-sm font-medium text-subtext-light dark:text-subtext-dark">Full Name</span>
                            <input name="fullName" value={profile.fullName} onChange={handleInputChange} className="form-input mt-1 block w-full rounded-lg border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark h-14 px-4 placeholder:text-subtext-light dark:placeholder:text-subtext-dark focus:ring-primary focus:border-primary" type="text" />
                        </label>
                        <label className="block">
                            <span className="text-sm font-medium text-subtext-light dark:text-subtext-dark">Email</span>
                            <input name="email" value={profile.email} onChange={handleInputChange} className="form-input mt-1 block w-full rounded-lg border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark h-14 px-4 placeholder:text-subtext-light dark:placeholder:text-subtext-dark focus:ring-primary focus:border-primary" type="email" />
                        </label>
                        <label className="block">
                            <span className="text-sm font-medium text-subtext-light dark:text-subtext-dark">Phone Number</span>
                            <input name="phone" value={profile.phone} onChange={handleInputChange} className="form-input mt-1 block w-full rounded-lg border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark h-14 px-4 placeholder:text-subtext-light dark:placeholder:text-subtext-dark focus:ring-primary focus:border-primary" type="tel" />
                        </label>
                    </div>
                    <div className="space-y-2 pt-4 border-t border-border-light dark:border-border-dark">
                        <div className="w-full flex items-center justify-between text-left p-3 rounded-lg">
                            <span className="text-base font-medium text-text-light dark:text-text-dark">Dark Mode</span>
                             <label className="relative inline-flex cursor-pointer items-center">
                                <input 
                                    type="checkbox" 
                                    checked={theme === 'dark'}
                                    onChange={toggleTheme}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-border-light peer-focus:outline-none rounded-full peer dark:bg-border-dark peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                            </label>
                        </div>
                         <button onClick={() => navigate('/app/accounts')} className="w-full flex items-center justify-between text-left p-3 rounded-lg hover:bg-primary/10 dark:hover:bg-accent-blue/20 transition-colors interactive-scale">
                            <span className="text-base font-medium text-text-light dark:text-text-dark">Bank Accounts</span>
                            <span className="material-symbols-outlined text-subtext-light dark:text-subtext-dark" aria-hidden="true">chevron_right</span>
                        </button>
                        <button className="w-full flex items-center justify-between text-left p-3 rounded-lg hover:bg-primary/10 dark:hover:bg-accent-blue/20 transition-colors interactive-scale">
                            <span className="text-base font-medium text-text-light dark:text-text-dark">Change Password</span>
                            <span className="material-symbols-outlined text-subtext-light dark:text-subtext-dark" aria-hidden="true">chevron_right</span>
                        </button>
                        <button className="w-full flex items-center justify-between text-left p-3 rounded-lg hover:bg-primary/10 dark:hover:bg-accent-blue/20 transition-colors interactive-scale">
                            <span className="text-base font-medium text-text-light dark:text-text-dark">Personal Preferences</span>
                            <span className="material-symbols-outlined text-subtext-light dark:text-subtext-dark" aria-hidden="true">chevron_right</span>
                        </button>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-between text-left p-3 rounded-lg hover:bg-red-500/10 dark:hover:bg-red-500/20 transition-colors interactive-scale"
                        >
                            <span className="text-base font-medium text-red-600 dark:text-red-400">Logout</span>
                            <span className="material-symbols-outlined text-red-600 dark:text-red-400" aria-hidden="true">logout</span>
                        </button>
                    </div>
                </div>
                 <div className="mt-8 space-y-3">
                    <button className="w-full h-12 px-5 bg-primary text-white text-base font-bold rounded-lg flex items-center justify-center shadow-lg shadow-primary/30 hover:bg-opacity-90 transition interactive-scale">
                        Save Changes
                    </button>
                </div>
            </main>
        </div>
    );
};

export default Settings;