import React, { useState, useEffect, useMemo, useCallback, memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '../common/Button';

const HeroSection = memo(({ selectedCountry, setSelectedCountry }) => {
    const navigate = useNavigate();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [propertyType, setPropertyType] = useState('');
    const [bedrooms, setBedrooms] = useState('');
    const [priceRange, setPriceRange] = useState('All Prices');
    const [autoSearch, setAutoSearch] = useState(true);

    const locations = ['DUBAI', 'INDIA'];
    const locationIndex = selectedCountry === 'Dubai' ? 0 : 1;

    const slides = useMemo(() => [
        "https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?q=80&w=2070", // Dubai Sky
        "https://images.unsplash.com/photo-1528181304800-2f140819898c?q=80&w=2070", // India Nature/Modern
        "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2070", // Dubai Luxury
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2070"  // Luxury Home
    ], []);

    const priceRanges = useMemo(() => {
        if (selectedCountry === 'India') {
            return ['All Prices', 'Under ₹1 Cr', '₹1 Cr - ₹5 Cr', '₹5 Cr - ₹20 Cr', 'Above ₹20 Cr'];
        }
        return ['All Prices', 'Under 1M AED', '1M - 5M AED', '5M - 20M AED', 'Above 20M AED'];
    }, [selectedCountry]);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [slides.length]);

    const handleCountryChange = useCallback((country) => {
        setSelectedCountry(country);
    }, [setSelectedCountry]);

    const handleSearch = useCallback(() => {
        navigate('/en/properties', {
            state: {
                country: selectedCountry,
                type: propertyType,
                bedrooms: bedrooms,
                priceRange: priceRange
            }
        });
    }, [navigate, selectedCountry, propertyType, bedrooms, priceRange]);

    const goToSlide = useCallback((index) => {
        setCurrentSlide(index);
    }, []);

    const contentVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (custom) => ({
            opacity: 1,
            y: 0,
            transition: { delay: custom * 0.2, duration: 0.6, ease: "easeOut" }
        })
    };

    return (
        <div className='w-full min-h-[600px] sm:h-[700px] lg:h-[850px] relative overflow-hidden bg-black'>
            {/* Slider Container */}
            <div className='absolute inset-0'>
                <AnimatePresence mode='wait'>
                    {slides.map((slide, index) => index === currentSlide && (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 1.1 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1.5 }}
                            className='absolute inset-0'
                        >
                            <img
                                src={slide}
                                alt={`Hero slide ${index + 1}`}
                                className='w-full h-full object-cover'
                                loading={index === 0 ? 'eager' : 'lazy'}
                                decoding="async"
                            />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Overlay for better text readability */}
            <div className='absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60'></div>

            {/* Content */}
            <div className='relative z-10 w-full h-full flex flex-col justify-center items-center py-12 lg:py-0'>
                <section className='w-11/12 max-w-7xl mx-auto px-4'>
                    {/* Unified Hero Container */}
                    <div className='backdrop-blur-md rounded-2xl p-6 lg:p-12 border border-[#D3A188]/20 shadow-2xl bg-black/10'>
                        <div className='grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16'>
                            {/* Left Side - Content */}
                            <motion.div
                                className='flex flex-col justify-center gap-4 lg:gap-8'
                                initial="hidden"
                                animate="visible"
                                custom={0}
                                variants={contentVariants}
                            >
                                <div className='space-y-4 lg:space-y-6'>
                                    <h1 className='text-3xl sm:text-4xl lg:text-[56px] font-light text-white leading-tight uppercase tracking-tight'>
                                        INVEST IN <span className='text-[#D3A188] font-medium transition-all duration-300'>{locations[locationIndex]}</span> <br className="hidden lg:block" /> REAL ESTATE WITH <span className="font-semibold">Grand Gate</span>
                                    </h1>
                                    <p className='text-sm sm:text-base lg:text-xl text-gray-300 leading-relaxed font-light max-w-xl'>
                                        Discover premium properties in Dubai, Georgia and India. Find your dream home with our expert guidance and exceptional service.
                                    </p>
                                </div>
                                <div className='flex flex-row flex-wrap gap-4 mt-2'>
                                    <Button
                                        text="Explore Properties"
                                        className={'min-w-[160px] lg:min-w-[200px] text-xs lg:text-base px-6 py-3 shadow-lg shadow-[#D3A188]/20'}
                                        onClick={() => navigate('/en/properties', { state: { country: selectedCountry } })}
                                    />
                                    <Button
                                        text="Contact Us"
                                        variant='secondary'
                                        className={'min-w-[160px] lg:min-w-[200px] text-xs lg:text-base px-6 py-3 border-[#D3A188]/50 text-white hover:border-[#D3A188]'}
                                        onClick={() => navigate('/en/contact')}
                                    />
                                </div>
                            </motion.div>

                            {/* Right Side - Search Form */}
                            <motion.div
                                className='bg-black/40 backdrop-blur-xl rounded-2xl p-6 lg:p-8 border border-[#D3A188]/20 shadow-2xl relative'
                                initial="hidden"
                                animate="visible"
                                custom={1}
                                variants={contentVariants}
                            >
                                {/* Decorative elements */}
                                <div className="absolute -top-px -left-px w-8 h-8 border-t border-l border-[#D3A188]/40 rounded-tl-2xl"></div>
                                <div className="absolute -bottom-px -right-px w-8 h-8 border-b border-r border-[#D3A188]/40 rounded-br-2xl"></div>

                                {/* Tabs */}
                                <div className='flex gap-4 mb-8 border-b border-gray-800'>
                                    {['India', 'Dubai'].map((country) => (
                                        <button
                                            key={country}
                                            onClick={() => handleCountryChange(country)}
                                            className={`px-6 py-3 text-sm lg:text-base font-medium transition-all duration-300 relative ${selectedCountry === country
                                                ? 'text-[#D3A188]'
                                                : 'text-gray-500 hover:text-gray-300'
                                                }`}
                                        >
                                            {country}
                                            {selectedCountry === country && (
                                                <motion.div
                                                    layoutId="activeTab"
                                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D3A188]"
                                                />
                                            )}
                                        </button>
                                    ))}
                                </div>

                                {/* Search Form */}
                                <div className='space-y-5 lg:space-y-6'>
                                    {/* Property Type */}
                                    <div>
                                        <label className='block text-xs lg:text-sm font-medium text-gray-400 mb-2 uppercase tracking-widest'>
                                            Property Type
                                        </label>
                                        <select
                                            value={propertyType}
                                            onChange={(e) => setPropertyType(e.target.value)}
                                            className='w-full p-3 lg:p-4 bg-white/5 border border-gray-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#D3A188]/50 text-white placeholder-gray-400 transition-all text-sm lg:text-base appearance-none hover:bg-white/10'
                                        >
                                            <option value="" className='text-white bg-[#0B0D10]'>Select Property Type</option>
                                            <option value="apartment" className='text-white bg-[#0B0D10]'>Apartment</option>
                                            <option value="villa" className='text-white bg-[#0B0D10]'>Villa</option>
                                            <option value="townhouse" className='text-white bg-[#0B0D10]'>Townhouse</option>
                                            <option value="penthouse" className='text-white bg-[#0B0D10]'>Penthouse</option>
                                            <option value="studio" className='text-white bg-[#0B0D10]'>Studio</option>
                                        </select>
                                    </div>

                                    {/* Bedrooms */}
                                    <div>
                                        <label className='block text-xs lg:text-sm font-medium text-gray-400 mb-2 uppercase tracking-widest'>
                                            Bedrooms
                                        </label>
                                        <select
                                            value={bedrooms}
                                            onChange={(e) => setBedrooms(e.target.value)}
                                            className='w-full p-3 lg:p-4 bg-white/5 border border-gray-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#D3A188]/50 text-white transition-all text-sm lg:text-base appearance-none hover:bg-white/10'
                                        >
                                            <option value="" className='text-white bg-[#0B0D10]'>Select Bedrooms</option>
                                            <option value="1" className='text-white bg-[#0B0D10]'>1 Bedroom</option>
                                            <option value="2" className='text-white bg-[#0B0D10]'>2 Bedrooms</option>
                                            <option value="3" className='text-white bg-[#0B0D10]'>3 Bedrooms</option>
                                            <option value="4" className='text-white bg-[#0B0D10]'>4 Bedrooms</option>
                                            <option value="5+" className='text-white bg-[#0B0D10]'>5+ Bedrooms</option>
                                        </select>
                                    </div>

                                    {/* Price Range */}
                                    <div>
                                        <label className='block text-xs lg:text-sm font-medium text-gray-400 mb-2 uppercase tracking-widest'>
                                            Price Range
                                        </label>
                                        <select
                                            value={priceRange}
                                            onChange={(e) => setPriceRange(e.target.value)}
                                            className='w-full p-3 lg:p-4 bg-white/5 border border-gray-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#D3A188]/50 text-white transition-all text-sm lg:text-base appearance-none hover:bg-white/10'
                                        >
                                            {priceRanges.map((range) => (
                                                <option key={range} value={range} className='text-white bg-[#0B0D10]'>
                                                    {range}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Auto Search Toggle */}
                                    <div className='flex items-center gap-3 pt-2'>
                                        <input
                                            type="checkbox"
                                            id="autoSearch"
                                            checked={autoSearch}
                                            onChange={(e) => setAutoSearch(e.target.checked)}
                                            className='w-5 h-5 accent-[#D3A188] border-gray-700 rounded bg-white/10 cursor-pointer'
                                        />
                                        <label htmlFor="autoSearch" className='text-sm font-medium text-gray-400 cursor-pointer hover:text-gray-200 transition-colors'>
                                            Enable Smart Search
                                        </label>
                                    </div>

                                    {/* Show Properties Button */}
                                    <Button
                                        text={`Search Properties`}
                                        className='w-full mt-6 py-4 rounded-xl font-bold uppercase tracking-widest shadow-xl shadow-[#D3A188]/10'
                                        onClick={handleSearch}
                                    />
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>
            </div>

            {/* Dot Indicators */}
            <div className='absolute bottom-4 sm:bottom-6 lg:bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2'>
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${index === currentSlide
                            ? 'bg-white w-6 sm:w-8'
                            : 'bg-white/50 hover:bg-white/75'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    )
});

HeroSection.displayName = 'HeroSection';

export default HeroSection