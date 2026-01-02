import React, { useState, useEffect, useRef } from 'react'
import { FaAward, FaShieldAlt, FaHandshake, FaChartLine, FaGlobe, FaUsers } from 'react-icons/fa'
import { homeSectionsData } from '../../data/homeSections'
import { useNavigate } from 'react-router-dom'

const WhyChooseUs = ({ selectedCountry }) => {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(false)
    const [counters, setCounters] = useState([0, 0, 0, 0])
    const statsRef = useRef(null)

    const statsData = homeSectionsData[selectedCountry]?.whyChooseUs || homeSectionsData['Dubai'].whyChooseUs;

    const stats = [
        {
            icon: <FaAward className="w-8 h-8" />,
            number: statsData[0].number,
            targetValue: statsData[0].targetValue,
            suffix: "+",
            label: statsData[0].label,
            description: statsData[0].description
        },
        {
            icon: <FaChartLine className="w-8 h-8" />,
            number: statsData[1].number,
            targetValue: statsData[1].targetValue,
            suffix: "+",
            label: statsData[1].label,
            description: statsData[1].description
        },
        {
            icon: <FaUsers className="w-8 h-8" />,
            number: statsData[2].number,
            targetValue: statsData[2].targetValue,
            suffix: "+",
            label: statsData[2].label,
            description: statsData[2].description
        },
        {
            icon: <FaGlobe className="w-8 h-8" />,
            number: statsData[3].number,
            targetValue: statsData[3].targetValue,
            suffix: "+",
            label: statsData[3].label,
            description: statsData[3].description
        }
    ]

    // Intersection Observer to detect when section is visible
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !isVisible) {
                        setIsVisible(true)
                    }
                })
            },
            { threshold: 0.3 }
        )

        if (statsRef.current) {
            observer.observe(statsRef.current)
        }

        return () => {
            if (statsRef.current) {
                observer.unobserve(statsRef.current)
            }
        }
    }, [isVisible])

    // Counter animation
    useEffect(() => {
        if (!isVisible) return

        const duration = 2000 // 2 seconds
        const steps = 60
        const stepDuration = duration / steps
        const intervals = []

        stats.forEach((stat, index) => {
            const targetValue = stat.targetValue
            let currentStep = 0

            const interval = setInterval(() => {
                currentStep++
                const progress = Math.min(currentStep / steps, 1)
                const currentValue = Math.floor(targetValue * progress)

                setCounters((prev) => {
                    const newCounters = [...prev]
                    newCounters[index] = currentValue
                    return newCounters
                })

                if (currentStep >= steps) {
                    clearInterval(interval)
                    setCounters((prev) => {
                        const newCounters = [...prev]
                        newCounters[index] = targetValue
                        return newCounters
                    })
                }
            }, stepDuration)

            intervals.push(interval)
        })

        return () => {
            intervals.forEach(interval => clearInterval(interval))
        }
    }, [isVisible])

    const features = [
        {
            icon: <FaShieldAlt className="w-6 h-6" />,
            title: "100% Verified Properties",
            description: "Every property is thoroughly verified and legally compliant for your peace of mind."
        },
        {
            icon: <FaHandshake className="w-6 h-6" />,
            title: "Transparent Transactions",
            description: "No hidden fees, clear pricing, and honest communication throughout the process."
        },
        {
            icon: <FaAward className="w-6 h-6" />,
            title: "Expert Guidance",
            description: "Our experienced team provides personalized advice to help you make the right decision."
        },
        {
            icon: <FaChartLine className="w-6 h-6" />,
            title: "Best Market Rates",
            description: "Competitive pricing and exclusive deals on premium properties in prime locations."
        },
        {
            icon: <FaGlobe className="w-6 h-6" />,
            title: "Global Network",
            description: "Extensive connections with developers, investors, and property owners worldwide."
        },
        {
            icon: <FaUsers className="w-6 h-6" />,
            title: "24/7 Support",
            description: "Round-the-clock assistance for all your real estate needs and inquiries."
        }
    ]

    return (
        <div className='relative py-12 sm:py-16 lg:py-20 overflow-hidden'>




            <div className='container mx-auto px-4 sm:px-6 md:px-6 relative z-20'>
                {/* Header Section */}
                <div className='text-center mb-10 sm:mb-12 lg:mb-16 pt-4 sm:pt-6 lg:pt-8'>

                    <h1 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-gray-400 mb-4 sm:mb-5 lg:mb-6 leading-tight'>
                        Your Trusted <span className='text-[#D3A188]'>Real Estate</span> Partner
                    </h1>

                    <div className='flex items-center justify-center gap-2 sm:gap-3 lg:gap-4 mb-6 sm:mb-7 lg:mb-8'>
                        <div className='w-8 sm:w-12 lg:w-16 h-px bg-gradient-to-r from-transparent to-[#D3A188]'></div>
                        <div className='w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#D3A188]'></div>
                        <div className='w-8 sm:w-12 lg:w-16 h-px bg-gradient-to-l from-transparent to-[#D3A188]'></div>
                    </div>

                    <p className='text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light px-4'>
                        Experience excellence in real estate with our proven track record, transparent processes, and commitment to your success.
                    </p>
                </div>

                {/* Statistics Section */}
                <div ref={statsRef} className='grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 mb-12 sm:mb-16 lg:mb-20'>
                    {stats.map((stat, index) => {
                        const displayValue = counters[index].toLocaleString()
                        return (
                            <div
                                key={index}
                                className='backdrop-blur-sm rounded-xl lg:rounded-2xl p-4 sm:p-5 lg:p-6 border border-[#D3A188]/20 text-center hover:border-[#D3A188]/40 transition-all duration-300'
                            >
                                <div className='flex justify-center mb-2 sm:mb-3 lg:mb-4 text-[#D3A188]'>
                                    <div className='w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8'>
                                        {stat.icon}
                                    </div>
                                </div>
                                <div className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gray-400 mb-1 sm:mb-2 font-bold'>
                                    {displayValue}{stat.suffix}
                                </div>
                                <div className='text-sm sm:text-base lg:text-lg text-gray-400 mb-0.5 sm:mb-1'>
                                    {stat.label}
                                </div>
                                <div className='text-xs sm:text-sm text-gray-400'>
                                    {stat.description}
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Features Grid */}
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6'>
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className='group backdrop-blur-sm rounded-xl p-4 sm:p-5 lg:p-6 border border-[#D3A188]/20 hover:border-[#D3A188]/40 hover:shadow-lg hover:shadow-[#D3A188]/10 transition-all duration-300'
                        >
                            <div className='flex items-start gap-3 sm:gap-4'>
                                <div className='flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 bg-[#D3A188]/20 rounded-lg flex items-center justify-center text-[#D3A188] group-hover:bg-[#D3A188]/30 transition-colors'>
                                    <div className='w-5 h-5 sm:w-6 sm:h-6'>
                                        {feature.icon}
                                    </div>
                                </div>
                                <div className='flex-1'>
                                    <h3 className='text-base sm:text-lg lg:text-xl text-gray-400 mb-1.5 sm:mb-2'>
                                        {feature.title}
                                    </h3>
                                    <p className='text-sm sm:text-base text-gray-300 leading-relaxed'>
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom CTA Section */}
                <div className='mt-12 sm:mt-16 lg:mt-20 text-center'>
                    <div className='inline-block backdrop-blur-sm rounded-xl lg:rounded-2xl p-6 sm:p-7 lg:p-8 border border-[#D3A188]/30 max-w-3xl mx-4'>
                        <h2 className='text-xl sm:text-2xl md:text-3xl lg:text-4xl text-gray-400 mb-3 sm:mb-4'>
                            Ready to Find Your Dream Property?
                        </h2>
                        <p className='text-sm sm:text-base lg:text-lg text-gray-300 mb-4 sm:mb-5 lg:mb-6'>
                            Let our experts guide you through your real estate journey with personalized service and unmatched expertise.
                        </p>
                        <div className='flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4'>
                            <button onClick={() => navigate('/properties')} className='px-6 sm:px-8 py-2.5 sm:py-3 bg-[#D3A188] text-black font-semibold rounded-lg hover:bg-[#D3A188]/80 transition-colors text-sm sm:text-base'>
                                Explore Properties
                            </button>
                            <button onClick={() => navigate('/contact')} className='px-6 sm:px-8 py-2.5 sm:py-3 bg-transparent border-2 border-[#D3A188] text-[#D3A188] font-semibold rounded-lg hover:bg-[#D3A188]/10 transition-colors text-sm sm:text-base'>
                                Contact Us
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WhyChooseUs

