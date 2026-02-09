import React from 'react';

const AdminAgentFooter = () => {
    return (
        <footer className="py-6 px-8 border-t border-[#333] bg-[#111010] flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left transition-all">
            <p className="text-gray-500 text-sm">
                &copy; {new Date().getFullYear()} <span className="text-[#BD9B5F] font-semibold">Grand Gate Properties</span>. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
                <a href="#" className="text-xs text-gray-500 hover:text-[#BD9B5F] transition-colors">Privacy Policy</a>
                <a href="#" className="text-xs text-gray-500 hover:text-[#BD9B5F] transition-colors">Terms of Service</a>
                <a href="#" className="text-xs text-gray-500 hover:text-[#BD9B5F] transition-colors">Support</a>
            </div>
        </footer>
    );
};

export default AdminAgentFooter;
