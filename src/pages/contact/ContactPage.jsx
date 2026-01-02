import React, { useEffect } from 'react';
import { IoLocationOutline, IoCallOutline } from 'react-icons/io5';
import { FaWhatsapp } from 'react-icons/fa';
import { motion } from "framer-motion";
import { contactData } from '../../data/contactData';

const ContactPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const offices = contactData;

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    return (
        <div className="min-h-screen pt-32 pb-24 bg-black text-gray-100 selection:bg-[#D3A188] selection:text-black">
            {/* Header */}
            <motion.div
                className="max-w-7xl mx-auto px-6 lg:px-8 text-center mb-24"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <div className="flex items-center justify-center gap-4 mb-6">
                    <div className="w-12 h-px bg-[#D3A188]"></div>
                    <span className="text-xs uppercase tracking-[0.5em] text-[#D3A188] font-medium">Global presence</span>
                    <div className="w-12 h-px bg-[#D3A188]"></div>
                </div>
                <h1 className="text-5xl md:text-8xl font-light text-white uppercase tracking-tighter mb-8 leading-none">
                    Get in <span className="text-[#D3A188] font-medium italic">Touch</span>
                </h1>
                <p className="text-gray-400 max-w-2xl mx-auto text-lg font-light leading-relaxed">
                    Our team of strategic advisors is ready to assist you. Visit one of our flagship offices or connect with us directly to begin your journey.
                </p>
            </motion.div>

            {/* Offices Grid */}
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                >
                    {offices.map((office) => (
                        <motion.div
                            key={office.country}
                            variants={itemVariants}
                            className="group relative bg-white/5 rounded-[2.5rem] overflow-hidden border border-white/10 hover:border-[#D3A188]/30 transition-all duration-500 flex flex-col hover:shadow-2xl hover:shadow-[#D3A188]/5"
                        >
                            {/* Image Section */}
                            <div className="h-64 overflow-hidden relative">
                                <img
                                    src={office.image}
                                    alt={office.title}
                                    className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-500"></div>
                                <div className="absolute top-6 right-6">
                                    <div className="bg-black/60 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/10">
                                        <span className="text-[10px] uppercase tracking-[0.3em] font-medium text-white">{office.country}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-10 flex-1 flex flex-col">
                                <h3 className="text-2xl font-light text-white uppercase tracking-widest mb-6 border-b border-white/10 pb-6">{office.title}</h3>

                                <div className="space-y-6 mb-10 flex-1">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-2xl bg-[#D3A188]/10 flex items-center justify-center shrink-0 border border-[#D3A188]/20 group-hover:bg-[#D3A188] group-hover:border-[#D3A188] transition-all duration-500">
                                            <IoLocationOutline size={20} className="text-[#D3A188] group-hover:text-black transition-colors" />
                                        </div>
                                        <p className="text-sm text-gray-400 leading-relaxed font-light">{office.address}</p>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                                            <IoCallOutline size={20} className="text-gray-400" />
                                        </div>
                                        <p className="text-sm text-gray-400 font-light mt-2 tracking-wider">{office.phone}</p>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="grid grid-cols-2 gap-4 mt-auto">
                                    <a
                                        href={`https://wa.me/${office.whatsapp}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-3 px-6 py-4 rounded-2xl border border-white/10 hover:border-[#D3A188]/50 text-xs uppercase tracking-[0.2em] font-medium text-white hover:bg-[#D3A188]/5 transition-all"
                                    >
                                        <FaWhatsapp className="text-[#D3A188]" size={16} />
                                        <span>WhatsApp</span>
                                    </a>

                                    <a
                                        href={`tel:${office.phoneClean}`}
                                        className="flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-white text-black hover:bg-[#D3A188] hover:text-white text-xs uppercase tracking-[0.2em] font-bold transition-all shadow-lg hover:shadow-[#D3A188]/20"
                                    >
                                        <IoCallOutline size={16} />
                                        <span>Call</span>
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default ContactPage;
