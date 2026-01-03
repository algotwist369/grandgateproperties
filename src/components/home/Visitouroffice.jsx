import React, { useState } from 'react'
import { homeSectionsData } from '../../data/homeSections'
import { motion, AnimatePresence } from 'framer-motion'

const Visitouroffice = ({ selectedCountry }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const officeImages = homeSectionsData[selectedCountry]?.offices || homeSectionsData['Dubai'].offices;

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % officeImages.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + officeImages.length) % officeImages.length);

  return (
    <section className='relative py-24 lg:py-40 bg-black overflow-hidden'>
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
            Visit Our <span className='text-[#D3A188] font-medium'>Office</span>
          </h2>

          <div className='flex items-center justify-center gap-4 mb-8'>
            <div className='w-20 h-px bg-gradient-to-r from-transparent to-[#D3A188]/50'></div>
            <div className='w-2 h-2 rounded-full border border-[#D3A188]'></div>
            <div className='w-20 h-px bg-gradient-to-l from-transparent to-[#D3A188]/50'></div>
          </div>

          <p className='text-lg lg:text-xl text-gray-400 font-light max-w-3xl mx-auto leading-relaxed'>
            Experience luxury real estate services in world-class facilities designed for excellence across <span className='text-white font-medium'>Dubai</span> and <span className='text-white font-medium'>India</span>.
          </p>
        </motion.div>

        {/* Slider Container */}
        <div className='relative flex items-center justify-center min-h-[500px] lg:min-h-[700px]'>
          <AnimatePresence initial={false} mode='popLayout'>
            {[-1, 0, 1].map((offset) => {
              const index = (currentIndex + offset + officeImages.length) % officeImages.length;
              const office = officeImages[index];
              const isMiddle = offset === 0;

              return (
                <motion.div
                  key={office.id}
                  initial={{ opacity: 0, scale: 0.8, x: offset * 300 }}
                  animate={{
                    opacity: isMiddle ? 1 : 0.4,
                    scale: isMiddle ? 1 : 0.8,
                    x: offset * (window.innerWidth < 1024 ? 200 : 400),
                    zIndex: isMiddle ? 10 : 0
                  }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
                  className='absolute w-[300px] h-[450px] sm:w-[400px] sm:h-[550px] lg:w-[600px] lg:h-[750px]'
                >
                  <div className={`relative w-full h-full rounded-[2rem] overflow-hidden group ${isMiddle ? 'cursor-default ring-1 ring-white/20' : 'cursor-pointer'}`}
                    onClick={() => !isMiddle && (offset < 0 ? prevSlide() : nextSlide())}>

                    {/* Image */}
                    <img
                      src={office.image}
                      alt={office.title}
                      className='w-full h-full object-cover'
                    />

                    {/* Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent transition-opacity duration-500 ${isMiddle ? 'opacity-90' : 'opacity-60'}`}></div>

                    {/* Content */}
                    {isMiddle && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className='absolute bottom-0 left-0 right-0 p-10 sm:p-12'
                      >
                        <div className="flex items-end justify-between">
                          <div className="space-y-4">
                            <div className="flex items-center gap-3">
                              <div className="w-1 h-8 bg-[#D3A188]"></div>
                              <h3 className='text-2xl sm:text-4xl font-light text-white tracking-wider uppercase'>
                                {office.title}
                              </h3>
                            </div>
                            <p className='text-gray-400 text-sm sm:text-base tracking-widest uppercase font-light'>
                              Exclusive Global Headquarters
                            </p>
                          </div>

                          <div className='w-16 h-16 rounded-full border border-white/20 flex items-center justify-center hover:bg-[#D3A188] hover:border-[#D3A188] transition-all duration-300 group'>
                            <svg className='w-6 h-6 text-white group-hover:scale-110 transition-transform' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' />
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
                            </svg>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Navigation - Minimal Dots */}
        <div className='flex justify-center gap-3 mt-12'>
          {officeImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 transition-all duration-500 rounded-full ${idx === currentIndex ? 'w-12 bg-[#D3A188]' : 'w-4 bg-white/10'}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Visitouroffice;