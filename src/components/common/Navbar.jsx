import React, { useState, useMemo, useCallback, memo } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import { navbarData } from '../../data/navbar';
import { contactData } from '../../data/contactData';
import { CiBookmark } from "react-icons/ci";
import { RiMenuFold2Fill } from "react-icons/ri";
import { MdWhatsapp } from "react-icons/md";
import { IoMdClose } from "react-icons/io";

const Navbar = memo(({ selectedCountry, setSelectedCountry }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Memoize contact data lookups
    const { whatsappNumbers, phoneNumbers } = useMemo(() => {
        const whatsapp = contactData.reduce((acc, curr) => {
            acc[curr.country] = curr.whatsapp;
            return acc;
        }, {});

        const phone = contactData.reduce((acc, curr) => {
            acc[curr.country] = curr.phoneClean;
            return acc;
        }, {});

        return { whatsappNumbers: whatsapp, phoneNumbers: phone };
    }, []);

    // Memoize WhatsApp and phone calculations
    const { currentWhatsapp, currentPhone } = useMemo(() => {
        const country = selectedCountry || 'Dubai';
        const message = encodeURIComponent(`Hello, I'm interested in real estate opportunities in ${country} with Grand Gate Properties. Can you please assist me?`);
        return {
            currentWhatsapp: `${whatsappNumbers[country] || whatsappNumbers['Dubai']}?text=${message}`,
            currentPhone: phoneNumbers[country] || phoneNumbers['Dubai']
        };
    }, [selectedCountry, whatsappNumbers, phoneNumbers]);

    // Memoize link class function
    const linkClass = useCallback(({ isActive }) =>
        isActive
            ? 'text-[#D3A188] font-bold'
            : 'text-white/70 hover:text-[#D3A188] transition-colors duration-200',
        []
    );

    // Memoize mobile menu toggle
    const toggleMobileMenu = useCallback(() => {
        setIsMobileMenuOpen(prev => !prev);
    }, []);

    // Memoize country change handler
    const handleCountryChange = useCallback((e) => {
        if (setSelectedCountry) {
            setSelectedCountry(e.target.value);
        }
    }, [setSelectedCountry]);

    const menuVariants = {
        closed: {
            opacity: 0,
            y: -20,
            transition: {
                staggerChildren: 0.05,
                staggerDirection: -1
            }
        },
        open: {
            opacity: 1,
            y: 0,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        closed: { opacity: 0, x: -10 },
        open: { opacity: 1, x: 0 }
    };

    return (
        <nav className="sticky top-0 z-[100] bg-black/80 backdrop-blur-xl border-b border-white/10 px-6 py-4 lg:py-6">
            <div className="max-w-[99rem] mx-auto flex items-center justify-between">

                {/* Logo Section */}
                <div className="flex items-center gap-12">
                    <NavLink to="/en" className="relative group">
                        <div className="flex items-center gap-2 z-10 relative">
                            <motion.img
                                src="/logo/main.png"
                                alt="Grand Gate Properties"
                                className="h-10 lg:h-14 w-auto object-contain"
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            />
                            <motion.img
                                src="/logo/logo.png"
                                alt="Grand Gate Properties"
                                className="h-10 lg:h-12 w-auto object-contain"
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            />
                        </div>
                        <div className="absolute -inset-2 bg-[#D3A188]/5 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </NavLink>

                    {/* Desktop Navigation */}
                    <ul className="hidden lg:flex items-center gap-8">
                        {navbarData.map((item) => (
                            <li key={item.path}>
                                <NavLink to={item.path} className={linkClass}>
                                    <motion.span
                                        className="text-[10px] uppercase tracking-[0.3em] font-medium"
                                        whileHover={{ y: -1 }}
                                    >
                                        {item.label}
                                    </motion.span>
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Right Actions - Desktop */}
                <div className="hidden lg:flex items-center gap-8">
                    <div className="flex items-center gap-6 border-r border-white/10 pr-8">
                        <select
                            className="bg-transparent text-[#D3A188] text-[10px] uppercase tracking-[0.2em] font-bold focus:outline-none cursor-pointer"
                            value={selectedCountry}
                            onChange={handleCountryChange}
                        >
                            <option value="Dubai" className="bg-neutral-900">Dubai</option>
                            <option value="India" className="bg-neutral-900">India</option>
                        </select>

                        <a href={`https://wa.me/${currentWhatsapp}`} target="_blank" rel="noopener noreferrer" className="text-[#D3A188] hover:text-white transition-colors">
                            <MdWhatsapp size={22} />
                        </a>

                        <a href={`tel:${currentPhone}`} className="text-white hover:text-[#D3A188] text-[10px] uppercase tracking-[0.2em] font-bold transition-colors">
                            Advisory
                        </a>
                    </div>

                    <div className="flex items-center gap-4 text-white/50">
                        <motion.button whileHover={{ scale: 1.1, color: "#fff" }} className="transition-colors">
                            <CiBookmark size={24} />
                        </motion.button>
                        <motion.button whileHover={{ scale: 1.1, color: "#fff" }} className="transition-colors">
                            <RiMenuFold2Fill size={24} />
                        </motion.button>
                    </div>
                </div>

                {/* Mobile Controls */}
                <div className="flex items-center gap-4 lg:hidden">
                    <a href={`https://wa.me/${currentWhatsapp}`} className="text-[#D3A188]">
                        <MdWhatsapp size={24} />
                    </a>
                    <button
                        onClick={toggleMobileMenu}
                        className="text-white p-2"
                    >
                        {isMobileMenuOpen ? <IoMdClose size={28} /> : <RiMenuFold2Fill size={28} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={menuVariants}
                        className="fixed inset-0 top-[73px] bg-black/95 backdrop-blur-2xl lg:hidden z-50 overflow-hidden"
                    >
                        <div className="p-8 space-y-12">
                            <ul className="space-y-6">
                                {navbarData.map((item) => (
                                    <motion.li key={item.path} variants={itemVariants}>
                                        <NavLink
                                            to={item.path}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={({ isActive }) => `text-4xl font-light uppercase tracking-tighter ${isActive ? 'text-[#D3A188]' : 'text-white'}`}
                                        >
                                            {item.label}
                                        </NavLink>
                                    </motion.li>
                                ))}
                            </ul>

                            <motion.div variants={itemVariants} className="pt-12 border-t border-white/10 space-y-8">
                                <div className="space-y-2">
                                    <p className="text-[10px] uppercase tracking-[0.4em] text-gray-400">Market selection</p>
                                    <select
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white text-sm uppercase tracking-widest outline-none"
                                        value={selectedCountry}
                                        onChange={handleCountryChange}
                                    >
                                        <option value="Dubai" className="bg-neutral-900">Dubai Portfolio</option>
                                        <option value="India" className="bg-neutral-900">India Portfolio</option>
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <a href={`tel:${currentPhone}`} className="flex items-center justify-center gap-3 py-5 bg-white text-black text-[10px] uppercase tracking-[0.2em] font-bold rounded-2xl">
                                        Support
                                    </a>
                                    <a href={`https://wa.me/${currentWhatsapp}`} className="flex items-center justify-center gap-3 py-5 border border-white/10 text-white text-[10px] uppercase tracking-[0.2em] font-bold rounded-2xl">
                                        WhatsApp
                                    </a>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
});

Navbar.displayName = 'Navbar';

export default Navbar;
