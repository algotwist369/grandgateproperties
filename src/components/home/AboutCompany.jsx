import React from 'react';
import { motion } from 'framer-motion';
import Button from '../common/Button';
import { useNavigate } from 'react-router-dom';

const AboutCompany = () => {
    const navigate = useNavigate();

    return (
        <section className="relative py-24 lg:py-32 bg-black overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#BD9B5F]/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#BD9B5F]/5 blur-[120px] rounded-full -translate-x-1/2 translate-y-1/2"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

                    {/* Left Side - Image Composition */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        <div className="relative z-10 rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                            <img
                                src="https://res.cloudinary.com/dcm79v527/image/upload/v1770633742/monikawl999-dubai-1085058_1920_pzrzav.jpg"
                                alt="Grand Gate Properties Office"
                                className="w-full h-[500px] lg:h-[600px] object-cover hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                        </div>

                        {/* Decorative Frame */}
                        <div className="absolute -inset-4 border border-[#BD9B5F]/20 rounded-3xl z-0 scale-95 translate-x-4 translate-y-4"></div>

                        {/* Experience Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3, duration: 0.6 }}
                            className="absolute -bottom-8 -right-8 bg-[#BD9B5F] p-8 rounded-2xl shadow-xl z-20 text-center hidden lg:block"
                        >
                            <p className="text-4xl font-bold text-white mb-1">15+</p>
                            <p className="text-black text-xs font-bold uppercase tracking-widest">Years of<br />Excellence</p>
                        </motion.div>
                    </motion.div>

                    {/* Right Side - Content */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="space-y-8"
                    >
                        <div className="space-y-4">
                            <h2 className='text-3xl sm:text-4xl lg:text-5xl xl:text-6xl text-white font-light leading-tight tracking-tight uppercase'>
                                Redefining Luxury
                                <span className='block text-[#BD9B5F] font-medium mt-2'>Real Estate in Dubai</span>
                            </h2>
                        </div>

                        <div className="space-y-6 text-gray-400 text-lg font-light leading-relaxed">
                            <p>
                                At Grand Gate Properties, we don't just sell properties; we curate lifestyles. With over a decade of expertise in Dubai's dynamic real estate market, we have established ourselves as the premier destination for discerning clients seeking exceptional investments and homes.
                            </p>
                            <p>
                                Our portfolio represents the pinnacle of luxury, from skyline penthouses to secluded waterfront villas. We combine market intelligence with personalized service to ensure every transaction is seamless, transparent, and rewarding.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-8 py-6 border-t border-white/10">
                            <div>
                                <h4 className="text-3xl font-bold text-white mb-2">$2B+</h4>
                                <p className="text-xs text-[#BD9B5F] uppercase tracking-widest">Property Sales</p>
                            </div>
                            <div>
                                <h4 className="text-3xl font-bold text-white mb-2">5000+</h4>
                                <p className="text-xs text-[#BD9B5F] uppercase tracking-widest">Happy Clients</p>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default AboutCompany;
