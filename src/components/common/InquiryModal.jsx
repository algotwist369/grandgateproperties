import React, { useState, useCallback, useEffect, memo } from 'react'
import { IoClose, IoLogoWhatsapp } from 'react-icons/io5'
import Button from './Button'

const InquiryModal = memo(({ isOpen, onClose, property }) => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        message: ''
    });

    // Handle ESC key to close modal
    useEffect(() => {
        if (!isOpen) return;

        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    // All hooks must be called before any conditional returns
    const handleSubmit = useCallback((e) => {
        e.preventDefault();

        // Construct standard WhatsApp URL
        const adminNumber = "97141234567";

        const text = `*New Property Inquiry*
        
*Property:* ${property?.title || 'N/A'}
*Location:* ${property?.location || 'N/A'}
*Price:* ${property?.price || 'N/A'}

*User Details:*
Name: ${formData.name}
Phone: ${formData.phone}
Email: ${formData.email}
Message: ${formData.message}`;

        const encodedText = encodeURIComponent(text);
        const whatsappUrl = `https://wa.me/${adminNumber}?text=${encodedText}`;

        window.open(whatsappUrl, '_blank');
        onClose();
    }, [formData, property, onClose]);

    const handleInputChange = useCallback((field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    }, []);

    // Early return after all hooks
    if (!isOpen) return null;

    return (
        <div 
            className='fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in'
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
        >
            <div className='relative w-full max-w-md bg-[#111] border border-[#BD9B5F]/30 rounded-2xl shadow-2xl overflow-hidden animate-scale-in'>

                {/* Header */}
                <div className='flex items-center justify-between p-6 border-b border-gray-800 bg-[#0B0D10]'>
                    <h3 className='text-xl font-bold text-white'>
                        Inquire about <span className='text-[#BD9B5F]'>Property</span>
                    </h3>
                    <button
                        onClick={onClose}
                        className='text-gray-400 hover:text-white transition-colors'
                    >
                        <IoClose size={24} />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className='p-6 space-y-4'>
                    <div>
                        <label className='block text-xs font-medium text-[#BD9B5F] mb-1.5'>Full Name</label>
                        <input
                            type="text"
                            required
                            className='w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#BD9B5F] transition-colors text-sm'
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                        />
                    </div>

                    <div>
                        <label className='block text-xs font-medium text-[#BD9B5F] mb-1.5'>Phone Number</label>
                        <input
                            type="tel"
                            required
                            className='w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#BD9B5F] transition-colors text-sm'
                            placeholder="+971 50 000 0000"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                        />
                    </div>

                    <div>
                        <label className='block text-xs font-medium text-[#BD9B5F] mb-1.5'>Email Address</label>
                        <input
                            type="email"
                            required
                            className='w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#BD9B5F] transition-colors text-sm'
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                        />
                    </div>

                    <div>
                        <label className='block text-xs font-medium text-[#BD9B5F] mb-1.5'>Message</label>
                        <textarea
                            rows="3"
                            className='w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#BD9B5F] transition-colors text-sm resize-none'
                            placeholder="I'm interested in this property..."
                            value={formData.message}
                            onChange={(e) => handleInputChange('message', e.target.value)}
                        ></textarea>
                    </div>

                    <Button
                        type="submit"
                        fullWidth={true}
                        className='flex items-center justify-center gap-2 mt-4 font-bold'
                        primaryBg='bg-[#BD9B5F]'
                        primaryText='text-black'
                    >
                        Send Inquiry
                    </Button>

                    <p className='text-xs text-gray-500 text-center mt-2'>
                        You will be redirected to WhatsApp to send your inquiry.
                    </p>
                </form>
            </div>
        </div>
    )
});

InquiryModal.displayName = 'InquiryModal';

export default InquiryModal
