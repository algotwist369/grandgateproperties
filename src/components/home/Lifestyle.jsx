import React, { useMemo } from 'react'
import { homeSectionsData } from '../../data/homeSections'
import { motion } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

const Lifestyle = ({ selectedCountry }) => {
    // Dynamic lifestyle data
    const exclusiveProperties = homeSectionsData[selectedCountry]?.lifestyle || homeSectionsData['Dubai'].lifestyle;

    return (
        <section className='relative py-24 lg:py-40 bg-[#0B0D10] overflow-hidden'>
            <div className='max-w-[99rem] mx-auto px-6 relative z-20'>
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
                <div className='relative lifestyle-swiper overflow-hidden'>
                    <Swiper
                        modules={[Pagination, Autoplay]}
                        spaceBetween={40}
                        slidesPerView={1}
                        loop={true}
                        autoplay={{
                            delay: 3000,
                            disableOnInteraction: false,
                        }}
                        pagination={{
                            clickable: true,
                            enabled: true,
                            bulletClass: 'swiper-pagination-bullet !w-4 !h-1.5 !rounded-full !bg-white/10 !opacity-100 !transition-all !duration-500 hover:!bg-white/20',
                            bulletActiveClass: '!w-12 !bg-[#D3A188]',
                        }}
                        breakpoints={{
                            640: {
                                slidesPerView: 1,
                            },
                            768: {
                                slidesPerView: 2,
                            },
                            1024: {
                                slidesPerView: 3,
                            },
                        }}
                        className="!pb-20 !overflow-visible"
                    >
                        {exclusiveProperties.map((property, idx) => (
                            <SwiperSlide key={property.id || idx} className="h-auto">
                                <motion.div
                                    className='group relative aspect-[3/4] sm:aspect-[4/5] lg:aspect-[3/4.5] overflow-hidden rounded-3xl cursor-pointer bg-gray-900 border border-white/5'
                                    whileHover={{ y: -10 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    <img
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
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </section>
    )
}

export default Lifestyle
