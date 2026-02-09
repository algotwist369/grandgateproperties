import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { IoLocationOutline, IoCallOutline, IoMailOutline } from 'react-icons/io5';
import { FaWhatsapp } from 'react-icons/fa';
import { contactData } from '../../data/contactData';
import { getFullUrl } from '../../apis/user_api';
import Button from '../../components/common/Button';

const ContactPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const adminNumber = "971554422553"; // Default to Dubai office or main number
        const text = `*New Website Inquiry*
        
*Name:* ${formData.name}
*Email:* ${formData.email}
*Phone:* ${formData.phone}
*Subject:* ${formData.subject}
*Message:* ${formData.message}`;

        const encodedText = encodeURIComponent(text);
        window.open(`https://wa.me/${adminNumber}?text=${encodedText}`, '_blank');

        // Reset form
        setFormData({
            name: '',
            email: '',
            phone: '',
            subject: '',
            message: ''
        });
    };

    return (
        <div className="bg-black min-h-screen">
            {/* Hero Section */}
            <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://res.cloudinary.com/dcm79v527/image/upload/v1770633450/dubai_image_id5mv5.jpg"
                        alt="Contact Us"
                        className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black"></div>
                </div>

                <div className="container mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-5xl md:text-7xl lg:text-8xl text-white font-light uppercase tracking-tighter mb-6">
                            Get in <span className="text-[#BD9B5F] font-medium font-serif italic">Touch</span>
                        </h1>
                        <p className="text-gray-300 text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed">
                            We are here to assist you with all your real estate needs. Reach out to our dedicated team of experts.
                        </p>
                    </motion.div>
                </div>
            </section>

            <div className="container mx-auto px-6 py-20 lg:py-32">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-3xl md:text-4xl text-white font-light uppercase tracking-tight mb-2">
                            Send us a <span className="text-[#BD9B5F]">Message</span>
                        </h2>
                        <p className="text-gray-400 mb-10 font-light">
                            Fill out the form below and we looks forward to hearing from you.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-widest text-[#BD9B5F]">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#BD9B5F] transition-colors"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-widest text-[#BD9B5F]">Phone</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#BD9B5F] transition-colors"
                                        placeholder="+971 50 000 0000"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-[#BD9B5F]">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#BD9B5F] transition-colors"
                                    placeholder="john@example.com"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-[#BD9B5F]">Subject</label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#BD9B5F] transition-colors"
                                    placeholder="Property Inquiry"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-[#BD9B5F]">Message</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    required
                                    rows="5"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#BD9B5F] transition-colors resize-none"
                                    placeholder="How can we help you?"
                                ></textarea>
                            </div>

                            <Button
                                text="Send Message"
                                onClick={(e) => handleSubmit(e)}
                                type="submit"
                                className="w-full py-5 text-sm"
                            />
                        </form>
                    </motion.div>

                    {/* Contact Info & Offices */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="space-y-16"
                    >
                        {/* Map through offices */}
                        {contactData.map((office, index) => (
                            <div key={index} className="relative group">
                                <div className="absolute inset-0 bg-[#BD9B5F]/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                                <div className="relative bg-[#0B0D10] border border-white/10 rounded-3xl p-8 overflow-hidden hover:border-[#BD9B5F]/30 transition-all duration-500">
                                    <div className="flex items-start justify-between mb-8">
                                        <div>
                                            <h3 className="text-2xl text-white font-light uppercase tracking-wide mb-2">{office.title}</h3>
                                            <p className="text-[#BD9B5F] text-xs uppercase tracking-widest">{office.country}</p>
                                        </div>
                                        <div className="w-16 h-16 rounded-2xl overflow-hidden border border-white/20">
                                            <img src={getFullUrl(office.image)} alt={office.title} className="w-full h-full object-cover" />
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0 text-[#BD9B5F]">
                                                <IoLocationOutline size={20} />
                                            </div>
                                            <p className="text-gray-400 font-light text-sm leading-relaxed">{office.address}</p>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0 text-[#BD9B5F]">
                                                <IoCallOutline size={20} />
                                            </div>
                                            {/* Use phoneClean for tel link */}
                                            <a href={`tel:${office.phoneClean}`} className="text-gray-400 font-light text-sm hover:text-white transition-colors">{office.phone}</a>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0 text-[#BD9B5F]">
                                                <IoMailOutline size={20} />
                                            </div>
                                            <a href={`mailto:${office.email}`} className="text-gray-400 font-light text-sm hover:text-white transition-colors">{office.email}</a>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    {/* Use mt-8 to separate actions from content */}
                                    <div className="mt-8 pt-8 border-t border-white/5 grid grid-cols-2 gap-4">
                                        <a
                                            href={`https://wa.me/${office.whatsapp}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[#25D366]/10 text-[#25D366] text-xs uppercase tracking-widest hover:bg-[#25D366] hover:text-white transition-all font-medium"
                                        >
                                            <FaWhatsapp size={16} />
                                            <span>WhatsApp</span>
                                        </a>
                                        <a
                                            href={`tel:${office.phoneClean}`}
                                            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 text-white text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all font-medium"
                                        >
                                            <IoCallOutline size={16} />
                                            <span>Call Now</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
