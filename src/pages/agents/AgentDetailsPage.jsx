import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FaPhone, FaWhatsapp, FaEnvelope } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import { motion } from "framer-motion";
import { getAgentBySlug } from "../../apis/agent_api";
import { getFullUrl } from "../../apis/user_api";

const MotionButton = motion.button;

const AgentDetailsPage = () => {
    const { id: slug } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [agent, setAgent] = useState(location.state?.agent || null);
    const [loading, setLoading] = useState(!agent);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAgent = async () => {
            try {
                if (!agent || agent.slug !== slug) {
                    setLoading(true);
                    const data = await getAgentBySlug(slug);
                    setAgent(data);
                }
            } catch (err) {
                console.error("Failed to fetch agent details:", err);
                setError("Expert profile is currently offline. Please try again soon.");
            } finally {
                setLoading(false);
            }
        };
        fetchAgent();
    }, [slug, agent]);

    const specialties = Array.isArray(agent?.specialties) ? agent.specialties : (typeof agent?.specialties === 'string' ? agent.specialties.split(", ") : []);
    const languages = Array.isArray(agent?.languages) ? agent.languages : (typeof agent?.languages === 'string' ? agent.languages.split(", ") : []);
    const communities = Array.isArray(agent?.communities) ? agent.communities : (typeof agent?.communities === 'string' ? agent.communities.split(", ") : []);
    const portfolioItems = Array.isArray(agent?.agent_portfolio) ? agent.agent_portfolio : [];

    const contactButtons = agent ? [
        { label: "Call", Icon: FaPhone, action: () => (window.location.href = `tel:${agent.agent_phone}`) },
        { label: "WhatsApp", Icon: FaWhatsapp, action: () => window.open(`https://wa.me/${agent?.agent_phone?.replace(/\+/g, "")}?text=${encodeURIComponent(`Hello ${agent.agent_name}, I am interested in your real estate services.`)}`, "_blank") },
        { label: "Email", Icon: FaEnvelope, action: () => (window.location.href = `mailto:${agent.agent_email}`) },
    ] : [];

    const directAccessCards = agent ? [
        {
            label: "Direct line",
            value: agent?.agent_phone?.replace(/(\+\d{3})(\d{2})(\d{3})(\d{4})/, '$1 $2 $3 $4') || agent.agent_phone,
            description: agent?.agent_email || "24/7 Priority Support",
            href: `tel:${agent.agent_phone}`,
        },
        {
            label: "WhatsApp",
            value: "Secure Chat",
            description: "Encrypted Communication",
            href: `https://wa.me/${agent?.agent_phone?.replace(/\+/g, "")}?text=${encodeURIComponent(`Hello ${agent.agent_name}, I am interested in your real estate services.`)}`,
            target: "_blank",
        },
    ] : [];

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
        show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-[#BD9B5F] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-[#BD9B5F] text-xs uppercase tracking-[0.4em] animate-pulse">Summoning Expert Detail...</p>
                </div>
            </div>
        );
    }

    if (error || !agent) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-6 text-center">
                <div className="max-w-md space-y-6">
                    <h2 className="text-3xl font-light text-white uppercase tracking-wider">{error || "Expert Not Found"}</h2>
                    <button
                        onClick={() => navigate('/en/agents')}
                        className="px-8 py-4 bg-[#BD9B5F] text-black rounded-xl text-xs uppercase tracking-[0.2em] font-bold hover:scale-105 transition-all"
                    >
                        Back to Team
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-gray-100 selection:bg-[#BD9B5F] selection:text-black">
            {/* Navigation */}
            <motion.div
                className="max-w-7xl mx-auto px-6 lg:px-8 pt-12 pb-8 text-left"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <button
                    onClick={() => navigate('/en/agents')}
                    className="group inline-flex items-center gap-4 text-xs uppercase tracking-[0.4em] text-gray-400 hover:text-[#BD9B5F] transition-all duration-300"
                >
                    <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[#BD9B5F] group-hover:bg-[#BD9B5F]/10 transition-all">
                        <IoIosArrowBack className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
                    </div>
                    <span>Back to experts</span>
                </button>
            </motion.div>

            <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-32">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
                    {/* Left Side - Agent Image */}
                    <motion.div
                        className="lg:col-span-5 lg:sticky lg:top-12 space-y-12"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <div className="relative group">
                            <div className="absolute -inset-4 bg-[#BD9B5F]/5 blur-3xl rounded-full opacity-50"></div>
                            <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden border border-white/10 bg-white/5 shadow-2xl">
                                <img
                                    src={agent.avatar_url ? getFullUrl(agent.avatar_url) : '/agent/Agent1.jpeg'}
                                    alt={agent.agent_name}
                                    className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                            </div>
                        </div>

                        <motion.div
                            className="grid grid-cols-3 gap-4"
                            variants={containerVariants}
                            initial="hidden"
                            animate="show"
                        >
                            {contactButtons.map(({ label, Icon, action }) => {
                                const ContactIcon = Icon;
                                return (
                                    <MotionButton
                                        key={label}
                                        variants={itemVariants}
                                        onClick={action}
                                        className="flex flex-col items-center gap-3 p-6 rounded-3xl border border-white/10 bg-white/5 hover:bg-[#BD9B5F] hover:border-[#BD9B5F] group transition-all duration-500 text-left"
                                    >
                                        <ContactIcon className="w-5 h-5 text-[#BD9B5F] group-hover:text-white transition-colors" />
                                        <span className="text-[10px] uppercase tracking-[0.3em] font-medium group-hover:text-white">{label}</span>
                                    </MotionButton>
                                );
                            })}
                        </motion.div>
                    </motion.div>

                    {/* Right Side - Agent Details */}
                    <motion.div
                        className="lg:col-span-7 space-y-16 text-left"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="flex items-center gap-3"
                                >
                                    <div className="w-12 h-px bg-[#BD9B5F]"></div>
                                    <span className="text-xs uppercase tracking-[0.5em] text-[#BD9B5F] font-medium">Expert Profile</span>
                                </motion.div>
                                <h1 className="text-6xl sm:text-8xl font-light text-white uppercase tracking-tighter leading-none">
                                    {agent.agent_name?.split(' ')[0]} <br />
                                    <span className="text-[#BD9B5F] font-medium italic">{agent.agent_name?.split(' ').slice(1).join(' ')}</span>
                                </h1>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 py-10 border-y border-white/10">
                                <div className="space-y-1">
                                    <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-medium">Role</p>
                                    <p className="text-gray-200 uppercase tracking-wider">{agent.agent_role}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-medium">Experience</p>
                                    <p className="text-gray-200 uppercase tracking-wider">{agent.experience || 'Experienced'}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-medium">Location</p>
                                    <p className="text-gray-200 uppercase tracking-wider">{agent.agent_location || 'Dubai, UAE'}</p>
                                </div>
                            </div>
                        </div>

                        {agent.agent_bio && (
                            <div className="space-y-8">
                                <h2 className="text-2xl font-light text-white uppercase tracking-[0.2em] flex items-center gap-4">
                                    <span className="w-2 h-2 rounded-full bg-[#BD9B5F]"></span>
                                    Professional Bio
                                </h2>
                                <p className="text-gray-400 text-lg sm:text-xl font-light leading-relaxed whitespace-pre-line">
                                    {agent?.agent_bio}
                                </p>
                            </div>
                        )}

                        <div className="space-y-10">
                            {specialties.length > 0 && (
                                <div>
                                    <h2 className="text-2xl font-light text-white uppercase tracking-[0.2em] flex items-center gap-4 mb-6">
                                        <span className="w-2 h-2 rounded-full bg-[#BD9B5F]"></span>
                                        Specialization
                                    </h2>
                                    <div className="flex flex-wrap gap-4">
                                        {specialties.map((specialty, idx) => (
                                            <span key={idx} className="px-6 py-3 rounded-full border border-white/10 bg-white/5 text-xs uppercase tracking-[0.2em] text-gray-300">
                                                {specialty}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {languages.length > 0 && (
                                <div>
                                    <h2 className="text-2xl font-light text-white uppercase tracking-[0.2em] flex items-center gap-4 mb-6">
                                        <span className="w-2 h-2 rounded-full bg-[#BD9B5F]"></span>
                                        Languages
                                    </h2>
                                    <div className="flex flex-wrap gap-4">
                                        {languages.map((lang, idx) => (
                                            <span key={idx} className="px-6 py-3 rounded-full border border-[#BD9B5F]/30 bg-[#BD9B5F]/5 text-xs uppercase tracking-[0.4em] text-[#BD9B5F]">
                                                {lang}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {communities.length > 0 && (
                                <div>
                                    <h2 className="text-2xl font-light text-white uppercase tracking-[0.2em] flex items-center gap-4 mb-6">
                                        <span className="w-2 h-2 rounded-full bg-[#BD9B5F]"></span>
                                        Communities
                                    </h2>
                                    <div className="flex flex-wrap gap-4">
                                        {communities.map((community, idx) => (
                                            <span key={idx} className="px-6 py-3 rounded-full border border-white/10 bg-white/5 text-xs uppercase tracking-[0.2em] text-gray-300">
                                                {community}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {portfolioItems.length > 0 && (
                                <div>
                                    <h2 className="text-2xl font-light text-white uppercase tracking-[0.2em] flex items-center gap-4 mb-6">
                                        <span className="w-2 h-2 rounded-full bg-[#BD9B5F]"></span>
                                        Portfolio
                                    </h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {portfolioItems.map((item, idx) => (
                                            <div key={idx} className="rounded-3xl overflow-hidden border border-white/10 bg-white/5 shadow-xl">
                                                <img
                                                    src={getFullUrl(item.url)}
                                                    alt={item.type || 'Portfolio item'}
                                                    className="w-full h-60 object-cover"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="space-y-10 pt-8">
                            <h2 className="text-2xl font-light text-white uppercase tracking-[0.2em] flex items-center gap-4">
                                <span className="w-2 h-2 rounded-full bg-[#BD9B5F]"></span>
                                Direct Access
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {directAccessCards.map(({ label, value, description, href, target }) => (
                                    <motion.a
                                        key={label}
                                        href={href}
                                        target={target}
                                        whileHover={{ y: -5 }}
                                        className="group p-8 rounded-[2rem] border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-500 text-left"
                                    >
                                        <p className="text-[10px] uppercase tracking-[0.4em] text-gray-500 mb-4 font-medium group-hover:text-[#BD9B5F] transition-colors">{label}</p>
                                        <p className="text-xl text-white font-light tracking-wide mb-2 uppercase">{value}</p>
                                        <p className="text-xs text-gray-600 uppercase tracking-widest">{description}</p>
                                    </motion.a>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default AgentDetailsPage;
