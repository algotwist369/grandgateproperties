import React, { useState, useMemo, useCallback, memo } from 'react'
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa'
import { contactData, globalEmail } from '../../data/contactData'

const Footer = memo(() => {
    const currentYear = useMemo(() => new Date().getFullYear(), []);
    const [leadContact, setLeadContact] = useState('')

    const handleSubscribe = useCallback(() => {
        if (!leadContact.trim()) {
            alert('Please enter your phone or email');
            return;
        }

        // Use Dubai office WhatsApp as default for newsletter leads
        const whatsappNumber = contactData[0]?.whatsapp; // Dubai office
        if (!whatsappNumber) return;

        const message = encodeURIComponent(
            `Hello Grand Gate Properties,\n\nI would like to subscribe to your newsletter.\n\nContact: ${leadContact}\n\nPlease keep me updated on your latest property listings and offers.\n\nThank you.`
        );

        window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
        setLeadContact(''); // Clear input after sending
    }, [leadContact]);

    const quickLinks = useMemo(() => [
        { name: 'About Us', link: '/en/about' },
        { name: 'Properties', link: '/en/properties' },
        { name: 'Contact', link: '/en/contact' },
    ], []);

    const services = useMemo(() => [
        { name: 'Buy Property', link: '/en/properties' },
        { name: 'Rent Property', link: '/en/properties' },
    ], []);

    const locations = useMemo(() => [
        { name: 'Dubai', link: '/en/contact' },
        { name: 'India', link: '/en/contact' }
    ], []);

    const socialLinks = useMemo(() => [
        { icon: <FaInstagram />, link: 'https://www.instagram.com/grandgateproperties/', name: 'Instagram' },
        { icon: <FaFacebook />, link: 'https://www.facebook.com/profile.php?id=61585773879074', name: 'Facebook' },
        // { icon: <FaLinkedin />, link: 'https://www.linkedin.com/company/aries-estates/', name: 'LinkedIn' },
    ], []);

    return (
        <footer className='relative border-t border-[#BD9B5F]/20'>
            <div className='container mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>

                {/* Main Footer Content */}
                <div className='py-12 sm:py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12'>

                    {/* Company Info */}
                    <div className='space-y-4 text-center sm:text-left'>
                        <h3 className='text-2xl font-bold text-white'>
                            GRAND GATE <span className='text-[#BD9B5F]'>PROPERTIES</span>
                        </h3>

                        <p className='text-gray-300 leading-relaxed text-sm sm:text-base'>
                            Your trusted partner in real estate. We help you find your dream
                            property in Dubai and India with exceptional service and expertise.
                        </p>

                        <div className='flex justify-center sm:justify-start gap-4 pt-4'>
                            {socialLinks.map((social, index) => (
                                <a
                                    key={index}
                                    href={social.link}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='text-gray-400 hover:text-[#BD9B5F] transition-colors'
                                    aria-label={social.name}
                                >
                                    {React.cloneElement(social.icon, { size: 20 })}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className='text-center sm:text-left'>
                        <h4 className='text-lg font-semibold text-white mb-4'>Quick Links</h4>
                        <ul className='space-y-2'>
                            {quickLinks.map((link, index) => (
                                <li key={index}>
                                    <a
                                        href={link.link}
                                        className='text-gray-300 hover:text-[#BD9B5F] transition-colors flex items-center justify-center sm:justify-start gap-2'
                                    >
                                        <span className='w-1 h-1 bg-[#BD9B5F] rounded-full'></span>
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services */}
                    <div className='text-center sm:text-left'>
                        <h4 className='text-lg font-semibold text-white mb-4'>Our Services</h4>
                        <ul className='space-y-2'>
                            {services.map((service, index) => (
                                <li key={index}>
                                    <a
                                        href={service.link}
                                        className='text-gray-300 hover:text-[#BD9B5F] transition-colors flex items-center justify-center sm:justify-start gap-2'
                                    >
                                        <span className='w-1 h-1 bg-[#BD9B5F] rounded-full'></span>
                                        {service.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className='text-center sm:text-left'>
                        <h4 className='text-lg font-semibold text-white mb-4'>Contact Us</h4>

                        <ul className='space-y-6 text-sm'>
                            {contactData.map((office) => (
                                <li key={office.country} className='flex gap-3 items-start'>
                                    <div className='text-[#BD9B5F] mt-1 flex-shrink-0'>
                                        <FaMapMarkerAlt className='w-5 h-5' />
                                    </div>

                                    <div className='text-gray-400 text-left'>
                                        <span className='text-white font-medium block mb-1'>
                                            {office.title}
                                        </span>

                                        <p className='mb-1 leading-relaxed break-words'>
                                            {office.address}
                                        </p>

                                        <a
                                            href={`tel:${office.phoneClean}`}
                                            className='hover:text-[#BD9B5F] transition-colors'
                                        >
                                            {office.phone}
                                        </a>
                                    </div>
                                </li>
                            ))}
                        </ul>

                    </div>
                </div>

                {/* Newsletter Section */}
                <div className='py-8 border-t border-[#BD9B5F]/20'>
                    <div className='flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6'>
                        <div className='text-center lg:text-left'>
                            <h4 className='text-lg font-semibold text-white mb-1'>
                                Subscribe to Our Newsletter
                            </h4>
                            <p className='text-gray-300 text-sm'>
                                Get the latest property updates and exclusive offers
                            </p>
                        </div>

                        <div className='flex flex-col sm:flex-row gap-3 w-full lg:w-auto'>
                            <input
                                type='text'
                                placeholder='Enter your Phone/Email'
                                value={leadContact}
                                onChange={(e) => setLeadContact(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSubscribe()}
                                className='w-full sm:w-64 px-4 py-2.5 bg-white/10 border border-[#BD9B5F]/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#BD9B5F]'
                            />
                            <button
                                onClick={handleSubscribe}
                                className='px-6 py-2.5 bg-[#BD9B5F] text-white font-semibold rounded-lg hover:bg-[#BD9B5F]/80 transition-colors'
                            >
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className='py-6 border-t border-[#BD9B5F]/20'>
                    <div className='flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left'>
                        <p className='text-gray-300 text-sm'>
                            &copy; {currentYear} Grand Gate Properties. All rights reserved.
                        </p>

                        <div className='flex flex-wrap justify-center md:justify-end gap-4 text-sm'>
                            <a href='/en/privacy' className='text-gray-300 hover:text-[#BD9B5F]'>
                                Privacy Policy
                            </a>
                            <a href='/en/terms' className='text-gray-300 hover:text-[#BD9B5F]'>
                                Terms of Service
                            </a>
                            <a href='/en/cookies' className='text-gray-300 hover:text-[#BD9B5F]'>
                                Cookie Policy
                            </a>
                        </div>
                    </div>
                </div>

            </div>
        </footer>

    )
});

Footer.displayName = 'Footer';

export default Footer

