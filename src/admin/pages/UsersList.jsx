import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    RiUserLine, RiSearchLine, RiMailLine, RiPhoneLine,
    RiDeleteBinLine, RiRefreshLine, RiShieldUserLine, RiCheckboxCircleLine
} from 'react-icons/ri';
import { getAllUsers, deleteUser, updateUserStatus, getFullUrl } from '../../apis/user_api';
import Pagination from '../../commmon_pages/Pagination';

const UsersList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const fetchedRef = React.useRef(false);

    const fetchUsers = async (page = 1) => {
        setLoading(true);
        setError('');
        try {
            const data = await getAllUsers('user', page, 10);
            setUsers(data.users || []);
            setTotalPages(data.pages || 1);
            setTotalItems(data.total || 0);
            setCurrentPage(data.page || 1);
        } catch (err) {
            setError('Failed to load users');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!fetchedRef.current && currentPage === 1) {
            fetchedRef.current = true;
            fetchUsers(currentPage);
        } else if (fetchedRef.current && currentPage !== 1) {
            fetchUsers(currentPage);
        }
    }, [currentPage]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await deleteUser(id);
                setUsers(prev => prev.filter(u => u._id !== id));
                fetchUsers(currentPage);
            } catch (err) {
                alert('Failed to delete user');
            }
        }
    };

    const handleToggleStatus = async (user) => {
        const newStatus = user.status === 'active' ? 'inactive' : 'active';
        try {
            await updateUserStatus(user._id, newStatus);
            setUsers(users.map(u => u._id === user._id ? { ...u, status: newStatus } : u));
        } catch (err) {
            alert('Failed to update user status');
        }
    };

    const filteredUsers = users.filter(user =>
        user.user_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.user_email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-fade-in text-left">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">User <span className="text-[#BD9B5F]">Management</span></h1>
                    <p className="text-gray-400">Manage site users, monitor status, and handle permissions.</p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <div className="relative flex-1 md:flex-none">
                        <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-[#1a1a1a] border border-[#333] rounded-2xl pl-12 pr-6 py-3 text-white focus:border-[#BD9B5F] outline-none transition-all w-full md:w-64"
                        />
                    </div>
                    <button
                        onClick={fetchUsers}
                        className="p-3 bg-[#1a1a1a] border border-[#333] rounded-2xl text-gray-400 hover:text-[#BD9B5F] transition-all"
                    >
                        <RiRefreshLine size={20} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-900/20 border border-red-900/50 rounded-2xl text-red-400 text-sm">
                    {error}
                </div>
            )}

            <div className="bg-[#1a1a1a] border border-[#333] rounded-3xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-black/20 border-b border-[#333]">
                                <th className="px-6 py-5 text-xs uppercase tracking-widest text-[#BD9B5F] font-bold">User</th>
                                <th className="px-6 py-5 text-xs uppercase tracking-widest text-[#BD9B5F] font-bold">Contact</th>
                                <th className="px-6 py-5 text-xs uppercase tracking-widest text-[#BD9B5F] font-bold">Role</th>
                                <th className="px-6 py-5 text-xs uppercase tracking-widest text-[#BD9B5F] font-bold">Status</th>
                                <th className="px-6 py-5 text-xs uppercase tracking-widest text-[#BD9B5F] font-bold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#333]">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-20 text-center">
                                        <RiRefreshLine className="animate-spin text-[#BD9B5F] mx-auto mb-2" size={32} />
                                        <p className="text-gray-500 text-sm">Loading users...</p>
                                    </td>
                                </tr>
                            ) : filteredUsers.length > 0 ? filteredUsers.map((user) => (
                                <tr key={user._id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            {user.profile_picture ? (
                                                <img
                                                    src={getFullUrl(user.profile_picture)}
                                                    alt={user.user_name}
                                                    className="w-10 h-10 rounded-xl object-cover border border-[#333]"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-xl bg-[#222] flex items-center justify-center text-[#BD9B5F] font-bold border border-[#BD9B5F]/10">
                                                    {user.user_name?.charAt(0)}
                                                </div>
                                            )}
                                            <div>
                                                <p className="text-sm font-bold text-white leading-tight">{user.user_name}</p>
                                                <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">
                                                    {user.role === 'admin' ? 'Administrator' : 'General User'}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                                <RiMailLine size={14} className="text-[#BD9B5F]" />
                                                <span className="truncate max-w-[150px]">{user.user_email}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                                <RiPhoneLine size={14} className="text-[#BD9B5F]" />
                                                <span>{user.user_phone || 'No phone'}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {user.role === 'admin' ? (
                                                <RiShieldUserLine className="text-[#BD9B5F]" size={16} />
                                            ) : (
                                                <RiUserLine className="text-gray-500" size={16} />
                                            )}
                                            <span className={`text-[10px] font-bold uppercase tracking-widest ${user.role === 'admin' ? 'text-[#BD9B5F]' : 'text-gray-500'}`}>
                                                {user.role}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handleToggleStatus(user)}
                                            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all ${user.status === 'active'
                                                ? 'bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20'
                                                : 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20'
                                                }`}
                                        >
                                            {user.status}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleDelete(user._id)}
                                                className="p-2 text-gray-400 hover:text-red-500 transition-colors bg-[#1a1a1a] rounded-lg border border-[#333]"
                                            >
                                                <RiDeleteBinLine size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-20 text-center text-gray-500 italic">
                                        No users found Matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    totalItems={totalItems}
                />
            </div>
        </div>
    );
};

export default UsersList;
