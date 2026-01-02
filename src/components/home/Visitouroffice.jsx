import React, { useState, useRef } from 'react'
import { homeSectionsData } from '../../data/homeSections'

const Visitouroffice = ({ selectedCountry }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const sliderRef = useRef(null);

  const officeImages = homeSectionsData[selectedCountry]?.offices || homeSectionsData['Dubai'].offices;

  // Get visible images (current, previous, next)
  const getVisibleImages = () => {
    const prevIndex = (currentIndex - 1 + officeImages.length) % officeImages.length;
    const nextIndex = (currentIndex + 1) % officeImages.length;
    return [
      officeImages[prevIndex],
      officeImages[currentIndex],
      officeImages[nextIndex]
    ];
  };

  const visibleImages = getVisibleImages();

  // Mouse drag handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setCurrentX(e.clientX);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setCurrentX(e.clientX);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    const diff = startX - currentX;
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        // Swiped left - go to next
        setCurrentIndex((prev) => (prev + 1) % officeImages.length);
      } else {
        // Swiped right - go to previous
        setCurrentIndex((prev) => (prev - 1 + officeImages.length) % officeImages.length);
      }
    }

    setIsDragging(false);
    setStartX(0);
    setCurrentX(0);
  };

  // Touch handlers
  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setCurrentX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    setCurrentX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    const diff = startX - currentX;
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        // Swiped left - go to next
        setCurrentIndex((prev) => (prev + 1) % officeImages.length);
      } else {
        // Swiped right - go to previous
        setCurrentIndex((prev) => (prev - 1 + officeImages.length) % officeImages.length);
      }
    }

    setIsDragging(false);
    setStartX(0);
    setCurrentX(0);
  };

  // Click handlers for side images
  const handleImageClick = (index, e) => {
    if (isDragging) {
      e.preventDefault();
      return;
    }
    if (index === 0) {
      // Clicked left image - go to previous
      setCurrentIndex((prev) => (prev - 1 + officeImages.length) % officeImages.length);
    } else if (index === 2) {
      // Clicked right image - go to next
      setCurrentIndex((prev) => (prev + 1) % officeImages.length);
    }
  };

  return (
    <div className='relative py-12 sm:py-16 md:py-24 lg:py-32 overflow-hidden'>
      <div className='container mx-auto px-4 sm:px-6 md:px-6 relative z-20'>
        {/* Header Section */}
        <div className='text-center mb-12 sm:mb-16 lg:mb-20'>
          <h1 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gray-400 leading-tight sm:leading-[40px] lg:leading-[50px] mb-3 sm:mb-4'>
            Visit Our{' '}
            <span className='relative inline-block'>
              <span className='relative z-10 text-[#D3A188]'>Office</span>
            </span>
          </h1>

          <div className='flex items-center justify-center gap-2 sm:gap-3 lg:gap-4 mb-6 sm:mb-8'>
            <div className='w-8 sm:w-12 lg:w-16 h-px bg-gradient-to-r from-transparent to-[#D3A188]'></div>
            <div className='w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#D3A188]'></div>
            <div className='w-8 sm:w-12 lg:w-16 h-px bg-gradient-to-l from-transparent to-[#D3A188]'></div>
          </div>

          <p className='text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light px-4'>
            Explore our premium offices across <span className='text-[#D3A188] font-medium'>Dubai</span>, <span className='text-[#D3A188] font-medium'>UAE</span> and <span className='text-[#D3A188] font-medium'>India</span>. Experience luxury real estate services in world-class facilities designed for excellence.
          </p>
        </div>

        {/* Slider Container */}
        <div className='relative py-6 sm:py-8 lg:py-12'>
          {/* Decorative Side Elements */}
          <div className='absolute left-0 top-1/2 -translate-y-1/2 hidden lg:block'>
            <div className='w-px h-32 bg-gradient-to-b from-transparent via-[#D3A188]/30 to-transparent'></div>
          </div>
          <div className='absolute right-0 top-1/2 -translate-y-1/2 hidden lg:block'>
            <div className='w-px h-32 bg-gradient-to-b from-transparent via-[#D3A188]/30 to-transparent'></div>
          </div>

          <div
            ref={sliderRef}
            className='flex items-center justify-center gap-3 sm:gap-4 md:gap-6 lg:gap-10 xl:gap-16 select-none min-h-[400px] sm:min-h-[500px] md:min-h-[600px] lg:min-h-[750px]'
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          >
            {visibleImages.map((office, index) => {
              const isMiddle = index === 1;

              return (
                <div
                  key={`${office.id}-${index}`}
                  onClick={(e) => handleImageClick(index, e)}
                  className={`relative ${isMiddle
                    ? 'w-[280px] h-[350px] sm:w-[380px] sm:h-[450px] md:w-[480px] md:h-[580px] lg:w-[580px] lg:h-[680px] scale-100 z-10 cursor-default'
                    : 'hidden sm:block w-[200px] h-[280px] sm:w-[240px] sm:h-[320px] md:w-[340px] md:h-[450px] scale-80 opacity-50 z-0 cursor-pointer'
                    }`}
                >
                  {/* Outer Glow Ring */}
                  {isMiddle && (
                    <div className='absolute -inset-4 rounded-3xl bg-gradient-to-r from-[#D3A188]/30 via-[#D3A188]/10 to-[#D3A188]/30 blur-2xl'></div>
                  )}

                  {/* Card with enhanced styling */}
                  <div className={`relative w-full h-full rounded-3xl overflow-hidden ${isMiddle
                    ? 'shadow-[0_0_60px_rgba(211,161,136,0.4),0_30px_80px_rgba(0,0,0,0.5)] ring-[3px] ring-[#D3A188]/60'
                    : 'shadow-[0_20px_60px_rgba(0,0,0,0.4)]'
                    }`}>
                    {/* Image Container */}
                    <div className='relative w-full h-full'>
                      <img
                        src={office.image}
                        alt={office.title}
                        className={`w-full h-full object-cover pointer-events-none ${isMiddle ? 'scale-100' : 'scale-110'
                          }`}
                        draggable={false}
                      />

                      {/* Multi-layer Gradient Overlay */}
                      <div className='absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent'></div>
                      <div className='absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80'></div>

                      {/* Decorative Corner Elements */}
                      {isMiddle && (
                        <>
                          <div className='absolute top-3 left-3 sm:top-4 sm:left-4 lg:top-6 lg:left-6 w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16'>
                            <div className='absolute top-0 left-0 w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 border-t-2 border-l-2 border-[#D3A188] opacity-80'></div>
                            <div className='absolute top-0 left-0 w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 border-t border-l border-[#D3A188] opacity-60'></div>
                          </div>
                          <div className='absolute top-3 right-3 sm:top-4 sm:right-4 lg:top-6 lg:right-6 w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16'>
                            <div className='absolute top-0 right-0 w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 border-t-2 border-r-2 border-[#D3A188] opacity-80'></div>
                            <div className='absolute top-0 right-0 w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 border-t border-r border-[#D3A188] opacity-60'></div>
                          </div>
                          <div className='absolute bottom-3 left-3 sm:bottom-4 sm:left-4 lg:bottom-6 lg:left-6 w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16'>
                            <div className='absolute bottom-0 left-0 w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 border-b-2 border-l-2 border-[#D3A188] opacity-80'></div>
                            <div className='absolute bottom-0 left-0 w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 border-b border-l border-[#D3A188] opacity-60'></div>
                          </div>
                          <div className='absolute bottom-3 right-3 sm:bottom-4 sm:right-4 lg:bottom-6 lg:right-6 w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16'>
                            <div className='absolute bottom-0 right-0 w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 border-b-2 border-r-2 border-[#D3A188] opacity-80'></div>
                            <div className='absolute bottom-0 right-0 w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 border-b border-r border-[#D3A188] opacity-60'></div>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Enhanced Title Overlay */}
                    <div className={`absolute bottom-0 left-0 right-0 ${isMiddle ? 'p-4 sm:p-5 md:p-6 lg:p-8' : 'p-4 sm:p-5 md:p-6'
                      } bg-gradient-to-t from-black via-black/95 to-black/80 backdrop-blur-sm`}>
                      <div className='flex items-end justify-between gap-2 sm:gap-3 lg:gap-4'>
                        <div className='flex-1'>
                          <div className='flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2'>
                            <div className='w-0.5 sm:w-1 h-4 sm:h-5 lg:h-6 bg-[#D3A188]'></div>
                            <h3 className={`font-bold text-white ${isMiddle ? 'text-lg sm:text-xl md:text-2xl lg:text-3xl' : 'text-base sm:text-lg md:text-xl'
                              }`}>
                              {office.title}
                            </h3>
                          </div>
                          <p className={`text-gray-300 ml-2 sm:ml-3 ${isMiddle ? 'text-xs sm:text-sm md:text-base' : 'text-xs sm:text-sm'
                            }`}>
                            Premium Real Estate Services
                          </p>
                          {isMiddle && (
                            <div className='mt-2 sm:mt-3 lg:mt-4 flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-400'>
                              <div className='flex items-center gap-1.5 sm:gap-2'>
                                <svg className='w-3 h-3 sm:w-4 sm:h-4 text-[#D3A188]' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
                                </svg>
                                <span>Mon - Sat: 9AM - 6PM</span>
                              </div>
                            </div>
                          )}
                        </div>
                        {isMiddle && (
                          <div className='flex-shrink-0'>
                            <div className='w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full bg-gradient-to-br from-[#D3A188] to-[#b8876a] flex items-center justify-center shadow-lg shadow-[#D3A188]/30'>
                              <svg className='w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' />
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
                              </svg>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Additional Glow Layers for Middle Card */}
                  {isMiddle && (
                    <>
                      <div className='absolute inset-0 rounded-3xl bg-gradient-to-r from-[#D3A188]/15 via-transparent to-[#D3A188]/15 blur-2xl -z-10'></div>
                      <div className='absolute -inset-2 rounded-3xl bg-gradient-to-br from-[#D3A188]/10 to-transparent blur-xl -z-20'></div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Visitouroffice