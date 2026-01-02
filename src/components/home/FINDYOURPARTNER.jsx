import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../common/Button'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'
import { homeSectionsData } from '../../data/homeSections'

const FINDYOURPARTNER = ({ selectedCountry }) => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  const agents = homeSectionsData[selectedCountry]?.partners || homeSectionsData['Dubai'].partners;

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

  // Rotate all agents and bring current one to front
  const getDisplayAgents = () => {
    // Rotate agents array based on currentSlide
    const rotatedAgents = [
      ...agents.slice(currentSlide % agents.length),
      ...agents.slice(0, currentSlide % agents.length)
    ];

    // On mobile, show only 1 card, on tablet show 2, on desktop show 4
    if (isMobile) {
      return rotatedAgents.slice(0, 1);
    } else if (isTablet) {
      return rotatedAgents.slice(0, 2);
    } else {
      return rotatedAgents.slice(0, 4);
    }
  };

  const displayAgents = getDisplayAgents();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % agents.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [agents.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % agents.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + agents.length) % agents.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className='relative py-8 sm:py-12 lg:py-16'>
      {/* Top Blur Gradient Overlay */}

      <div className='container mx-auto px-4 sm:px-6 lg:px-4 relative z-20'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center'>
          {/* Left Side - Agents Slider with Overlapping Cards */}
          <div className='relative h-[500px] sm:h-[550px] md:h-[600px] lg:h-[700px] flex items-center justify-center order-2 lg:order-1'>
            <div className='relative w-full max-w-lg h-full'>
              {displayAgents.map((agent, index) => {
                const isMain = index === 0; // First card (current slide) is always on top
                // Current card always on top, others stack behind
                const zIndex = isMain ? 50 : 30 + (4 - index);
                // Offset cards to create overlap effect - more visible on right, less on mobile
                const translateX = isMain ? 0 : (isMobile ? index * 10 : index * 50);
                const translateY = isMain ? 0 : (isMobile ? index * 5 : index * 20);
                // Scale down cards behind - less scaling on mobile
                const scale = isMain ? 1 : (isMobile ? 0.95 : Math.max(0.85, 0.95 - index * 0.05));
                // Reduce opacity for cards behind - less opacity reduction on mobile
                const opacity = isMain ? 1 : (isMobile ? 0.8 : Math.max(0.5, 0.9 - index * 0.15));

                // Find the original index of this agent in the agents array
                const originalIndex = agents.findIndex(a => a.id === agent.id);

                return (
                  <div
                    key={`${agent.id}-${currentSlide}`}
                    className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm sm:max-w-md transition-all duration-700 ease-in-out cursor-pointer'
                    style={{
                      zIndex: zIndex,
                      transform: `translate(-50%, -50%) translateX(${translateX}px) translateY(${translateY}px) scale(${scale})`,
                      opacity: opacity
                    }}
                    onClick={() => {
                      // Calculate how many slides to move to bring this agent to front
                      const targetIndex = originalIndex;
                      setCurrentSlide(targetIndex);
                    }}
                  >
                    <div
                      className={`relative rounded-xl overflow-hidden shadow-2xl border transition-all duration-300 ${isMain
                        ? 'border-[#D3A188] border-2 shadow-[#D3A188]/40 bg-[#114566]/40'
                        : 'border-[#D3A188]/30 bg-[#114566]/30 hover:border-[#D3A188]/50'
                        }`}
                    >

                      {/* Agent Image */}
                      <div className='relative h-[280px] sm:h-[320px] md:h-[360px] lg:h-[400px] overflow-hidden'>
                        <img
                          src={agent.image}
                          alt={agent.name}
                          className='w-full h-full object-cover'
                        />
                        <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent'></div>
                      </div>

                      {/* Agent Details */}
                      <div className='p-4 sm:p-5 backdrop-blur-lg'>
                        <h3 className='text-lg sm:text-xl font-bold text-white mb-1'>
                          {agent.name}
                        </h3>
                        <p className='text-xs sm:text-sm text-[#D3A188] mb-2 sm:mb-3'>
                          {agent.position}
                        </p>

                        <div className='space-y-2 text-xs text-gray-300'>
                          <div className='flex items-center gap-2'>
                            <span className='text-xs sm:text-sm'>{agent.experience}</span>
                          </div>

                          <div className='flex items-start gap-2'>
                            <div className='flex flex-wrap gap-1'>
                              {agent.languages.map((lang, idx) => (
                                <span key={idx} className='bg-[#D3A188]/20 text-[#D3A188] px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-xs'>
                                  {lang}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Navigation Arrows - Desktop */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevSlide();
              }}
              className='hidden lg:flex absolute left-20 top-1/2 -translate-y-1/2 z-50 text-[#D3A188] p-3 rounded-full transition-all duration-300 backdrop-blur-sm border border-[#D3A188]/30 hover:border-[#D3A188] shadow-lg hover:scale-110'
              aria-label="Previous slide"
            >
              <IoIosArrowBack size={24} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextSlide();
              }}
              className='hidden lg:flex absolute -right-8 top-1/2 -translate-y-1/2 z-50 text-[#D3A188] p-3 rounded-full transition-all duration-300 backdrop-blur-sm border border-[#D3A188]/30 hover:border-[#D3A188] shadow-lg hover:scale-110'
              aria-label="Next slide"
            >
              <IoIosArrowForward size={24} />
            </button>

            {/* Navigation Arrows - Mobile/Tablet */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevSlide();
              }}
              className='lg:hidden flex absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-50 text-[#D3A188] p-2 sm:p-2.5 rounded-full transition-all duration-300 backdrop-blur-sm border border-[#D3A188]/30 hover:border-[#D3A188] shadow-lg bg-black/20'
              aria-label="Previous slide"
            >
              <IoIosArrowBack size={20} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextSlide();
              }}
              className='lg:hidden flex absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-50 text-[#D3A188] p-2 sm:p-2.5 rounded-full transition-all duration-300 backdrop-blur-sm border border-[#D3A188]/30 hover:border-[#D3A188] shadow-lg bg-black/20'
              aria-label="Next slide"
            >
              <IoIosArrowForward size={20} />
            </button>

            {/* Dot Indicators */}
            <div className='absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 flex justify-center gap-2'>
              {Array.from({ length: agents.length }).map((_, index) => (
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

          {/* Right Side - Content */}
          <div className='space-y-6 sm:space-y-7 lg:space-y-8 order-1 lg:order-2'>
            {/* Heading */}
            <div className='space-y-3 sm:space-y-4'>
              <h2 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gray-400 leading-tight sm:leading-[40px] lg:leading-[50px]'>
                FIND YOUR PERFECT REAL ESTATE
                <span className='relative z-10 text-[#D3A188]'> PARTNER</span>
              </h2>
            </div>

            {/* Description */}
            <div className='space-y-3 sm:space-y-4'>
              <p className='text-sm sm:text-base lg:text-lg text-gray-400 leading-relaxed'>
                Connect with our team of expert real estate professionals who understand your needs and speak your language. Our agents are experienced, multilingual, and dedicated to helping you find the perfect property.
              </p>
              <p className='text-sm sm:text-base lg:text-lg text-gray-400 leading-relaxed'>
                Whether you're buying your first home, investing in luxury properties, or looking for commercial spaces, our team has the expertise and local knowledge to guide you through every step.
              </p>
            </div>

            {/* Show All Button */}
            <div>
              <Button
                text="Show All Agents"
                className='w-full sm:w-auto min-w-[200px] text-xs sm:text-sm lg:text-base px-3 py-2 sm:px-4 sm:py-2.5'
                onClick={() => navigate('/en/agents')}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FINDYOURPARTNER