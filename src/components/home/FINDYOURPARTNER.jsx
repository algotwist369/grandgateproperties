import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { motion, AnimatePresence } from "framer-motion";
import { homeSectionsData } from '../../data/homeSections';

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
    const rotatedAgents = [
      ...agents.slice(currentSlide % agents.length),
      ...agents.slice(0, currentSlide % agents.length)
    ];

    if (isMobile) {
      return rotatedAgents.slice(0, 1);
    } else if (isTablet) {
      return rotatedAgents.slice(0, 2);
    } else {
      return rotatedAgents.slice(0, 4);
    }
  };

  const displayAgents = getDisplayAgents();


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
    <div className="relative py-24 sm:py-32 overflow-hidden bg-black">
      {/* Background Accent */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-[#D3A188]/5 blur-[120px] rounded-full"></div>

      <div className="container mx-auto px-6 lg:px-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left Side - Agents Stack with Motion */}
          <div className="relative h-[600px] sm:h-[700px] flex items-center justify-center order-2 lg:order-1">
            <div className="relative w-full max-w-md h-full flex items-center justify-center">
              <AnimatePresence mode="popLayout">
                {displayAgents.map((agent, index) => {
                  const isMain = index === 0;

                  return (
                    <motion.div
                      key={agent.id}
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
                      onClick={() => isMain ? navigate(`/en/agents/${agent.id}`) : nextSlide()}
                    >
                      <div className={`relative group rounded-[2.5rem] overflow-hidden border transition-all duration-500 cursor-pointer ${isMain ? 'border-[#D3A188] shadow-2xl shadow-[#D3A188]/10' : 'border-white/10'
                        }`}>
                        <div className="aspect-[3/4] overflow-hidden">
                          <img
                            src={agent.image}
                            alt={agent.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 p-8 pt-20">
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-2"
                          >
                            <p className="text-[10px] uppercase tracking-[0.4em] text-[#D3A188] font-medium">{agent.position}</p>
                            <h3 className="text-2xl font-light text-white uppercase tracking-tight">{agent.name}</h3>
                            <div className="pt-4 flex flex-wrap gap-2">
                              {agent.languages.slice(0, 2).map((lang, idx) => (
                                <span key={idx} className="px-3 py-1 rounded-full border border-white/10 text-[9px] uppercase tracking-widest text-gray-400">
                                  {lang}
                                </span>
                              ))}
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
            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-8">
              <button onClick={prevSlide} className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white hover:border-[#D3A188] hover:text-[#D3A188] transition-all">
                <IoIosArrowBack />
              </button>
              <div className="flex gap-2">
                {agents.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1 transition-all duration-500 rounded-full ${idx === currentSlide ? 'w-8 bg-[#D3A188]' : 'w-2 bg-white/10'}`}
                  />
                ))}
              </div>
              <button onClick={nextSlide} className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white hover:border-[#D3A188] hover:text-[#D3A188] transition-all">
                <IoIosArrowForward />
              </button>
            </div>
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
                <div className="w-12 h-px bg-[#D3A188]"></div>
                <span className="text-xs uppercase tracking-[0.5em] text-[#D3A188] font-medium">Expert Consultation</span>
              </div>
              <h2 className="text-5xl lg:text-7xl font-light text-white uppercase tracking-tighter leading-[0.9]">
                Find your <br />
                <span className="text-[#D3A188] font-medium italic">Perfect Partner</span>
              </h2>
            </div>

            <div className="space-y-8">
              <p className="text-gray-400 text-lg lg:text-xl font-light leading-relaxed">
                Connect with our elite team of real estate strategists who speak your language and share your vision. We don't just find properties; we secure your future in Dubai's most exclusive landscapes.
              </p>
              <p className="text-gray-500 text-base font-light italic leading-relaxed border-l-2 border-[#D3A188]/30 pl-6">
                "Our mission is to bridge the gap between global ambition and local opportunity through radical transparency and unmatched expertise."
              </p>
            </div>

            <div className="pt-4">
              <button
                onClick={() => navigate('/en/agents')}
                className="group relative px-10 py-5 bg-white text-black text-xs uppercase tracking-[0.3em] font-bold overflow-hidden rounded-2xl transition-all hover:bg-[#D3A188] hover:text-white"
              >
                <span className="relative z-10">Discover All Experts</span>
                <div className="absolute inset-0 bg-black scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 opacity-10"></div>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default FINDYOURPARTNER;