import React, { useState, useEffect, useRef } from 'react';
import { FaAward, FaShieldAlt, FaHandshake, FaChartLine, FaGlobe, FaUsers } from 'react-icons/fa';
import { motion, useInView, useSpring, useTransform } from "framer-motion";
import { homeSectionsData } from '../../data/homeSections';
import { useNavigate } from 'react-router-dom';

const Counter = ({ value, suffix }) => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true });

    const spring = useSpring(0, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const displayValue = useTransform(spring, (current) =>
        Math.floor(current).toLocaleString()
    );

    useEffect(() => {
        if (inView) {
            spring.set(value);
        }
    }, [inView, value, spring]);

    return (
        <span ref={ref}>
            <motion.span>{displayValue}</motion.span>
            {suffix}
        </span>
    );
};

const WhyChooseUs = ({ selectedCountry }) => {
    const navigate = useNavigate();
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
    ];

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
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    return (
        <div className="relative py-24 sm:py-32 overflow-hidden bg-black">
            {/* Background Decorative Element */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D3A188]/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2"></div>

            <div className="container mx-auto px-6 lg:px-8 relative z-20">
                {/* Header Section */}
                <motion.div
                    className="text-center mb-24"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="flex items-center justify-center gap-4 mb-6">
                        <div className="w-12 h-px bg-[#D3A188]"></div>
                        <span className="text-xs uppercase tracking-[0.5em] text-[#D3A188] font-medium">Proven Excellence</span>
                        <div className="w-12 h-px bg-[#D3A188]"></div>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-light text-white uppercase tracking-tighter mb-8 leading-none">
                        Your Trusted <br />
                        <span className="text-[#D3A188] font-medium italic">Strategic Partner</span>
                    </h1>

                    <p className="text-gray-400 max-w-2xl mx-auto text-lg font-light leading-relaxed">
                        Experience precision in real estate with our elite track record, radical transparency, and unwavering commitment to your investment success.
                    </p>
                </motion.div>

                {/* Statistics Section */}
                <motion.div
                    className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-32"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                >
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            className="relative group p-10 rounded-[2.5rem] border border-white/10 bg-white/5 hover:border-[#D3A188]/30 transition-all duration-500 text-center"
                        >
                            <div className="flex justify-center mb-6 text-[#D3A188] opacity-50 group-hover:opacity-100 transition-opacity">
                                {stat.icon}
                            </div>
                            <div className="text-4xl sm:text-5xl font-light text-white mb-2 tracking-tighter">
                                <Counter value={stat.targetValue} suffix={stat.suffix} />
                            </div>
                            <div className="text-[10px] uppercase tracking-[0.3em] text-[#D3A188] mb-1 font-medium">
                                {stat.label}
                            </div>
                            <div className="text-xs text-gray-500 uppercase tracking-widest">
                                {stat.description}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Features Grid */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            className="group p-8 rounded-[2rem] border border-white/10 bg-white/5 hover:bg-white/10 hover:border-[#D3A188]/20 transition-all duration-500"
                        >
                            <div className="flex items-start gap-6">
                                <div className="w-12 h-12 rounded-2xl bg-[#D3A188]/10 flex items-center justify-center text-[#D3A188] group-hover:bg-[#D3A188] group-hover:text-black transition-all duration-500 shrink-0">
                                    {feature.icon}
                                </div>
                                <div className="space-y-3">
                                    <h3 className="text-xl font-light text-white uppercase tracking-widest">
                                        {feature.title}
                                    </h3>
                                    <p className="text-sm text-gray-400 font-light leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Bottom CTA */}
                <motion.div
                    className="mt-32 text-center"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="relative inline-block group px-12 py-16 sm:px-20 sm:py-24 rounded-[3rem] overflow-hidden">
                        <div className="absolute inset-0 bg-white/5 backdrop-blur-3xl border border-white/10"></div>
                        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-[#D3A188] to-transparent opacity-50"></div>

                        <div className="relative z-10 max-w-2xl">
                            <h2 className="text-3xl sm:text-5xl font-light text-white uppercase tracking-tighter mb-8">
                                Ready to find your <span className="text-[#D3A188] italic font-medium">Dream Property?</span>
                            </h2>
                            <p className="text-gray-400 text-lg font-light mb-12">
                                Let our bespoke advisors curate the perfect portfolio for your lifestyle and legacy.
                            </p>
                            <div className="flex flex-col sm:flex-row justify-center gap-4">
                                <button
                                    onClick={() => navigate('/en/properties')}
                                    className="px-10 py-5 bg-white text-black text-xs uppercase tracking-[0.3em] font-bold rounded-2xl hover:bg-[#D3A188] hover:text-white transition-all shadow-xl shadow-black/20"
                                >
                                    Explore Portfolio
                                </button>
                                <button
                                    onClick={() => navigate('/en/contact')}
                                    className="px-10 py-5 bg-transparent border border-white/20 text-white text-xs uppercase tracking-[0.3em] font-bold rounded-2xl hover:bg-white/5 transition-all"
                                >
                                    Contact Advisory
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default WhyChooseUs;
