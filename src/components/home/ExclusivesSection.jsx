import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import PropertyCard from '../common/PropertyCard';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { propertyDirectory } from '../../data/dubai_Properties';
import { motion } from 'framer-motion';

const ExclusivesSection = memo(({ selectedCountry }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [slidesToShow, setSlidesToShow] = useState(3);
    const [isMobile, setIsMobile] = useState(false);

    const exclusiveProperties = useMemo(() => {
        return propertyDirectory.filter(p =>
            p.featured && (selectedCountry === 'All' || p.country === selectedCountry)
        ).map(p => ({
            ...p,
            image: p.heroImage || p.gallery?.[0] || p.image,
            location: p.location || `${p.community}, ${p.emirate}`
        }));
    }, [selectedCountry]);

    const totalSlides = exclusiveProperties.length;

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setSlidesToShow(1);
                setIsMobile(true);
            } else if (window.innerWidth < 1024) {
                setSlidesToShow(2);
                setIsMobile(false);
            } else {
                setSlidesToShow(3);
                setIsMobile(false);
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (currentSlide >= totalSlides && totalSlides > 0) {
            setCurrentSlide(0);
        }
    }, [totalSlides, currentSlide]);

    const nextSlide = useCallback(() => {
        if (totalSlides > 0) {
            setCurrentSlide(prev => (prev + 1) % totalSlides);
        }
    }, [totalSlides]);

    const prevSlide = useCallback(() => {
        if (totalSlides > 0) {
            setCurrentSlide(prev => (prev - 1 + totalSlides) % totalSlides);
        }
    }, [totalSlides]);

    if (!exclusiveProperties.length) return null;

    return (
        <section className="relative py-20 lg:py-32 overflow-hidden bg-[#0B0D10]">
            <div className="max-w-[1400px] mx-auto px-6">
                {/* Header */}
                <motion.div
                    className="text-center mb-16 select-none"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-3xl lg:text-6xl font-light tracking-tight text-white mb-6 uppercase">
                        Our <span className="text-[#D3A188] font-medium">Exclusive</span> Residences
                    </h2>
                    <div className='flex items-center justify-center gap-4 mb-8'>
                        <div className='w-20 h-px bg-gradient-to-r from-transparent to-[#D3A188]/50'></div>
                        <div className='w-2 h-2 rounded-full border border-[#D3A188]'></div>
                        <div className='w-20 h-px bg-gradient-to-l from-transparent to-[#D3A188]/50'></div>
                    </div>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg lg:text-xl font-light">
                        Discover a curated collection of ultra-luxury properties in the world's most desired locations.
                    </p>
                </motion.div>

                {/* Slider Container */}
                <div className="relative group">
                    <div className="overflow-hidden">
                        <motion.div
                            animate={{
                                x: `calc(-${currentSlide * (100 / slidesToShow)}% - ${currentSlide * (2 / slidesToShow)}rem)`
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 80,
                                damping: 25,
                                mass: 1,
                                restDelta: 0.001
                            }}
                            className="flex gap-8 cursor-grab active:cursor-grabbing"
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={0.5}
                            onDragEnd={(e, { offset, velocity }) => {
                                const swipeThreshold = 20;
                                const velocityThreshold = 400;

                                if (offset.x > swipeThreshold || velocity.x > velocityThreshold) {
                                    prevSlide();
                                } else if (offset.x < -swipeThreshold || velocity.x < -velocityThreshold) {
                                    nextSlide();
                                }
                            }}
                        >
                            {exclusiveProperties.map((property) => (
                                <div
                                    key={property.id}
                                    className="flex-shrink-0"
                                    style={{
                                        width: `calc((100% - ${(slidesToShow - 1) * 2}rem) / ${slidesToShow})`
                                    }}
                                >
                                    <PropertyCard property={property} />
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Navigation */}
                    {totalSlides > 1 && (
                        <>
                            <button
                                onClick={prevSlide}
                                className="absolute -left-4 lg:-left-12 top-1/2 -translate-y-1/2 z-20
                                bg-black/40 backdrop-blur-md p-4 rounded-full border border-white/10
                                text-[#D3A188] hover:bg-[#D3A188] hover:text-white transition-all duration-300
                                opacity-0 group-hover:opacity-100 hidden lg:flex"
                            >
                                <IoIosArrowBack size={24} />
                            </button>

                            <button
                                onClick={nextSlide}
                                className="absolute -right-4 lg:-right-12 top-1/2 -translate-y-1/2 z-20
                                bg-black/40 backdrop-blur-md p-4 rounded-full border border-white/10
                                text-[#D3A188] hover:bg-[#D3A188] hover:text-white transition-all duration-300
                                opacity-0 group-hover:opacity-100 hidden lg:flex"
                            >
                                <IoIosArrowForward size={24} />
                            </button>
                        </>
                    )}
                </div>

                {/* Progress Indicators */}
                {totalSlides > 1 && (
                    <div className="flex flex-col items-center mt-16">
                        <div className="flex gap-3 mb-4">
                            {Array.from({ length: totalSlides }).map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentSlide(i)}
                                    className={`h-1.5 transition-all duration-500 rounded-full ${i === currentSlide ? 'w-12 bg-[#D3A188]' : 'w-4 bg-white/10 hover:bg-white/20'
                                        }`}
                                />
                            ))}
                        </div>
                        <span className="text-gray-500 text-sm font-medium tracking-widest uppercase">
                            0{currentSlide + 1} / 0{totalSlides}
                        </span>
                    </div>
                )}
            </div>
        </section>
    );
});

ExclusivesSection.displayName = 'ExclusivesSection';
export default ExclusivesSection;
