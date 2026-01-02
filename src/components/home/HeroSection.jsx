import React, { useState, useEffect, useMemo, useCallback, memo } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../common/Button';

const HeroSection = memo(({ selectedCountry, setSelectedCountry }) => {
    const navigate = useNavigate();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [propertyType, setPropertyType] = useState('');
    const [bedrooms, setBedrooms] = useState('');
    const [autoSearch, setAutoSearch] = useState(false);
    const [locationIndex, setLocationIndex] = useState(0);
    const [priceRange, setPriceRange] = useState('All');
    const [loadedImages, setLoadedImages] = useState(new Set());

    // Dynamic Price Ranges based on Country (Matches PropertyPage logic)
    const priceRanges = useMemo(() => {
        if (selectedCountry === 'India') {
            return [
                'All',
                'Under ₹1 Cr',
                '₹1 Cr - ₹5 Cr',
                '₹5 Cr - ₹20 Cr',
                'Above ₹20 Cr',
            ];
        } else {
            // Default (AED - Dubai / All)
            return [
                'All',
                'Under 1M AED',
                '1M - 5M AED',
                '5M - 20M AED',
                'Above 20M AED',
            ];
        }
    }, [selectedCountry]);

    // Reset price range when country changes
    useEffect(() => {
        setPriceRange('All');
    }, [selectedCountry]);

    const locations = useMemo(() => ['DUBAI', 'INDIA'], []);

    const slides = useMemo(() => [
        // '/hero/hero1.png',
        '/hero/hero2.webp',
        '/hero/bg-4.png',
    ], []);

    // Slider Interval
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000); // Change slide every 5 seconds

        return () => clearInterval(interval);
    }, [slides.length]);

    // Text Rotation Interval
    useEffect(() => {
        const interval = setInterval(() => {
            setLocationIndex((prev) => (prev + 1) % locations.length);
        }, 2000);

        return () => clearInterval(interval);
    }, [locations.length]);

    // Preload next slide image
    useEffect(() => {
        const nextSlideIndex = (currentSlide + 1) % slides.length;
        const nextImage = new Image();
        nextImage.src = slides[nextSlideIndex];
    }, [currentSlide, slides]);

    const goToSlide = useCallback((index) => {
        setCurrentSlide(index);
    }, []);

    const handleCountryChange = useCallback((country) => {
        if (setSelectedCountry) {
            setSelectedCountry(country);
        }
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

    const handleImageLoad = useCallback((index) => {
        setLoadedImages(prev => new Set([...prev, index]));
    }, []);

    return (
        <div className='w-full h-[600px] sm:h-[700px] lg:h-[850px] relative overflow-hidden'>
            {/* Slider Container */}
            <div className='absolute inset-0'>
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                            }`}
                    >
                        {/* Preload placeholder */}
                        {!loadedImages.has(index) && index === currentSlide && (
                            <div className='absolute inset-0 bg-gray-900 animate-pulse' />
                        )}
                        <img
                            src={slide}
                            alt={`Hero slide ${index + 1}`}
                            className={`w-full h-full object-cover ${loadedImages.has(index) ? 'opacity-100' : 'opacity-0'
                                } transition-opacity duration-500`}
                            loading={index === 0 ? 'eager' : 'lazy'}
                            onLoad={() => handleImageLoad(index)}
                            decoding="async"
                        />
                    </div>
                ))}
            </div>

            {/* Overlay for better text readability */}
            <div className='absolute inset-0 bg-black/30'></div>

            {/* Content */}
            <div className='relative z-10 w-full h-full flex flex-col justify-center items-center py-4 lg:py-0'>
                <section className='w-11/12 max-w-7xl mx-auto px-2 lg:px-4'>
                    {/* Unified Hero Container */}
                    <div className='backdrop-blur-sm rounded-xl lg:rounded-2xl p-3 lg:p-8  border border-[#D3A188]/30'>
                        <div className='grid grid-cols-2 lg:grid-cols-2 gap-3 lg:gap-8'>
                            {/* Left Side - Content */}
                            <div className='flex flex-col justify-center gap-2 lg:gap-6'>
                                <div className='space-y-2 lg:space-y-4'>
                                    <h1 className='text-[14px] lg:text-[40px] text-gray-400 leading-tight'>
                                        INVEST IN <span className='text-[#D3A188] transition-all duration-300'>{locations[locationIndex]}</span> REAL ESTATE WITH Grand Gate Properties
                                    </h1>
                                    <p className='text-[10px] lg:text-lg text-gray-400 leading-relaxed'>
                                        Discover premium properties in Dubai, Georgia and India. Find your dream home with our expert guidance and exceptional service.
                                    </p>
                                </div>
                                <div className='flex flex-row flex-wrap gap-2 lg:gap-4 mt-2 lg:mt-4'>
                                    <Button
                                        text="Explore Properties"
                                        className={'min-w-[100px] lg:min-w-[200px] text-[10px] lg:text-base px-2 py-1 lg:px-3 lg:py-3'}
                                        onClick={() => navigate('/en/properties', { state: { country: selectedCountry } })}
                                    />
                                    <Button
                                        text="Contact Us"
                                        variant='secondary'
                                        className={'min-w-[100px] lg:min-w-[200px] text-[10px] lg:text-base px-2 py-1 lg:px-3 lg:py-3'}
                                        onClick={() => navigate('/en/contact')}
                                    />
                                </div>
                            </div>

                            {/* Right Side - Search Form */}
                            <div className='bg-white/5 backdrop-blur-sm rounded-xl p-2 lg:p-6 border border-[#D3A188]/20'>
                                {/* Tabs */}
                                <div className='flex gap-1 lg:gap-2 mb-2 lg:mb-6 border-b border-[#D3A188]/30'>
                                    <button
                                        onClick={() => handleCountryChange('India')}
                                        className={`px-2 lg:px-4 py-1 lg:py-2 text-[10px] lg:text-base font-semibold transition-colors duration-200 ${selectedCountry === 'India'
                                            ? 'text-[#D3A188] border-b-2 border-[#D3A188]'
                                            : 'text-gray-400 hover:text-[#D3A188]'
                                            }`}
                                    >
                                        India
                                    </button>
                                    <button
                                        onClick={() => handleCountryChange('Dubai')}
                                        className={`px-2 lg:px-4 py-1 lg:py-2 text-[10px] lg:text-base font-semibold transition-colors duration-200 ${selectedCountry === 'Dubai'
                                            ? 'text-[#D3A188] border-b-2 border-[#D3A188]'
                                            : 'text-gray-400 hover:text-[#D3A188]'
                                            }`}
                                    >
                                        Dubai
                                    </button>
                                </div>

                                {/* Search Form */}
                                <div className='space-y-2 lg:space-y-4'>
                                    {/* Property Type */}
                                    <div>
                                        <label className='block text-[10px] lg:text-sm font-medium text-[#D3A188] mb-1 lg:mb-2'>
                                            Property Type
                                        </label>
                                        <select
                                            value={propertyType}
                                            onChange={(e) => setPropertyType(e.target.value)}
                                            className='w-full p-1.5 lg:p-3 bg-transparent border border-[#D3A188]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D3A188] text-white placeholder-gray-400 transition-all text-[10px] lg:text-base'
                                        >
                                            <option value="" className='text-white bg-black'>Select Property Type</option>
                                            <option value="apartment" className='text-white bg-black'>Apartment</option>
                                            <option value="villa" className='text-white bg-black'>Villa</option>
                                            <option value="townhouse" className='text-white bg-black'>Townhouse</option>
                                            <option value="penthouse" className='text-white bg-black'>Penthouse</option>
                                            <option value="studio" className='text-white bg-black'>Studio</option>
                                        </select>
                                    </div>

                                    {/* Bedrooms */}
                                    <div>
                                        <label className='block text-[10px] lg:text-sm font-medium text-[#D3A188] mb-1 lg:mb-2'>
                                            Bedrooms
                                        </label>
                                        <select
                                            value={bedrooms}
                                            onChange={(e) => setBedrooms(e.target.value)}
                                            className='w-full p-1.5 lg:p-3 bg-transparent border border-[#D3A188]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D3A188] text-white transition-all text-[10px] lg:text-base'
                                        >
                                            <option value="" className='text-white bg-black'>Select Bedrooms</option>
                                            <option value="1" className='text-white bg-black'>1 Bedroom</option>
                                            <option value="2" className='text-white bg-black'>2 Bedrooms</option>
                                            <option value="3" className='text-white bg-black'>3 Bedrooms</option>
                                            <option value="4" className='text-white bg-black'>4 Bedrooms</option>
                                            <option value="5+" className='text-white bg-black'>5+ Bedrooms</option>
                                        </select>
                                    </div>



                                    {/* Price Range */}
                                    <div>
                                        <label className='block text-[10px] lg:text-sm font-medium text-[#D3A188] mb-1 lg:mb-2'>
                                            Price Range
                                        </label>
                                        <select
                                            value={priceRange}
                                            onChange={(e) => setPriceRange(e.target.value)}
                                            className='w-full p-1.5 lg:p-3 bg-transparent border border-[#D3A188]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D3A188] text-white transition-all text-[10px] lg:text-base'
                                        >
                                            {priceRanges.map((range) => (
                                                <option key={range} value={range} className='text-white bg-black'>
                                                    {range}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Auto Search Toggle */}
                                    <div className='flex items-center gap-1.5 lg:gap-2 pt-0.5 lg:pt-2'>
                                        <input
                                            type="checkbox"
                                            id="autoSearch"
                                            checked={autoSearch}
                                            onChange={(e) => setAutoSearch(e.target.checked)}
                                            className='w-3 h-3 lg:w-4 lg:h-4 text-[#D3A188] border-[#D3A188]/50 rounded focus:ring-[#D3A188] bg-white/10 cursor-pointer'
                                        />
                                        <label htmlFor="autoSearch" className='text-[10px] lg:text-sm font-medium text-gray-300 cursor-pointer'>
                                            Auto Search
                                        </label>
                                    </div>

                                    {/* Show Properties Button */}
                                    <Button
                                        text={`Show Properties`}
                                        className='w-full mt-1.5 lg:mt-4 text-[10px] lg:text-base px-2 py-1 lg:px-3 lg:py-3'
                                        onClick={handleSearch}
                                    />
                                </div>
                            </div>
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