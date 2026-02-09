import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { IoDiamondOutline, IoGlobeOutline, IoPeopleOutline, IoTimeOutline } from 'react-icons/io5';

const AboutPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const stats = [
        { label: "Years of Excellence", value: "15+", icon: <IoTimeOutline /> },
        { label: "Property Sales", value: "$2B+", icon: <IoDiamondOutline /> },
        { label: "Happy Clients", value: "5000+", icon: <IoPeopleOutline /> },
        { label: "Global Offices", value: "2", icon: <IoGlobeOutline /> },
    ];

    return (
        <div className="bg-black min-h-screen">
            {/* Hero Section */}
            <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://res.cloudinary.com/dcm79v527/image/upload/v1770633450/dubai_image_id5mv5.jpg"
                        alt="About Grand Gate"
                        className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black"></div>
                </div>

                <div className="container mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-5xl md:text-7xl lg:text-8xl text-white font-light uppercase tracking-tighter mb-6">
                            About <span className="text-[#BD9B5F] font-medium font-serif italic">Us</span>
                        </h1>
                        <p className="text-gray-300 text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed">
                            Redefining luxury real estate with a legacy of trust, excellence, and global expertise.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Company Overview */}
            <section className="py-20 lg:py-32">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="space-y-8"
                        >
                            <h2 className='text-3xl sm:text-4xl lg:text-5xl text-white font-light leading-tight tracking-tight uppercase'>
                                The <span className="text-[#BD9B5F] font-medium">Grand Gate</span> Legacy
                            </h2>
                            <div className="space-y-6 text-gray-400 text-lg font-light leading-relaxed">
                                <p>
                                    Established with a vision to transform the real estate landscape, Grand Gate Properties has evolved into a premier consultancy firm in Dubai. We specialize in effective and immediate value creation, offering a bespoke experience that transcends traditional property transactions.
                                </p>
                                <p>
                                    Our deep-rooted understanding of the local market, combined with our global reach, positions us uniquely to serve a diverse clientele. Whether you are looking for a high-yield investment, a holiday home, or a permanent residence, our team of dedicated experts guides you through every step with transparency and integrity.
                                </p>
                                <p>
                                    At Grand Gate, we don't just sell properties; we curate lifestyles and build lasting relationships based on trust and mutual success.
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative"
                        >
                            <div className="relative z-10 rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                                <img
                                    src="https://res.cloudinary.com/dcm79v527/image/upload/v1770633742/monikawl999-dubai-1085058_1920_pzrzav.jpg"
                                    alt="Office Interior"
                                    className="w-full h-auto object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                            </div>
                            <div className="absolute -inset-4 border border-[#BD9B5F]/20 rounded-3xl z-0 scale-95 translate-x-4 translate-y-4"></div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-20 bg-[#0B0D10]">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
                        {/* Mission */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="bg-black/40 p-10 rounded-3xl border border-white/5 hover:border-[#BD9B5F]/30 transition-all duration-300 group"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-[#BD9B5F]/10 flex items-center justify-center text-[#BD9B5F] mb-6 group-hover:bg-[#BD9B5F] group-hover:text-black transition-all">
                                <IoDiamondOutline size={32} />
                            </div>
                            <h3 className="text-2xl text-white font-light uppercase tracking-wide mb-4">Our Mission</h3>
                            <p className="text-gray-400 font-light leading-relaxed">
                                To empower our clients with exceptional real estate solutions that maximize value and enhance their quality of life. We strive to set new standards of excellence in the industry through innovation, integrity, and verified market intelligence.
                            </p>
                        </motion.div>

                        {/* Vision */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="bg-black/40 p-10 rounded-3xl border border-white/5 hover:border-[#BD9B5F]/30 transition-all duration-300 group"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-[#BD9B5F]/10 flex items-center justify-center text-[#BD9B5F] mb-6 group-hover:bg-[#BD9B5F] group-hover:text-black transition-all">
                                <IoGlobeOutline size={32} />
                            </div>
                            <h3 className="text-2xl text-white font-light uppercase tracking-wide mb-4">Our Vision</h3>
                            <p className="text-gray-400 font-light leading-relaxed">
                                To be the global leader in luxury real estate consultancy, recognized for our ability to unlock exclusive opportunities and our unwavering commitment to client success in Dubai and beyond.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 lg:py-32 border-t border-white/5">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="text-center space-y-2 group"
                            >
                                <div className="text-4xl lg:text-5xl font-bold text-white mb-2 group-hover:text-[#BD9B5F] transition-colors">{stat.value}</div>
                                <div className="text-[#BD9B5F] text-xs uppercase tracking-[0.2em] font-medium">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
