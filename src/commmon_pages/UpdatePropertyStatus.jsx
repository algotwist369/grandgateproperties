import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RiPriceTagLine, RiCheckboxCircleLine, RiInformationLine } from 'react-icons/ri';
import Button from './Button';
import { updatePropertyStatus } from '../apis/property_api';

const UpdatePropertyStatus = ({ propertyId, currentStatus, onStatusUpdate }) => {
    const [status, setStatus] = useState(currentStatus || 'For Sale');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    const statusOptions = [
        'For Sale',
        'For Rent',
        'Draft',
        'Sold',
        'Rented',
        'Inactive'
    ];

    const handleUpdate = async () => {
        setLoading(true);
        setMessage({ text: '', type: '' });
        try {
            await updatePropertyStatus(propertyId, status);
            setMessage({ text: 'Status updated successfully!', type: 'success' });
            if (onStatusUpdate) onStatusUpdate(status);
        } catch (err) {
            setMessage({ text: err || 'Failed to update status', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-[#333] shadow-xl w-full max-w-md animate-fade-in text-left">
            <div className="flex items-center gap-3 mb-6">
                <RiHistoryLine size={24} className="text-[#BD9B5F]" />
                <h3 className="text-xl font-bold text-white">Update Status</h3>
            </div>

            <div className="space-y-4">
                <div className="space-y-1.5 font-sans">
                    <label className="text-xs uppercase tracking-widest text-gray-500 font-bold ml-1">Current Status</label>
                    <div className="p-3 bg-black/20 border border-[#333] rounded-xl text-white font-medium flex items-center justify-between">
                        <span>{currentStatus || 'Not Set'}</span>
                        <RiInformationLine size={16} className="text-gray-600" />
                    </div>
                </div>

                <div className="space-y-1.5 font-sans">
                    <label className="text-xs uppercase tracking-widest text-[#BD9B5F] font-bold ml-1">New Status</label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full bg-[#222] border border-[#BD9B5F]/30 rounded-xl px-4 py-3 text-white focus:border-[#BD9B5F] focus:outline-none transition-all appearance-none cursor-pointer"
                    >
                        {statusOptions.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                </div>

                {message.text && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`p-3 rounded-xl text-xs font-medium text-center ${message.type === 'success' ? 'bg-green-900/20 text-green-400 border border-green-900/50' : 'bg-red-900/20 text-red-400 border border-red-900/50'
                            }`}
                    >
                        {message.text}
                    </motion.div>
                )}

                <Button
                    fullWidth
                    onClick={handleUpdate}
                    isLoading={loading}
                    className="mt-2 shadow-lg shadow-[#BD9B5F]/10"
                >
                    Apply Changes
                </Button>
            </div>
        </div>
    );
};

export default UpdatePropertyStatus;
