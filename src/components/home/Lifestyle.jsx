import React, { useState, useEffect, useMemo } from 'react'
import { homeSectionsData } from '../../data/homeSections'
import { motion } from 'framer-motion'

const Lifestyle = ({ selectedCountry }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [slidesToShow, setSlidesToShow] = useState(3);

    // Dynamic lifestyle data
    const exclusiveProperties = homeSectionsData[selectedCountry]?.lifestyle || homeSectionsData['Dubai'].lifestyle;

    // Responsive slides calculation
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setSlidesToShow(1);
            } else if (window.innerWidth < 1024) {
                setSlidesToShow(2);
            } else {
                setSlidesToShow(3);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const totalSlides = exclusiveProperties.length;

    // Reset current slide if it's out of bounds when slidesToShow changes
    useEffect(() => {
        if (currentSlide >= totalSlides && totalSlides > 0) {
            setCurrentSlide(0);
        }
    }, [totalSlides, currentSlide]);

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    return (
        <section className='relative py-24 lg:py-40 bg-[#0B0D10] overflow-hidden'>
            <div className='max-w-[1400px] mx-auto px-6 relative z-20'>
                {/* Header Section */}
                <motion.div
                    className='text-center mb-16 lg:mb-24'
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className='text-3xl lg:text-6xl font-light tracking-tight text-white mb-6 uppercase'>
                        Explore Luxury
                        <span className='text-[#D3A188] font-medium'> Lifestyle</span>
                    </h2>

                    <div className='flex items-center justify-center gap-4 mb-8'>
                        <div className='w-20 h-px bg-gradient-to-r from-transparent to-[#D3A188]/50'></div>
                        <div className='w-2 h-2 rounded-full border border-[#D3A188]'></div>
                        <div className='w-20 h-px bg-gradient-to-l from-transparent to-[#D3A188]/50'></div>
                    </div>
                    <p className='text-lg lg:text-xl text-gray-400 font-light max-w-2xl mx-auto'>
                        Immerse yourself in the most prestigious lifestyle destinations across the globe.
                    </p>
                </motion.div>

                {/* Slider Container */}
                <div className='relative'>
                    <div className='overflow-hidden'>
                        <motion.div
                            animate={{
                                x: `calc(-${currentSlide * (100 / slidesToShow)}% - ${currentSlide * (2.5 / slidesToShow)}rem)`
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 80,
                                damping: 25,
                                mass: 1,
                                restDelta: 0.001
                            }}
                            className='flex gap-10 cursor-grab active:cursor-grabbing'
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={0.5}
                            onDragEnd={(e, { offset, velocity }) => {
                                const swipeThreshold = 20;
                                const velocityThreshold = 400;
                                if (offset.x > swipeThreshold || velocity.x > velocityThreshold) {
                                    setCurrentSlide(prev => (prev - 1 + totalSlides) % totalSlides);
                                } else if (offset.x < -swipeThreshold || velocity.x < -velocityThreshold) {
                                    setCurrentSlide(prev => (prev + 1) % totalSlides);
                                }
                            }}
                        >
                            {exclusiveProperties.map((property, idx) => (
                                <div
                                    key={property.id || idx}
                                    className="flex-shrink-0"
                                    style={{
                                        width: `calc((100% - ${(slidesToShow - 1) * 2.5}rem) / ${slidesToShow})`
                                    }}
                                >
                                    <motion.div
                                        className='group relative aspect-[3/4] sm:aspect-[4/5] lg:aspect-[3/4.5] overflow-hidden rounded-3xl cursor-pointer bg-gray-900 border border-white/5'
                                        whileHover={{ y: -10 }}
                                        transition={{ duration: 0.4 }}
                                    >
                                        <motion.img
                                            src={property.image}
                                            alt={property.title}
                                            className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110'
                                        />
                                        <div className='absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500'></div>
                                        <div className='absolute bottom-0 left-0 right-0 p-8 sm:p-10 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500'>
                                            <div className="space-y-4">
                                                <h3 className='text-xl sm:text-2xl font-medium text-white tracking-wide uppercase'>
                                                    {property.title}
                                                </h3>
                                                <div className="w-12 h-0.5 bg-[#D3A188] group-hover:w-full transition-all duration-700"></div>
                                                <p className='text-gray-300 text-sm sm:text-base font-light tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100'>
                                                    {property.SubTitle}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Dot Indicators */}
                    {totalSlides > 1 && (
                        <div className='flex justify-center gap-4 mt-16'>
                            {Array.from({ length: totalSlides }).map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToSlide(index)}
                                    className={`h-1.5 transition-all duration-500 rounded-full ${index === currentSlide
                                        ? 'w-12 bg-[#D3A188]'
                                        : 'w-4 bg-white/10 hover:bg-white/20'
                                        }`}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}

export default Lifestyle
