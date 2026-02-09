import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    RiUser6Line, RiArrowLeftLine, RiShieldUserLine, RiToggleLine,
    RiUserLine, RiPhoneLine, RiMailLine, RiMapPinLine, RiBriefcaseLine,
    RiFileTextLine, RiAwardLine, RiImageAddLine, RiLockLine, RiRefreshLine
} from 'react-icons/ri';
import Button from '../../commmon_pages/Button';
import Input from '../../commmon_pages/Input';
import { updateAgent, getAgentBySlug, updateAgentStatus } from '../../apis/agent_api';
import { getFullUrl } from '../../apis/user_api';

const EditAgentPage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    // Role check for restricting updates
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const isAdmin = userInfo.role === 'admin';

    // Initial state from navigation if available
    const initialAgent = location.state?.agent;

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(!initialAgent);
    const [error, setError] = useState('');
    const [previewImage, setPreviewImage] = useState(initialAgent?.avatar_url ? getFullUrl(initialAgent.avatar_url) : '');
    const [agentName, setAgentName] = useState(initialAgent?.agent_name || '');
    const [userId, setUserId] = useState(initialAgent?.user_id || initialAgent?._id || '');

    const [formData, setFormData] = useState({
        agent_name: initialAgent?.agent_name || '',
        agent_role: initialAgent?.agent_role || '',
        agent_email: initialAgent?.agent_email || '',
        agent_phone: initialAgent?.agent_phone || '',
        agent_location: initialAgent?.agent_location || '',
        agent_bio: initialAgent?.agent_bio || '',
        experience: initialAgent?.experience || '',
        status: initialAgent?.status || 'active',
        languages: initialAgent?.languages?.join(', ') || '',
        communities: initialAgent?.communities?.join(', ') || '',
        specialties: initialAgent?.specialties?.join(', ') || '',
        agent_portfolio: initialAgent?.agent_portfolio?.map(p => p.url).join('\n') || '',
        agent_password: initialAgent?.agent_password || '',
        avatar_url: null
    });
    const fetchedRef = React.useRef('');

    useEffect(() => {
        const fetchDetails = async () => {
            if (!slug || fetchedRef.current === slug) return;
            fetchedRef.current = slug;

            setFetching(true);
            try {
                const data = await getAgentBySlug(slug);
                if (data) {
                    setFormData({
                        agent_name: data.agent_name || '',
                        agent_role: data.agent_role || '',
                        agent_email: data.agent_email || '',
                        agent_phone: data.agent_phone || '',
                        agent_location: data.agent_location || '',
                        agent_bio: data.agent_bio || '',
                        experience: data.experience || '',
                        status: data.status || 'active',
                        languages: Array.isArray(data.languages) ? data.languages.join(', ') : '',
                        communities: Array.isArray(data.communities) ? data.communities.join(', ') : '',
                        specialties: Array.isArray(data.specialties) ? data.specialties.join(', ') : '',
                        agent_portfolio: Array.isArray(data.agent_portfolio) ? data.agent_portfolio.map(p => p.url).join('\n') : '',
                        agent_password: data.agent_password || '',
                        avatar_url: null
                    });
                    setAgentName(data.agent_name || '');
                    setUserId(data.user_id || data._id);
                    if (data.avatar_url) setPreviewImage(getFullUrl(data.avatar_url));
                }
            } catch (err) {
                setError('Failed to load agent intelligence by slug.');
            } finally {
                setFetching(false);
            }
        };

        fetchDetails();
    }, [slug]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'avatar_url' && files[0]) {
            setFormData(prev => ({ ...prev, avatar_url: files[0] }));
            setPreviewImage(URL.createObjectURL(files[0]));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isAdmin) {
                // Admin can ONLY change status
                await updateAgentStatus(userId, formData.status);
                navigate('/admin/agents');
                return;
            }

            const data = new FormData();
            // ... rest of the original logic for non-admins (though this page is currently admin-only)
            const basicFields = ['agent_name', 'agent_role', 'agent_email', 'agent_phone', 'agent_location', 'agent_bio', 'experience', 'status', 'agent_password'];
            basicFields.forEach(key => {
                if (formData[key] !== undefined && formData[key] !== null) {
                    data.append(key, formData[key]);
                }
            });

            if (formData.avatar_url) {
                data.append('avatar_url', formData.avatar_url);
            }

            const languagesArray = (formData.languages || '').split(',').map(s => s.trim()).filter(Boolean);
            const communitiesArray = (formData.communities || '').split(',').map(s => s.trim()).filter(Boolean);
            const specialtiesArray = (formData.specialties || '').split(',').map(s => s.trim()).filter(Boolean);
            const portfolioArray = (formData.agent_portfolio || '').split('\n').map(s => s.trim()).filter(Boolean).map(url => ({ url, type: 'image' }));

            data.append('languages', JSON.stringify(languagesArray));
            data.append('communities', JSON.stringify(communitiesArray));
            data.append('specialties', JSON.stringify(specialtiesArray));
            data.append('agent_portfolio', JSON.stringify(portfolioArray));

            await updateAgent(userId, data);
            navigate('/admin/agents');
        } catch (err) {
            const serverMsg = err.response?.data?.message || err.message || 'Failed to update agent';
            setError(serverMsg);
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="p-6 md:p-8 flex items-center justify-center min-h-[60vh]">
                <div className="text-center space-y-4">
                    <RiRefreshLine className="animate-spin text-[#BD9B5F] mx-auto" size={48} />
                    <p className="text-gray-400 font-medium">Synchronizing Agent Intelligence by Slug...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-8 max-w-4xl mx-auto animate-fade-in text-left pb-20">
            <div className="mb-10 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Refine <span className="text-[#BD9B5F]">Agent Profile</span></h1>
                    <p className="text-gray-400 font-medium">Updating professional identity for <span className="text-[#BD9B5F] font-bold">"{agentName || 'Agent'}"</span></p>
                </div>
                <button
                    onClick={() => navigate('/admin/agents')}
                    className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] border border-[#333] text-gray-400 hover:text-white rounded-xl transition-all"
                >
                    <RiArrowLeftLine />
                    <span>Back to List</span>
                </button>
            </div>

            {error && (
                <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm flex items-center gap-3">
                    <RiShieldUserLine size={24} className="flex-shrink-0" />
                    <span className="font-medium">{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Profile Photo Section */}
                <div className="bg-[#1a1a1a] p-8 rounded-3xl border border-[#333] shadow-2xl flex flex-col md:flex-row items-center gap-10">
                    <div className="relative group">
                        <div className="w-40 h-40 rounded-[2.5rem] bg-black/40 border-2 border-[#333] flex items-center justify-center overflow-hidden transition-all group-hover:border-[#BD9B5F]/50">
                            {previewImage ? (
                                <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <RiUser6Line size={64} className="text-[#333]" />
                            )}
                        </div>
                        <label className="absolute bottom-2 -right-2 p-3 bg-[#BD9B5F] text-black rounded-2xl cursor-pointer hover:scale-110 transition-all shadow-xl shadow-[#BD9B5F]/20">
                            <RiImageAddLine size={20} />
                            <input type="file" name="avatar_url" onChange={handleChange} className="hidden" accept="image/*" disabled={isAdmin} />
                        </label>
                    </div>
                    <div className="flex-1 space-y-2 text-center md:text-left">
                        <h3 className="text-xl font-bold text-white tracking-wide uppercase">Profile Imagery</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">Customize the representative visual for this agent. Professional portraits are recommended for high luxury trust scores.</p>
                    </div>
                </div>

                {/* Information Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Basic Info */}
                    <div className="bg-[#1a1a1a] p-8 rounded-3xl border border-[#333] shadow-2xl space-y-6">
                        <div className="flex items-center gap-3 text-[#BD9B5F] mb-2">
                            <RiUserLine size={22} />
                            <h3 className="text-lg font-bold uppercase tracking-widest">Core Credentials</h3>
                        </div>
                        <Input
                            label="Display Name"
                            name="agent_name"
                            value={formData.agent_name}
                            onChange={handleChange}
                            icon={<RiUserLine />}
                            disabled={isAdmin}
                        />
                        <Input
                            label="Professional Role"
                            name="agent_role"
                            value={formData.agent_role}
                            onChange={handleChange}
                            placeholder="e.g. Luxury Secondary Specialist"
                            icon={<RiBriefcaseLine />}
                            disabled={isAdmin}
                        />
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                <RiToggleLine className="text-[#BD9B5F]" />
                                Service Status
                            </label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full bg-black/40 border border-[#333] rounded-2xl px-6 py-4 text-white outline-none focus:border-[#BD9B5F] transition-all appearance-none cursor-pointer"
                            >
                                <option value="active">Active (On Duty)</option>
                                <option value="inactive">Inactive (Off Duty)</option>
                                <option value="suspended">Suspended (Blocked)</option>
                            </select>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="bg-[#1a1a1a] p-8 rounded-3xl border border-[#333] shadow-2xl space-y-6">
                        <div className="flex items-center gap-3 text-[#BD9B5F] mb-2">
                            <RiPhoneLine size={22} />
                            <h3 className="text-lg font-bold uppercase tracking-widest">Connectability</h3>
                        </div>
                        <Input
                            label="Email (Synced with Account)"
                            name="agent_email"
                            value={formData.agent_email}
                            onChange={handleChange}
                            icon={<RiMailLine />}
                            disabled={isAdmin}
                        />
                        <Input
                            label="Phone (Synced with Account)"
                            name="agent_phone"
                            value={formData.agent_phone}
                            onChange={handleChange}
                            icon={<RiPhoneLine />}
                            disabled={isAdmin}
                        />
                        <Input
                            label="Primary Location"
                            name="agent_location"
                            value={formData.agent_location}
                            onChange={handleChange}
                            placeholder="e.g. Dubai Marina Office"
                            icon={<RiMapPinLine />}
                            disabled={isAdmin}
                        />
                    </div>
                </div>

                {/* Professional Expertise Section */}
                <div className="bg-[#1a1a1a] p-8 rounded-3xl border border-[#333] shadow-2xl space-y-8">
                    <div className="flex items-center gap-3 text-[#BD9B5F] mb-4">
                        <RiAwardLine size={24} />
                        <h3 className="text-xl font-bold uppercase tracking-widest">Professional Expertise</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Input
                            label="Languages (Comma separated)"
                            name="languages"
                            value={formData.languages}
                            onChange={handleChange}
                            placeholder="e.g. English, Arabic, French"
                            icon={<RiUserLine />}
                            disabled={isAdmin}
                        />
                        <Input
                            label="Specialties (Comma separated)"
                            name="specialties"
                            value={formData.specialties}
                            onChange={handleChange}
                            placeholder="e.g. Off-Plan, Luxury, Rentals"
                            icon={<RiBriefcaseLine />}
                            disabled={isAdmin}
                        />
                    </div>

                    <Input
                        label="Active Communities (Comma separated)"
                        name="communities"
                        value={formData.communities}
                        onChange={handleChange}
                        placeholder="e.g. Dubai Marina, Downtown, Palm Jumeirah"
                        icon={<RiMapPinLine />}
                        disabled={isAdmin}
                    />
                </div>

                {/* Professional Content */}
                <div className="bg-[#1a1a1a] p-8 rounded-3xl border border-[#333] shadow-2xl space-y-6">
                    <div className="flex items-center gap-3 text-[#BD9B5F] mb-2">
                        <RiFileTextLine size={22} />
                        <h3 className="text-lg font-bold uppercase tracking-widest">Narrative & Portfolio</h3>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <Input
                            label="Years of Experience"
                            name="experience"
                            value={formData.experience}
                            onChange={handleChange}
                            placeholder="e.g. 5 Years in Dubai Real Estate"
                            icon={<RiAwardLine />}
                            disabled={isAdmin}
                        />
                        <Input
                            label="Current Credentials (Plain Text)"
                            name="agent_password"
                            value={formData.agent_password}
                            onChange={handleChange}
                            placeholder="Assigned password for reference"
                            icon={<RiLockLine />}
                            disabled={isAdmin}
                        />
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                <RiImageAddLine className="text-[#BD9B5F]" />
                                Professional Portfolio Links (One URL per line)
                            </label>
                            <textarea
                                name="agent_portfolio"
                                value={formData.agent_portfolio}
                                onChange={handleChange}
                                rows={4}
                                placeholder="Paste URLs to property videos or professional imagery..."
                                className="w-full bg-black/40 border border-[#333] rounded-2xl px-6 py-4 text-white outline-none focus:border-[#BD9B5F] transition-all resize-none leading-relaxed disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isAdmin}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                <RiFileTextLine className="text-[#BD9B5F]" />
                                Expert Narrative / Bio
                            </label>
                            <textarea
                                name="agent_bio"
                                value={formData.agent_bio}
                                onChange={handleChange}
                                rows={5}
                                placeholder="Write a professional biography for the agent..."
                                className="w-full bg-black/40 border border-[#333] rounded-2xl px-6 py-4 text-white outline-none focus:border-[#BD9B5F] transition-all resize-none leading-relaxed disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isAdmin}
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-8 flex justify-end gap-4">
                    <Button
                        variant="outline"
                        type="button"
                        onClick={() => navigate('/admin/agents')}
                        className="px-10"
                    >
                        Discard Changes
                    </Button>
                    <Button
                        type="submit"
                        isLoading={loading}
                        className="px-12 shadow-[0_10px_30px_rgba(189,155,95,0.2)]"
                    >
                        Commit Updates
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default EditAgentPage;
