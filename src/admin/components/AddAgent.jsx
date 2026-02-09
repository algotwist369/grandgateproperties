import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RiUser6Line, RiMailLine, RiPhoneLine, RiLockLine, RiShieldUserLine } from 'react-icons/ri';
import Input from '../../commmon_pages/Input';
import Button from '../../commmon_pages/Button';
import { signupUser } from '../../apis/user_api';

const AddAgent = ({ onSuccess, onCancel }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        user_name: '',
        user_email: '',
        user_phone: '',
        password: '',
        role: 'agent'
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const signupData = new FormData();
            Object.keys(formData).forEach(key => signupData.append(key, formData[key]));

            await signupUser(signupData);
            if (onSuccess) onSuccess();
        } catch (err) {
            setError(err || 'Failed to add agent');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#1a1a1a] p-8 rounded-3xl border border-[#333] shadow-2xl max-w-lg w-full animate-fade-in text-left">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-[#BD9B5F]/10 flex items-center justify-center text-[#BD9B5F]">
                    <RiShieldUserLine size={28} />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white">Add New Agent</h2>
                    <p className="text-gray-500 text-sm">Create a new professional agent account.</p>
                </div>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-900/20 border border-red-900/50 rounded-xl text-red-400 text-xs">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                    label="Full Name"
                    name="user_name"
                    value={formData.user_name}
                    onChange={handleChange}
                    placeholder="e.g. John Doe"
                    required
                />
                <Input
                    label="Email Address"
                    type="email"
                    name="user_email"
                    value={formData.user_email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    required
                />
                <Input
                    label="Phone Number"
                    name="user_phone"
                    value={formData.user_phone}
                    onChange={handleChange}
                    placeholder="+971..."
                    required
                />
                <Input
                    label="Initial Password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                />

                <div className="pt-4 flex gap-4">
                    <Button variant="outline" type="button" onClick={onCancel} className="flex-1">
                        Cancel
                    </Button>
                    <Button type="submit" isLoading={loading} className="flex-1">
                        Create Agent
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default AddAgent;
