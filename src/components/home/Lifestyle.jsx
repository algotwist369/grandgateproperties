import React, { useState, useEffect } from 'react'
import { homeSectionsData } from '../../data/homeSections'

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

    const totalSlides = Math.ceil(exclusiveProperties.length / slidesToShow);

    // Reset current slide if it's out of bounds when slidesToShow changes
    useEffect(() => {
        if (currentSlide >= totalSlides) {
            setCurrentSlide(0);
        }
    }, [totalSlides, currentSlide]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % totalSlides);
        }, 5000); // Change slide every 5 seconds

        return () => clearInterval(interval);
    }, [totalSlides]);

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    return (
        <div className='relative md:min-h-screen py-8 sm:py-12 lg:py-16'>

            <div className='container mx-auto px-4 sm:px-6 lg:px-4 relative z-20'>
                {/* Header Section */}
                <div className='text-center mb-8 sm:mb-10 lg:mb-12 pt-4 sm:pt-6 lg:pt-8'>
                    <h1 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gray-400 leading-tight sm:leading-[40px] lg:leading-[50px] mb-3 sm:mb-4'>
                        EXPLORE LUXURY
                        <span className='relative z-10 text-[#D3A188]'> LIFE STYLE</span>
                    </h1>

                    <div className='flex items-center justify-center gap-2 sm:gap-3 lg:gap-4 my-4 sm:my-6 lg:my-8'>
                        <div className='w-8 sm:w-12 lg:w-16 h-px bg-gradient-to-r from-transparent to-[#D3A188]'></div>
                        <div className='w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#D3A188]'></div>
                        <div className='w-8 sm:w-12 lg:w-16 h-px bg-gradient-to-l from-transparent to-[#D3A188]'></div>
                    </div>
                    <p className='text-sm sm:text-base lg:text-lg text-gray-400 max-w-2xl mx-auto px-4'>
                        Discover our handpicked selection of premium properties in Dubai and India
                    </p>
                </div>

                {/* Slider Container */}
                <div className='relative'>
                    {/* Slider Wrapper */}
                    <div className='overflow-hidden rounded-xl lg:rounded-2xl'>
                        <div
                            className='flex transition-transform duration-700 ease-in-out'
                            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                        >
                            {Array.from({ length: totalSlides }).map((_, slideIndex) => {
                                const startIdx = slideIndex * slidesToShow;
                                const slideProperties = exclusiveProperties.slice(startIdx, startIdx + slidesToShow);

                                return (
                                    <div
                                        key={slideIndex}
                                        className='min-w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 px-1 sm:px-2'
                                    >
                                        {slideProperties.map((property) => (
                                            <div
                                                key={property.id}
                                                className='backdrop-blur-sm overflow-hidden shadow-2xl h-[400px] sm:h-[500px] md:h-[550px] lg:h-[650px] cursor-pointer rounded-xl'
                                            >
                                                {/* Property Image */}
                                                <div className='relative h-full overflow-hidden'>
                                                    <img
                                                        src={property.image}
                                                        alt={property.title}
                                                        className='w-full h-full object-cover'
                                                    />

                                                    {/* Property Details Overlay at Bottom */}
                                                    <div className='absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-lg p-4 sm:p-5 lg:p-6'>
                                                        <div className='absolute inset-0 bg-black/50'></div>
                                                        <div className='relative space-y-1.5 sm:space-y-2 z-10'>
                                                            <h3 className='text-base sm:text-lg lg:text-xl text-center font-bold text-white mb-1 sm:mb-2 line-clamp-2'>
                                                                {property.title}
                                                            </h3>
                                                            <hr className='border-white border-1' />
                                                            <p className='text-white text-xs sm:text-sm text-center'>
                                                                {property.SubTitle}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Dot Indicators */}
                    <div className='flex justify-center gap-2 mt-6 sm:mt-8'>
                        {Array.from({ length: totalSlides }).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={`h-2 w-2 sm:h-3 sm:w-3 rounded-full transition-all duration-300 ${index === currentSlide
                                    ? 'bg-[#D3A188] w-6 sm:w-8'
                                    : 'bg-gray-600 hover:bg-gray-500'
                                    }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Lifestyle

