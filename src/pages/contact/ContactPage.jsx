import React, { useEffect } from 'react'
import { IoLocationOutline, IoCallOutline } from 'react-icons/io5'
import { FaWhatsapp } from 'react-icons/fa'

import { contactData } from '../../data/contactData'

const ContactPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const offices = contactData;


    return (
        <div className='min-h-screen pt-24 pb-12 bg-[#0B0D10] text-gray-100'>
            {/* Header */}
            <div className='text-center mb-16 px-4'>
                <h1 className='text-3xl md:text-5xl font-bold text-gray-200 mb-6'>
                    Get in <span className='text-[#D3A188]'>Touch</span>
                </h1>
                <p className='text-gray-400 max-w-2xl mx-auto text-lg'>
                    Our team is ready to assist you. Visit one of our global offices or contact us directly.
                </p>
            </div>

            {/* Offices Grid */}
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                    {offices.map((office) => (
                        <div key={office.country} className='bg-[#111] rounded-2xl overflow-hidden border border-[#D3A188]/20 group hover:border-[#D3A188]/50 transition-all duration-300 flex flex-col hover:shadow-2xl hover:shadow-[#D3A188]/10'>
                            {/* Image */}
                            <div className='h-48 overflow-hidden relative'>
                                <div className='absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors z-10'></div>
                                <img
                                    src={office.image}
                                    alt={office.title}
                                    className='w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700'
                                />
                                <div className='absolute bottom-3 left-3 z-20 bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-semibold text-[#D3A188] border border-[#D3A188]/30'>
                                    {office.country}
                                </div>
                            </div>

                            {/* Content */}
                            <div className='p-6 flex-1 flex flex-col'>
                                <h3 className='text-xl font-bold text-white mb-4'>{office.title}</h3>

                                <div className='space-y-4 mb-8 flex-1'>
                                    <div className='flex items-start gap-3 text-gray-400'>
                                        <IoLocationOutline size={20} className='text-[#D3A188] mt-1 shrink-0' />
                                        <p className='text-sm leading-relaxed'>{office.address}</p>
                                    </div>

                                    <div className='flex items-center gap-3 text-gray-400'>
                                        <IoCallOutline size={20} className='text-[#D3A188] shrink-0' />
                                        <p className='text-sm font-medium'>{office.phone}</p>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className='grid grid-cols-2 gap-3 mt-auto pt-4 border-t border-gray-800'>
                                    <a
                                        href={`https://wa.me/${office.whatsapp}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className='flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-[#D3A188]/30 hover:border-[#D3A188] text-white hover:bg-[#D3A188]/10 transition-all group/btn'
                                    >
                                        <FaWhatsapp className='text-[#D3A188] group-hover/btn:text-[#D3A188] transition-colors' size={18} />
                                        <span className='text-sm font-medium'>WhatsApp</span>
                                    </a>

                                    <a
                                        href={`tel:${office.phoneClean}`}
                                        className='flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#D3A188] hover:bg-[#b58a73] text-black transition-colors'
                                    >
                                        <IoCallOutline size={18} />
                                        <span className='text-sm font-bold'>Call Now</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ContactPage
