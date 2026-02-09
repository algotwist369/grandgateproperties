import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { RiMenuFold2Fill, RiMenuUnfold2Fill, RiLogoutBoxRLine, RiUserLine, RiSettings4Line } from 'react-icons/ri';
import { logoutUser as logout, getFullUrl } from '../apis/user_api';

const AdminAgentHeader = ({ isSidebarOpen, setSidebarOpen, user }) => {
    const navigate = useNavigate();
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await logout();
            localStorage.removeItem('userInfo');
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <header className="h-20 bg-[#1a1a1a] border-b border-[#333] flex items-center justify-between px-6 sticky top-0 z-40 transition-all duration-300">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => setSidebarOpen(!isSidebarOpen)}
                    className="p-2 text-gray-400 hover:text-[#BD9B5F] hover:bg-[#BD9B5F]/10 rounded-lg transition-all lg:hidden"
                >
                    {isSidebarOpen ? <RiMenuFold2Fill size={24} /> : <RiMenuUnfold2Fill size={24} />}
                </button>

                <div className="flex items-center gap-3">
                    {!isSidebarOpen && (
                        <Link to="/" className="flex items-center gap-2 mr-4 lg:hidden">
                            <img src="/logo/main.png" alt="Logo" className="h-8 w-auto" />
                        </Link>
                    )}
                    <h2 className="text-xl font-bold text-white">
                        Welcome back, <span className="text-[#BD9B5F]">{user?.user_name || 'User'}</span>
                    </h2>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative">
                    <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center gap-3 p-1.5 pr-3 rounded-full bg-[#222] border border-[#333] hover:border-[#BD9B5F]/50 transition-all group"
                    >
                        <div className="w-9 h-9 rounded-full bg-[#BD9B5F]/10 border border-[#BD9B5F]/20 flex items-center justify-center overflow-hidden">
                            {user?.profile_picture ? (
                                <img src={getFullUrl(user.profile_picture)} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <RiUserLine size={20} className="text-[#BD9B5F]" />
                            )}
                        </div>
                        <div className="hidden sm:block text-left">
                            <p className="text-xs font-semibold text-white leading-tight">{user?.user_name}</p>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest">{user?.role}</p>
                        </div>
                    </button>

                    <AnimatePresence>
                        {isProfileOpen && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)}></div>
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute right-0 mt-3 w-56 bg-[#1a1a1a] border border-[#333] rounded-2xl shadow-2xl p-2 z-20"
                                >
                                    <Link
                                        to={user?.role === 'admin' ? '/admin/profile' : '/agent/profile'}
                                        className="flex items-center gap-3 w-full p-3 text-sm text-gray-400 hover:text-white hover:bg-[#BD9B5F]/10 rounded-xl transition-all group"
                                        onClick={() => setIsProfileOpen(false)}
                                    >
                                        <RiUserLine size={18} className="group-hover:text-[#BD9B5F]" />
                                        Profile Settings
                                    </Link>
                                    <button
                                        className="flex items-center gap-3 w-full p-3 text-sm text-gray-400 hover:text-white hover:bg-[#BD9B5F]/10 rounded-xl transition-all group"
                                        onClick={() => setIsProfileOpen(false)}
                                    >
                                        <RiSettings4Line size={18} className="group-hover:text-[#BD9B5F]" />
                                        Preferences
                                    </button>
                                    <div className="h-px bg-[#333] my-2 mx-2"></div>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-3 w-full p-3 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                                    >
                                        <RiLogoutBoxRLine size={18} />
                                        Sign Out
                                    </button>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    );
};

export default AdminAgentHeader;
