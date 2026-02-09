import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RiUser6Line, RiShieldUserLine, RiToggleLine } from 'react-icons/ri';
import Input from '../../commmon_pages/Input';
import Button from '../../commmon_pages/Button';
import { updateAgentStatus } from '../../apis/agent_api';

const EditAgent = ({ agent, onSuccess, onCancel }) => {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(agent?.status || 'active');
    const [error, setError] = useState('');

    const handleStatusUpdate = async () => {
        setLoading(true);
        setError('');
        try {
            await updateAgentStatus(agent._id, status);
            if (onSuccess) onSuccess();
        } catch (err) {
            setError(err || 'Failed to update agent status');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#1a1a1a] p-8 rounded-3xl border border-[#333] shadow-2xl max-w-lg w-full animate-fade-in text-left">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-[#BD9B5F]/10 flex items-center justify-center text-[#BD9B5F]">
                    <RiUser6Line size={28} />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white">Edit Agent</h2>
                    <p className="text-gray-500 text-sm">Managing account: <span className="text-[#BD9B5F]">{agent?.user_name}</span></p>
                </div>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-900/20 border border-red-900/50 rounded-xl text-red-400 text-xs">
                    {error}
                </div>
            )}

            <div className="space-y-6">
                {/* Status Toggle Area */}
                <div className="p-6 bg-black/20 border border-[#333] rounded-2xl space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <RiToggleLine size={20} className="text-[#BD9B5F]" />
                            <span className="text-sm font-bold text-gray-300 uppercase tracking-widest">Account Status</span>
                        </div>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="bg-[#222] border border-[#BD9B5F]/30 rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-[#BD9B5F]"
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="suspended">Suspended</option>
                        </select>
                    </div>
                    <p className="text-[10px] text-gray-500 italic">Inactive or suspended agents cannot list properties or access their dashboard.</p>
                </div>

                <div className="pt-4 flex gap-4">
                    <Button variant="outline" type="button" onClick={onCancel} className="flex-1">
                        Cancel
                    </Button>
                    <Button onClick={handleStatusUpdate} isLoading={loading} className="flex-1">
                        Save Changes
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default EditAgent;
