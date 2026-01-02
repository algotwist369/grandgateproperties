import React, { useState, useMemo, useCallback, memo } from 'react'
import { NavLink } from 'react-router-dom'
import { navbarData } from '../../data/navbar'
import { contactData } from '../../data/contactData'
import { CiBookmark } from "react-icons/ci"
import { RiMenuFold2Fill } from "react-icons/ri"
import { MdWhatsapp } from "react-icons/md"
import { IoMdClose } from "react-icons/io"

const Navbar = memo(({ selectedCountry, setSelectedCountry }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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
            ? 'text-[#D3A188] font-semibold'
            : 'hover:text-[#D3A188] transition-colors duration-200',
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

    return (
        <nav className='flex flex-col lg:flex-row justify-between items-center p-3 lg:p-6 px-4 border border-gray-600'>

            <div className='flex items-center justify-between w-full lg:w-auto space-x-4 lg:space-x-14'>
                {/* Logo */}
                <NavLink to="/en">
                    <img
                        src="/logo/logo.png"
                        alt="Grand Gate Properties"
                        className='h-10 lg:h-12 cursor-pointer object-contain'
                        loading="eager"
                        width="120"
                        height="48"
                    />
                </NavLink>

                {/* Desktop Navigation */}
                <ul className='hidden lg:flex space-x-6 text-[16px] text-gray-400 capitalize'>
                    {navbarData.map((item) => (
                        <li key={item.path}>
                            <NavLink to={item.path} className={linkClass}>
                                {item.label}
                            </NavLink>
                        </li>
                    ))}
                </ul>

                {/* Mobile Icons */}
                <div className='flex items-center space-x-3 lg:hidden'>
                    <a href={`https://wa.me/${currentWhatsapp}`} target="_blank" rel="noopener noreferrer">
                        <MdWhatsapp size={24} className='text-[#996515]' />
                    </a>
                    <button
                        className='text-[#996515] transition-transform duration-200 hover:scale-110'
                        onClick={toggleMobileMenu}
                        aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                    >
                        {isMobileMenuOpen ? <IoMdClose size={24} /> : <RiMenuFold2Fill size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className='w-full lg:hidden mt-4 border-t border-gray-600 pt-4'>
                    <ul className='flex flex-col space-y-3 text-[16px] text-gray-400 capitalize'>
                        {navbarData.map((item) => (
                            <li key={item.path}>
                                <NavLink
                                    to={item.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={linkClass}
                                >
                                    <div className='py-2 px-2 transition-colors duration-200'>{item.label}</div>
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Desktop Right Side */}
            <div className='hidden lg:flex items-center space-x-6 text-gray-400'>
                <select
                    className="bg-transparent py-1 cursor-pointer focus:outline-none text-[#D3A188] font-semibold transition-colors duration-200"
                    value={selectedCountry}
                    onChange={handleCountryChange}
                >
                    <option value="Dubai" className="bg-black text-gray-200">Dubai</option>
                    <option value="India" className="bg-black text-gray-200">India</option>
                </select>

                <a href={`https://wa.me/${currentWhatsapp}`} target="_blank" rel="noopener noreferrer">
                    <MdWhatsapp size={28} className='text-[#996515]' />
                </a>
                <span className='text-[#996515] cursor-pointer'>Follow us</span>
                <a href={`tel:${currentPhone}`} className='text-[#996515] cursor-pointer hover:text-[#D3A188] transition-colors'>
                    Call Us
                </a>

                <div className='flex space-x-4 border-l pl-4'>
                    <RiMenuFold2Fill size={28} />
                    <CiBookmark size={28} />
                </div>
            </div>

        </nav>
    )
});

Navbar.displayName = 'Navbar';

export default Navbar
