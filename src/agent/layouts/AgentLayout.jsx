import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AdminAgentHeader from '../../commmon_pages/Admin&AgentHeader'; // Reusing header
import AdminAgentSidebar from '../../commmon_pages/Admin&AgentSidebar'; // Reusing sidebar
import AdminAgentFooter from '../../commmon_pages/Admin&AgentFooter'; // Reusing footer

const AgentLayout = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch user info from localStorage
        const storedUser = localStorage.getItem('userInfo');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            // Verify if user is an agent (admins can also access agent dashboard usually)
            if (parsedUser.role !== 'agent' && parsedUser.role !== 'admin') {
                navigate('/login');
            } else {
                setUser(parsedUser);
            }
        } else {
            navigate('/login');
        }

        // Auto-close sidebar on mobile
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setSidebarOpen(false);
            } else {
                setSidebarOpen(true);
            }
        };

        const handleUserUpdate = () => {
            const updatedUser = localStorage.getItem('userInfo');
            if (updatedUser) {
                setUser(JSON.parse(updatedUser));
            }
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('userInfoUpdated', handleUserUpdate);
        handleResize(); // Initial check

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('userInfoUpdated', handleUserUpdate);
        };
    }, [navigate]);

    return (
        <div className="h-screen bg-[#111010] flex overflow-hidden">
            {/* Sidebar */}
            <AdminAgentSidebar isOpen={isSidebarOpen} user={user} />

            {/* Main Content Area */}
            <div
                className={`flex-1 flex flex-col h-screen transition-all duration-300 ${isSidebarOpen ? 'lg:ml-72' : 'ml-20'
                    }`}
            >
                {/* Header */}
                <AdminAgentHeader
                    isSidebarOpen={isSidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                    user={user}
                />

                {/* Content Section - Only this part scrolls */}
                <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-[#111010]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={window.location.pathname}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Outlet context={{ user }} />
                        </motion.div>
                    </AnimatePresence>
                </main>

                {/* Fixed Footer */}
                <AdminAgentFooter />
            </div>

            {/* Mobile Overlay */}
            <AnimatePresence>
                {isSidebarOpen && window.innerWidth < 1024 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSidebarOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[45] lg:hidden"
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default AgentLayout;
