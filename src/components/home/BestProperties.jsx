import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { motion, AnimatePresence } from "framer-motion";
import { propertyDirectory } from '../../data/dubai_Properties';

const BestProperties = ({ selectedCountry }) => {
    const navigate = useNavigate();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const [isTablet, setIsTablet] = useState(false);

    // Filter properties
    const properties = useMemo(() => {
        return propertyDirectory.filter(p =>
            p.featured && (selectedCountry === 'All' || p.country === selectedCountry)
        ).map(p => ({
            ...p,
            image: p.heroImage || p.gallery?.[0] || p.image,
            location: p.location || `${p.community}, ${p.emirate}`
        }));
    }, [selectedCountry]);

    // Handle responsive breakpoints
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Rotate items and bring current one to front
    const getDisplayItems = () => {
        if (!properties.length) return [];
        const rotatedItems = [
            ...properties.slice(currentSlide % properties.length),
            ...properties.slice(0, currentSlide % properties.length)
        ];

        if (isMobile) {
            return rotatedItems.slice(0, 1);
        } else if (isTablet) {
            return rotatedItems.slice(0, 2);
        } else {
            return rotatedItems.slice(0, 4);
        }
    };

    const displayItems = getDisplayItems();


    const nextSlide = () => {
        if (properties.length > 0)
            setCurrentSlide((prev) => (prev + 1) % properties.length);
    };

    const prevSlide = () => {
        if (properties.length > 0)
            setCurrentSlide((prev) => (prev - 1 + properties.length) % properties.length);
    };

    const handlePropertyClick = (property) => {
        if (!property?.slug) return;
        navigate(`/en/properties/${property.slug}`, {
            state: { propertyId: property.id, property: property.source },
        });
    };

    if (!properties.length) return null;

    return (
        <div className="relative py-24 sm:py-32 overflow-hidden bg-black">
            {/* Background Accent */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-[#BD9B5F]/5 blur-[120px] rounded-full"></div>

            <div className="max-w-[99rem] container mx-auto px-6 lg:px-2 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                    {/* Left Side - Properties Stack with Motion */}
                    <div className="relative h-[600px] sm:h-[700px] flex items-center justify-center order-2 lg:order-1">
                        <div className="relative w-full max-w-md h-full flex items-center justify-center">
                            <AnimatePresence mode="popLayout">
                                {displayItems.map((property, index) => {
                                    const isMain = index === 0;

                                    return (
                                        <motion.div
                                            key={property.id}
                                            initial={{ opacity: 0, scale: 0.8, x: 100 }}
                                            animate={{
                                                opacity: isMain ? 1 : 0.4 - (index * 0.1),
                                                scale: 1 - (index * 0.05),
                                                x: index * 40,
                                                y: index * -20,
                                                zIndex: 50 - index
                                            }}
                                            exit={{ opacity: 0, scale: 0.5, x: -200, rotate: -10 }}
                                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                            className="absolute w-full"
                                            onClick={() => isMain ? handlePropertyClick(property) : nextSlide()}
                                        >
                                            <div className={`relative group rounded-[2.5rem] overflow-hidden border transition-all duration-500 cursor-pointer ${isMain ? 'border-[#BD9B5F] shadow-2xl shadow-[#BD9B5F]/10' : 'border-white/10'
                                                }`}>
                                                <div className="aspect-[3/4] overflow-hidden">
                                                    <img
                                                        src={property.image}
                                                        alt={property.title}
                                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                                                </div>

                                                <div className="absolute bottom-0 left-0 right-0 p-8 pt-20">
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className="space-y-3"
                                                    >
                                                        <p className="text-[10px] uppercase tracking-[0.4em] text-[#BD9B5F] font-medium truncate">
                                                            {property.location}
                                                        </p>
                                                        <h3 className="text-2xl font-light text-white uppercase tracking-tight line-clamp-2">
                                                            {property.title}
                                                        </h3>
                                                        <div className="pt-4 flex flex-wrap gap-2">
                                                            {property.bedrooms && (
                                                                <span className="px-3 py-1 rounded-full border border-white/10 text-[9px] uppercase tracking-widest text-gray-400">
                                                                    {property.bedrooms} Beds
                                                                </span>
                                                            )}
                                                            {property.bathrooms && (
                                                                <span className="px-3 py-1 rounded-full border border-white/10 text-[9px] uppercase tracking-widest text-gray-400">
                                                                    {property.bathrooms} Baths
                                                                </span>
                                                            )}
                                                            {property.price && (
                                                                <span className="px-3 py-1 rounded-full border border-white/10 text-[9px] uppercase tracking-widest text-gray-400">
                                                                    {property.price}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </motion.div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </div>

                        {/* Custom Navigation */}
                        {properties.length > 1 && (
                            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-8">
                                <button onClick={prevSlide} className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white hover:border-[#BD9B5F] hover:text-[#BD9B5F] transition-all">
                                    <IoIosArrowBack />
                                </button>
                                <div className="flex gap-2">
                                    {properties.map((_, idx) => (
                                        <div
                                            key={idx}
                                            className={`h-1 transition-all duration-500 rounded-full ${idx === currentSlide ? 'w-8 bg-[#BD9B5F]' : 'w-2 bg-white/10'}`}
                                        />
                                    ))}
                                </div>
                                <button onClick={nextSlide} className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white hover:border-[#BD9B5F] hover:text-[#BD9B5F] transition-all">
                                    <IoIosArrowForward />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Right Side - Content Reveal */}
                    <motion.div
                        className="space-y-12 order-1 lg:order-2"
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-px bg-[#BD9B5F]"></div>
                                <span className="text-xs uppercase tracking-[0.5em] text-[#BD9B5F] font-medium">Curated Selection</span>
                            </div>
                            <h2 className="text-5xl lg:text-7xl font-light text-white uppercase tracking-tighter leading-[0.9]">
                                Discover Your <br />
                                <span className="text-[#BD9B5F] font-medium italic">Dream Home</span>
                            </h2>
                        </div>

                        <div className="space-y-8">
                            <p className="text-gray-400 text-lg lg:text-xl font-light leading-relaxed">
                                Explore our portfolio of hand-picked properties, chosen for their exceptional quality, prime locations, and superior investment value. From waterfront residences to urban sanctuaries, find the perfect backdrop for your life.
                            </p>
                            <p className="text-gray-500 text-base font-light italic leading-relaxed border-l-2 border-[#BD9B5F]/30 pl-6">
                                "Real estate is not just about square footage; it's about the life you live within those walls. We bring you spaces that inspire."
                            </p>
                        </div>

                        <div className="pt-4">
                            <button
                                onClick={() => navigate('/en/properties')}
                                className="group relative px-10 py-5 bg-[#BD9B5F] text-white text-xs uppercase tracking-[0.3em] font-bold overflow-hidden rounded-2xl transition-all hover:bg-white hover:text-black"
                            >
                                <span className="relative z-10">Discover All Properties</span>
                                <div className="absolute inset-0 bg-black scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 opacity-10"></div>
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default BestProperties;