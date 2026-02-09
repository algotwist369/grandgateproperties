import { useNavigate, Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import {
    RiSearchLine,
    RiMailLine, RiPhoneLine, RiDeleteBinLine,
    RiEditLine, RiRefreshLine, RiUserAddLine,
    RiLockLine
} from 'react-icons/ri';
import { getAllAgents } from '../../apis/agent_api';
import { deleteUser, getFullUrl } from '../../apis/user_api';
import Pagination from '../../commmon_pages/Pagination';

const AgentsList = () => {
    const navigate = useNavigate();
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const fetchedRef = useRef(false);

    const fetchAgents = async (page = 1) => {
        setLoading(true);
        setError('');
        try {
            const data = await getAllAgents(page, 10);
            setAgents(data.agents || []);
            setTotalPages(data.pages || 1);
            setTotalItems(data.total || 0);
            setCurrentPage(data.page || 1);
        } catch (err) {
            setError('Failed to load agents');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const lastFetchedPage = useRef(0);

    useEffect(() => {
        if (lastFetchedPage.current === currentPage) return;
        lastFetchedPage.current = currentPage;
        fetchAgents(currentPage);
    }, [currentPage]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this agent?')) {
            try {
                await deleteUser(id);
                // Filter out the deleted agent from local state for immediate feedback
                setAgents(prev => prev.filter(a => a._id !== id && a.user_id !== id));
                // Also re-fetch to ensure pagination and total count are updated
                fetchAgents(currentPage);
            } catch (err) {
                alert('Failed to delete agent');
            }
        }
    };

    const handleEdit = (agent) => {
        navigate(`/admin/agents/edit/${agent.slug}`, { state: { agent } });
    };

    const filteredAgents = agents.filter(agent =>
        agent.agent_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.agent_email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-fade-in text-left">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Agent <span className="text-[#BD9B5F]">Management</span></h1>
                    <p className="text-gray-400">Manage, verify, and monitor all registered agents.</p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <div className="relative flex-1 md:flex-none">
                        <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search agents..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-[#1a1a1a] border border-[#333] rounded-2xl pl-12 pr-6 py-3 text-white focus:border-[#BD9B5F] outline-none transition-all w-full md:w-64"
                        />
                    </div>
                    <Link
                        to="/admin/agents/add"
                        className="flex items-center gap-2 px-6 py-3 bg-[#BD9B5F] text-black font-bold rounded-2xl hover:bg-[#a68650] transition-all shadow-lg shadow-[#BD9B5F]/10"
                    >
                        <RiUserAddLine />
                        <span>Add Agent</span>
                    </Link>
                    <button
                        onClick={fetchAgents}
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
                                <th className="px-6 py-5 text-xs uppercase tracking-widest text-[#BD9B5F] font-bold">Agent Info</th>
                                <th className="px-6 py-5 text-xs uppercase tracking-widest text-[#BD9B5F] font-bold">Contact</th>
                                <th className="px-6 py-5 text-xs uppercase tracking-widest text-[#BD9B5F] font-bold">Credentials</th>
                                <th className="px-6 py-5 text-xs uppercase tracking-widest text-[#BD9B5F] font-bold">Role</th>
                                <th className="px-6 py-5 text-xs uppercase tracking-widest text-[#BD9B5F] font-bold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#333]">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-20 text-center">
                                        <RiRefreshLine className="animate-spin text-[#BD9B5F] mx-auto mb-2" size={32} />
                                        <p className="text-gray-500 text-sm">Loading agents...</p>
                                    </td>
                                </tr>
                            ) : filteredAgents.length > 0 ? filteredAgents.map((agent) => (
                                <tr key={agent._id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            {agent.avatar_url ? (
                                                <img
                                                    src={getFullUrl(agent.avatar_url)}
                                                    alt={agent.agent_name}
                                                    className="w-10 h-10 rounded-xl object-cover border border-[#333]"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#BD9B5F]/20 to-[#BD9B5F]/5 flex items-center justify-center text-[#BD9B5F] font-bold border border-[#BD9B5F]/20">
                                                    {agent.agent_name?.charAt(0)}
                                                </div>
                                            )}
                                            <div>
                                                <p className="text-sm font-bold text-white leading-tight">{agent.agent_name}</p>
                                                <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">@{agent.slug}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                                <RiMailLine size={14} className="text-[#BD9B5F]" />
                                                <span className="truncate max-w-[150px]">{agent.agent_email}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                                <RiPhoneLine size={14} className="text-[#BD9B5F]" />
                                                <span>{agent.agent_phone}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-xs text-gray-400 font-mono bg-black/30 px-3 py-1.5 rounded-lg border border-[#333] w-fit">
                                            <RiLockLine size={14} className="text-[#BD9B5F]" />
                                            <span>{agent.agent_password || '••••••••'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 bg-[#BD9B5F]/10 text-[#BD9B5F] text-[10px] font-bold uppercase tracking-widest rounded-full border border-[#BD9B5F]/20">
                                            {agent.agent_role || 'Agent'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleEdit(agent)}
                                                className="p-2 text-gray-400 hover:text-[#BD9B5F] transition-colors bg-[#1a1a1a] rounded-lg border border-[#333]"
                                            >
                                                <RiEditLine size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(agent.user_id || agent._id)}
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
                                        No agents found matching your search.
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

export default AgentsList;
