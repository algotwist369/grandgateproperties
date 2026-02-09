import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    RiDashboardLine,
    RiHome4Line,
    RiUser6Line,
    RiTeamLine,
    RiBuildingLine,
    RiAddCircleLine,
    RiArrowRightSLine
} from 'react-icons/ri';

const AdminAgentSidebar = ({ isOpen, user }) => {
    const role = user?.role || 'user';

    const menuItems = [
        {
            title: 'Main',
            items: [
                { label: 'Dashboard', path: `/${role}/dashboard`, icon: <RiDashboardLine size={20} /> },
                { label: 'Profile', path: `/${role}/profile`, icon: <RiUser6Line size={20} /> },
            ]
        },
        {
            title: 'Properties',
            items: [
                { label: 'All Properties', path: `/${role}/properties`, icon: <RiBuildingLine size={20} /> },
                { label: 'Add Property', path: `/${role}/add-property`, icon: <RiAddCircleLine size={20} /> },
            ]
        },
        role === 'admin' ? {
            title: 'Management',
            items: [
                { label: 'Agents', path: '/admin/agents', icon: <RiTeamLine size={20} /> },
                { label: 'Users', path: '/admin/users', icon: <RiUser6Line size={20} /> },
            ]
        } : null
    ].filter(Boolean);

    const activeLinkClass = "flex items-center gap-3 px-4 py-3 rounded-xl bg-[#BD9B5F] text-white shadow-lg shadow-[#BD9B5F]/20 transition-all duration-300";
    const inactiveLinkClass = "flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-[#BD9B5F]/10 transition-all duration-300 group";

    return (
        <aside
            className={`fixed left-0 top-0 h-full bg-[#1a1a1a] border-r border-[#333] z-50 transition-all duration-300 ${isOpen ? 'w-72' : 'w-20'
                }`}
        >
            {/* Logo Section */}
            <div className="h-20 flex items-center px-6 border-b border-[#333]">
                <Link to="/" className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#BD9B5F] flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-[#BD9B5F]/20 flex-shrink-0">
                        GP
                    </div>
                    {isOpen && (
                        <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="font-bold text-lg text-white whitespace-nowrap"
                        >
                            Grand Gate
                        </motion.span>
                    )}
                </Link>
            </div>

            {/* Nav Links */}
            <div className="p-4 space-y-8 overflow-y-auto h-[calc(100%-80px)] scrollbar-hide">
                {menuItems.map((section, idx) => (
                    <div key={idx} className="space-y-4">
                        {isOpen && (
                            <p className="px-4 text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold">
                                {section.title}
                            </p>
                        )}
                        <div className="space-y-1">
                            {section.items.map((item, idy) => (
                                <NavLink
                                    key={idy}
                                    to={item.path}
                                    className={({ isActive }) => isActive ? activeLinkClass : inactiveLinkClass}
                                    title={!isOpen ? item.label : ''}
                                >
                                    <span className="flex-shrink-0">{item.icon}</span>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="flex items-center justify-between w-full"
                                        >
                                            <span className="text-sm font-medium">{item.label}</span>
                                            <RiArrowRightSLine size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </motion.div>
                                    )}
                                </NavLink>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer Upgrade Banner (Only when sidebar open) */}
            {isOpen && (
                <div className="absolute bottom-6 left-6 right-6">
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-[#BD9B5F]/20 to-transparent border border-[#BD9B5F]/10 text-center">
                        <p className="text-xs text-gray-400 mb-2 italic">Need help?</p>
                        <button className="text-[10px] font-bold text-[#BD9B5F] uppercase tracking-widest hover:underline">
                            Contact Support
                        </button>
                    </div>
                </div>
            )}
        </aside>
    );
};

export default AdminAgentSidebar;
