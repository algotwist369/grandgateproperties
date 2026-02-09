import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RiShieldUserLine, RiArrowLeftLine, RiUserLine, RiPhoneLine, RiMailLine, RiLockLine } from 'react-icons/ri';
import Input from '../../commmon_pages/Input';
import Button from '../../commmon_pages/Button';
import { addAgent } from '../../apis/agent_api';

const AddAgentPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        user_name: '',
        user_email: '',
        user_phone: '',
        password: '',
        agent_role: 'Agent'
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await addAgent(formData);
            navigate('/admin/agents');
        } catch (err) {
            const serverMsg = err.response?.data?.message || err.message || 'Failed to add agent';
            setError(serverMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 md:p-8 max-w-2xl mx-auto animate-fade-in text-left">
            <div className="mb-10 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Add New <span className="text-[#BD9B5F]">Agent</span></h1>
                    <p className="text-gray-400 font-medium">Create a new professional agent account for the platform.</p>
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

            <form onSubmit={handleSubmit} className="bg-[#1a1a1a] p-8 rounded-3xl border border-[#333] shadow-2xl space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                        label="Full Name"
                        name="user_name"
                        value={formData.user_name}
                        onChange={handleChange}
                        placeholder="e.g. John Doe"
                        icon={<RiUserLine />}
                        required
                    />
                    <Input
                        label="Phone Number"
                        name="user_phone"
                        value={formData.user_phone}
                        onChange={handleChange}
                        placeholder="+971..."
                        icon={<RiPhoneLine />}
                        required
                    />
                </div>

                <Input
                    label="Email Address"
                    type="email"
                    name="user_email"
                    value={formData.user_email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    icon={<RiMailLine />}
                    required
                />

                <Input
                    label="Initial Password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    icon={<RiLockLine />}
                    required
                />

                <div className="pt-6 flex justify-end gap-4 border-t border-[#333]">
                    <Button
                        variant="outline"
                        type="button"
                        onClick={() => navigate('/admin/agents')}
                        className="px-10"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        isLoading={loading}
                        className="px-12 shadow-[0_10px_30px_rgba(189,155,95,0.2)]"
                    >
                        Create Agent Account
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default AddAgentPage;
