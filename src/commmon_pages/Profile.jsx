import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    RiUserLine, RiMailLine, RiPhoneLine, RiLockPasswordLine,
    RiCameraSwitchLine, RiCheckLine, RiInformationLine, RiRefreshLine,
    RiAwardLine, RiBriefcaseLine, RiFileTextLine, RiMapPinLine, RiImageAddLine
} from 'react-icons/ri';
import Input from './Input';
import Button from './Button';
import { getProfile, updateProfile, getFullUrl } from '../apis/user_api';
import { getAgentProfile, updateAgentProfile } from '../apis/agent_api';

const Profile = () => {
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [preview, setPreview] = useState(null);
    const [avatarFile, setAvatarFile] = useState(null);
    const [role, setRole] = useState('user');

    const fetchedRef = React.useRef(false);

    const [formData, setFormData] = useState({
        user_name: '',
        user_email: '',
        user_phone: '',
        password: '',
        confirmPassword: '',
        // Agent specific fields
        agent_role: '',
        agent_location: '',
        agent_bio: '',
        experience: '',
        languages: '',
        communities: '',
        specialties: '',
        agent_portfolio: ''
    });

    useEffect(() => {
        const controller = new AbortController();

        const fetchUserData = async () => {
            if (fetchedRef.current) return;

            setFetching(true);
            try {
                // Determine role first
                const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
                const userRole = userInfo.role || 'user';
                setRole(userRole);

                // Fetch basic profile
                const data = await getProfile({ signal: controller.signal });

                let agentData = {};
                if (userRole === 'agent') {
                    try {
                        const aProfile = await getAgentProfile({ signal: controller.signal });
                        if (aProfile) {
                            agentData = {
                                agent_role: aProfile.agent_role || '',
                                agent_location: aProfile.agent_location || '',
                                agent_bio: aProfile.agent_bio || '',
                                experience: aProfile.experience || '',
                                languages: aProfile.languages?.join(', ') || '',
                                communities: aProfile.communities?.join(', ') || '',
                                specialties: aProfile.specialties?.join(', ') || '',
                                agent_portfolio: aProfile.agent_portfolio?.map(p => p.url).join('\n') || ''
                            };
                        }
                    } catch (e) {
                        if (e.name !== 'CanceledError' && e.name !== 'AbortError') {
                            console.error("Failed to load agent-specific profile data", e);
                        }
                    }
                }

                if (!controller.signal.aborted) {
                    setFormData({
                        user_name: data.user_name || '',
                        user_email: data.user_email || '',
                        user_phone: data.user_phone || '',
                        password: '',
                        confirmPassword: '',
                        agent_role: agentData.agent_role || '',
                        agent_location: agentData.agent_location || '',
                        agent_bio: agentData.agent_bio || '',
                        experience: agentData.experience || '',
                        languages: agentData.languages || '',
                        communities: agentData.communities || '',
                        specialties: agentData.specialties || '',
                        agent_portfolio: agentData.agent_portfolio || ''
                    });
                    setPreview(data.profile_picture || null);
                    fetchedRef.current = true;
                }
            } catch (err) {
                const isCancel = err.name === 'CanceledError' ||
                    err.name === 'AbortError' ||
                    err === 'canceled' ||
                    err === 'Request aborted';

                if (!isCancel && !controller.signal.aborted) {
                    setError('Failed to load profile intelligence.');
                    console.error(err);
                }
            } finally {
                if (!controller.signal.aborted) {
                    setFetching(false);
                }
            }
        };

        fetchUserData();

        return () => {
            controller.abort();
        };
    }, []);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setAvatarFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        if (formData.password && formData.password !== formData.confirmPassword) {
            setError('Account security: Passwords do not match.');
            setLoading(false);
            return;
        }

        try {
            const data = new FormData();

            if (role === 'agent') {
                // Use updateAgentProfile for comprehensive update
                data.append('agent_name', formData.user_name);
                data.append('agent_email', formData.user_email);
                data.append('agent_phone', formData.user_phone);
                data.append('agent_role', formData.agent_role);
                data.append('agent_location', formData.agent_location);
                data.append('agent_bio', formData.agent_bio);
                data.append('experience', formData.experience);

                if (formData.password) data.append('password', formData.password);
                if (avatarFile) data.append('avatar_url', avatarFile);

                const languagesArray = (formData.languages || '').split(',').map(s => s.trim()).filter(Boolean);
                const communitiesArray = (formData.communities || '').split(',').map(s => s.trim()).filter(Boolean);
                const specialtiesArray = (formData.specialties || '').split(',').map(s => s.trim()).filter(Boolean);
                const portfolioArray = (formData.agent_portfolio || '').split('\n').map(s => s.trim()).filter(Boolean).map(url => ({ url, type: 'image' }));

                data.append('languages', JSON.stringify(languagesArray));
                data.append('communities', JSON.stringify(communitiesArray));
                data.append('specialties', JSON.stringify(specialtiesArray));
                data.append('agent_portfolio', JSON.stringify(portfolioArray));

                const result = await updateAgentProfile(data);
                setPreview(result.avatar_url);
                // Note: result from agentProfile update is the Agent object. 
                // We need to fetch/update the userInfo in localStorage with the synced User data
                const updatedUser = await getProfile();
                localStorage.setItem('userInfo', JSON.stringify(updatedUser));
            } else {
                // Standard user update
                data.append('user_name', formData.user_name);
                data.append('user_email', formData.user_email);
                data.append('user_phone', formData.user_phone);

                if (formData.password) data.append('password', formData.password);
                if (avatarFile) data.append('profile_picture', avatarFile);

                const updatedUser = await updateProfile(data);
                setPreview(updatedUser.profile_picture);
                localStorage.setItem('userInfo', JSON.stringify(updatedUser));
            }

            setSuccess(true);
            setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
            window.dispatchEvent(new Event('userInfoUpdated'));
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to update profile protocol.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return (
        <div className="h-96 flex flex-col items-center justify-center space-y-4">
            <RiRefreshLine size={48} className="text-[#BD9B5F] animate-spin" />
            <p className="text-gray-500 font-medium tracking-widest uppercase text-xs">Authenticating Intel...</p>
        </div>
    );

    const isAgent = role === 'agent';

    return (
        <div className="p-6 md:p-8 max-w-5xl mx-auto animate-fade-in text-left pb-20">
            <div className="mb-10 text-left">
                <h1 className="text-3xl font-bold text-white mb-2">My <span className="text-[#BD9B5F]">Profile</span></h1>
                <p className="text-gray-400 font-medium tracking-wide">Manage your {isAgent ? 'professional identity' : 'identity'} and security settings.</p>
            </div>

            <AnimatePresence>
                {success && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-8 p-4 bg-green-500/10 border border-green-500/20 rounded-2xl text-green-400 text-sm flex items-center gap-3"
                    >
                        <RiCheckLine size={24} className="flex-shrink-0" />
                        <div>
                            <p className="font-bold uppercase tracking-widest text-xs">Protocol Successful!</p>
                            <p className="text-[10px] opacity-80 font-medium">Your profile information has been synchronized across the platform.</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {error && (
                <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm flex items-center gap-3 shadow-xl shadow-red-500/5">
                    <RiInformationLine size={24} className="flex-shrink-0" />
                    <span className="font-medium">{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left: Avatar Section */}
                <aside className="lg:col-span-1 space-y-8">
                    <div className="bg-[#1a1a1a] p-10 rounded-[2.5rem] border border-[#333] flex flex-col items-center text-center space-y-6 relative overflow-hidden group shadow-2xl">
                        <div className="absolute inset-0 bg-gradient-to-b from-[#BD9B5F]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="relative">
                            <div className="w-44 h-44 rounded-[2.5rem] bg-[#222] border-2 border-[#333] p-1 group-hover:border-[#BD9B5F]/40 transition-all duration-500 overflow-hidden shadow-inner">
                                {preview ? (
                                    <img src={getFullUrl(preview)} alt="Avatar" className="w-full h-full object-cover rounded-[2.2rem]" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                                        <RiUserLine size={64} />
                                    </div>
                                )}
                            </div>
                            <label
                                htmlFor="avatar-upload"
                                className="absolute -bottom-2 -right-2 w-14 h-14 bg-[#BD9B5F] rounded-2xl flex items-center justify-center text-black shadow-2xl shadow-[#BD9B5F]/40 cursor-pointer hover:scale-110 active:scale-95 transition-all z-10 hover:bg-[#a68650]"
                            >
                                <RiCameraSwitchLine size={28} />
                                <input
                                    type="file"
                                    id="avatar-upload"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </label>
                        </div>

                        <div className="space-y-2 relative z-10">
                            <h3 className="text-xl font-bold text-white tracking-wide uppercase">{formData.user_name || 'Anonymous User'}</h3>
                            <p className="text-[10px] text-[#BD9B5F] font-black uppercase tracking-[0.2em] px-3 py-1 bg-[#BD9B5F]/10 rounded-full border border-[#BD9B5F]/20">
                                {isAgent ? formData.agent_role || 'Agent Expert' : role.toUpperCase()}
                            </p>
                        </div>
                    </div>

                    <div className="bg-[#1a1a1a] p-8 rounded-[2rem] border border-[#333] space-y-5 shadow-xl">
                        <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#BD9B5F]" />
                            System Verification
                        </h4>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500 font-medium">Account Type</span>
                                <span className="text-xs text-white font-bold">{isAgent ? 'Professional Agent' : 'Standard User'}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500 font-medium">Clearance</span>
                                <span className="px-3 py-1 rounded-lg bg-green-500/10 text-green-400 border border-green-500/20 text-[10px] uppercase font-black tracking-widest">Verified</span>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Right: Info Section */}
                <main className="lg:col-span-2 space-y-10">
                    {/* Basic Intel */}
                    <div className="bg-[#1a1a1a] p-8 md:p-10 rounded-[2.5rem] border border-[#333] shadow-2xl space-y-8">
                        <div className="flex items-center gap-3 mb-2">
                            <RiInformationLine size={24} className="text-[#BD9B5F]" />
                            <h2 className="text-xl font-bold text-white uppercase tracking-widest">Account Identity</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <Input
                                label="Display Name"
                                name="user_name"
                                value={formData.user_name}
                                onChange={handleChange}
                                placeholder="Formal name"
                                icon={<RiUserLine />}
                                required
                            />
                            <Input
                                label="Contact Phone"
                                name="user_phone"
                                value={formData.user_phone}
                                onChange={handleChange}
                                placeholder="+971..."
                                icon={<RiPhoneLine />}
                                required
                            />
                        </div>
                        <Input
                            label="Email Communication"
                            name="user_email"
                            type="email"
                            value={formData.user_email}
                            onChange={handleChange}
                            placeholder="verified@example.com"
                            icon={<RiMailLine />}
                            required
                        />
                    </div>

                    {/* Agent Professional Intel */}
                    {isAgent && (
                        <div className="bg-[#1a1a1a] p-8 md:p-10 rounded-[2.5rem] border border-[#333] shadow-2xl space-y-10">
                            <div className="flex items-center gap-3 mb-2">
                                <RiAwardLine size={24} className="text-[#BD9B5F]" />
                                <h2 className="text-xl font-bold text-white uppercase tracking-widest">Professional Credentials</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <Input
                                    label="Professional Title"
                                    name="agent_role"
                                    value={formData.agent_role}
                                    onChange={handleChange}
                                    placeholder="e.g. Senior Property Consultant"
                                    icon={<RiBriefcaseLine />}
                                />
                                <Input
                                    label="Primary Office Location"
                                    name="agent_location"
                                    value={formData.agent_location}
                                    onChange={handleChange}
                                    placeholder="e.g. Dubai Marina Office"
                                    icon={<RiMapPinLine />}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <Input
                                    label="Experience Narrative"
                                    name="experience"
                                    value={formData.experience}
                                    onChange={handleChange}
                                    placeholder="e.g. 10 Years in Dubai"
                                    icon={<RiAwardLine />}
                                />
                                <Input
                                    label="Expertise / Specialties"
                                    name="specialties"
                                    value={formData.specialties}
                                    onChange={handleChange}
                                    placeholder="Luxury, Off-Plan (comma separated)"
                                    icon={<RiCheckLine />}
                                />
                            </div>


                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <Input
                                    label="Linguistic Proficiencies"
                                    name="languages"
                                    value={formData.languages}
                                    onChange={handleChange}
                                    placeholder="English, Arabic (comma separated)"
                                    icon={<RiUserLine />}
                                />
                                <Input
                                    label="Primary Service Communities"
                                    name="communities"
                                    value={formData.communities}
                                    onChange={handleChange}
                                    placeholder="Dubai Marina, Palm Jumeirah (comma separated)"
                                    icon={<RiMapPinLine />}
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <RiImageAddLine className="text-[#BD9B5F]" />
                                    Property Portfolio Links (One URL per line) - Optional
                                </label>
                                <textarea
                                    name="agent_portfolio"
                                    value={formData.agent_portfolio}
                                    onChange={handleChange}
                                    rows={3}
                                    placeholder="Links to showcase property videos or reels..."
                                    className="w-full bg-black/40 border border-[#333] rounded-2xl px-6 py-4 text-white outline-none focus:border-[#BD9B5F] transition-all resize-none text-sm leading-relaxed"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <RiFileTextLine className="text-[#BD9B5F]" />
                                    Expert Biography
                                </label>
                                <textarea
                                    name="agent_bio"
                                    value={formData.agent_bio}
                                    onChange={handleChange}
                                    rows={5}
                                    placeholder="Share your success story and market expertise..."
                                    className="w-full bg-black/40 border border-[#333] rounded-2xl px-6 py-4 text-white outline-none focus:border-[#BD9B5F] transition-all resize-none text-sm leading-relaxed"
                                />
                            </div>
                        </div>
                    )}

                    {/* Security Intel */}
                    <div className="bg-[#1a1a1a] p-8 md:p-10 rounded-[2.5rem] border border-[#333] shadow-2xl space-y-8">
                        <div className="flex items-center gap-3 mb-2">
                            <RiLockPasswordLine size={24} className="text-[#BD9B5F]" />
                            <h2 className="text-xl font-bold text-white uppercase tracking-widest">Security Protocols</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <Input
                                label="New Access Key"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Unchanged if empty"
                                icon={<RiLockPasswordLine />}
                                autoComplete="new-password"
                            />
                            <Input
                                label="Verify Key"
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Re-enter for safety"
                                icon={<RiLockPasswordLine />}
                                autoComplete="new-password"
                            />
                        </div>
                    </div>

                    <div className="pt-6 flex justify-end gap-5">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => window.history.back()}
                            className="px-12 rounded-2xl"
                        >
                            Discard
                        </Button>
                        <Button
                            type="submit"
                            isLoading={loading}
                            className="px-16 rounded-2xl shadow-[0_15px_40px_rgba(189,155,95,0.25)]"
                        >
                            Commit Protocols
                        </Button>
                    </div>
                </main>
            </form>
        </div>
    );
};

export default Profile;
