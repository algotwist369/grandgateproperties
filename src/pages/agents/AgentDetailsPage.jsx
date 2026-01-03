import React, { useMemo, useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FaPhone, FaWhatsapp, FaEnvelope } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import Button from "../../components/common/Button";

const agentDirectory = [
    {
        id: "ben-thomas",
        name: "Ben Thomas",
        role: "Head of Secondary",
        experience: "19 years",
        languages: "English, Spanish",
        communities: "Dubai Marina, Palm Jumeirah",
        image: "https://fnst.axflare.com/img/team/JPEG/oEsyFzyLSm.jpg",
        specialties: ["Secondary Market"],
        bio: "Ben has been a successful and forward-thinking real estate professional for 18 years. He was born and educated (Business and F&B) in Wales, United Kingdom.\n\nHe moved to Spain at the age of 19 to start a family business, and lived there for 3 years. Ben then lived and worked in London before moving to Dubai in 2003.\n\nBen started his Dubai real estate career by joining a startup business and buying in as a Junior partner, Emirates Homes Real Estate.\n\nAgency grew into an outstanding boutique real estate company, renowned in the market for their industry expertise, investment advisory and attention to clients needs and requirements.\n\nBen and his team built a very strong competitive brand before selling the company to a very healthy bid after 13 years of operation.\n\nBen joined AX CAPITAL as Director of Sales in the real estate secondary market. He is passionate in assisting the growth of people within the organisation through strategic management.\n\nHe is also a firm believer in individuality, and identifies different ways of getting the best out of people.",
        achievements: [
            "Closed AED 1.2B in resale transactions during 2023",
            "Recognized as Dubai's #1 Secondary Specialist (Luxury Living Awards)",
            "Featured speaker at Cityscape Global on waterfront investments",
        ],
    },
    {
        id: "dimitry-zolotco",
        name: "Dimitry Zolotco",
        role: "Associate Director",
        experience: "15 years",
        languages: "English, Russian, Romanian",
        communities: "Downtown, Business Bay",
        image: "https://fnst.axflare.com/img/team/JPEG/XqjPzqAxew.jpeg",
        specialties: ["Investment Advisory", "Off-plan"],
        bio: "Dimitry partners with international investors looking to optimize ROI across Downtown Dubai and Business Bay. He excels at structuring rental guarantees and off-plan exit strategies.",
        achievements: [
            "Secured 30+ bulk off-plan allocations for GCC funds",
            "Average client ROI of 12.4% across managed portfolio",
            "Panelist at PropTech ME on data-driven acquisitions",
        ],
    },
    {
        id: "maksim-tuguchev",
        name: "Maksim Tuguchev",
        role: "Associate Director",
        experience: "15 years",
        languages: "English, Russian",
        communities: "JBR, Bluewaters",
        image: "https://fnst.axflare.com/img/team/JPEG/NQdQHfPaqp.jpg",
        specialties: ["Secondary Market", "Negotiation"],
        bio: "Maksim is the go-to negotiator for high-demand waterfront assets. His clients rely on his ability to secure scarce stock quietly, often before listings reach the market.",
        achievements: [
            "Maintains 98% asking-price achievement for sellers",
            "Brokered record-breaking Bluewaters penthouse resale",
            "Trusted advisor to multiple family offices from CIS region",
        ],
    },
    {
        id: "olga-gojin",
        name: "Olga Gojin",
        role: "Property Expert",
        experience: "18 years",
        languages: "English, Russian, Romanian",
        communities: "Arabian Ranches, Tilal Al Ghaf",
        image: "https://fnst.axflare.com/img/team/JPEG/hnhevodlOC.jpg",
        specialties: ["Family Villas", "Relocations"],
        bio: "Olga orchestrates seamless relocations for executives and diplomats seeking gated villa living. Her network spans international schools, relocation advisors, and private clubs.",
        achievements: [
            "Placed 200+ expatriate families in the past 24 months",
            "Preferred partner for three Fortune 500 HR divisions",
            "Created bespoke community onboarding program",
        ],
    },
    {
        id: "julia-hart",
        name: "Julia Hart",
        role: "Luxury Consultant",
        experience: "12 years",
        languages: "English, French",
        communities: "Palm Jumeirah, Emirates Hills",
        image: "https://fnst.axflare.com/img/team/JPEG/XpEfv2OaWj.jpeg",
        specialties: ["Beachfront", "Signature Mansions"],
        bio: "Julia curates iconic beachfront lifestyles, from Palm signature villas to custom estates in Emirates Hills. Her approach centers around privacy, architecture, and legacy planning.",
        achievements: [
            "Closed 14 signature villa transactions in 2023",
            "Consulted on bespoke mansion builds with CK Architecture",
            "Quoted regularly by Luxury Property UAE magazine",
        ],
    },
];

import { motion, AnimatePresence } from "framer-motion";

const AgentDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const agent = useMemo(() => {
        return agentDirectory.find((a) => a.id === id) || agentDirectory[0];
    }, [id]);

    const specialties = agent?.specialties || [];
    const languages = agent?.languages ? agent.languages.split(", ") : [];

    const contactButtons = [
        { label: "Call", Icon: FaPhone, action: () => (window.location.href = `tel:+971508888123`) },
        { label: "WhatsApp", Icon: FaWhatsapp, action: () => window.open(`https://wa.me/971508888123`, "_blank") },
        { label: "Email", Icon: FaEnvelope, action: () => (window.location.href = `mailto:agent@grandgate.ae`) },
    ];

    const directAccessCards = [
        {
            label: "Direct line",
            value: "+971 50 888 8123",
            description: "24/7 Priority Support",
            href: "tel:+971508888123",
        },
        {
            label: "WhatsApp",
            value: "Secure Chat",
            description: "Encrypted Communication",
            href: "https://wa.me/971508888123",
            target: "_blank",
        },
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
        show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    return (
        <div className="min-h-screen bg-black text-gray-100 selection:bg-[#BD9B5F] selection:text-black">
            {/* Navigation */}
            <motion.div
                className="max-w-7xl mx-auto px-6 lg:px-8 pt-12 pb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <button
                    onClick={() => navigate(-1)}
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
                                    src={agent.image}
                                    alt={agent.name}
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
                            {contactButtons.map(({ label, Icon, action }) => (
                                <motion.button
                                    key={label}
                                    variants={itemVariants}
                                    onClick={action}
                                    className="flex flex-col items-center gap-3 p-6 rounded-3xl border border-white/10 bg-white/5 hover:bg-[#BD9B5F] hover:border-[#BD9B5F] group transition-all duration-500"
                                >
                                    <Icon className="w-5 h-5 text-[#BD9B5F] group-hover:text-white transition-colors" />
                                    <span className="text-[10px] uppercase tracking-[0.3em] font-medium group-hover:text-white">{label}</span>
                                </motion.button>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* Right Side - Agent Details */}
                    <motion.div
                        className="lg:col-span-7 space-y-16"
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
                                    {agent.name.split(' ')[0]} <br />
                                    <span className="text-[#BD9B5F] font-medium italic">{agent.name.split(' ')[1]}</span>
                                </h1>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 py-10 border-y border-white/10">
                                <div className="space-y-1">
                                    <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-medium">Role</p>
                                    <p className="text-gray-200 uppercase tracking-wider">{agent.role}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-medium">Experience</p>
                                    <p className="text-gray-200 uppercase tracking-wider">{agent.experience}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-medium">Location</p>
                                    <p className="text-gray-200 uppercase tracking-wider">Dubai, UAE</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <h2 className="text-2xl font-light text-white uppercase tracking-[0.2em] flex items-center gap-4">
                                <span className="w-2 h-2 rounded-full bg-[#BD9B5F]"></span>
                                Professional Bio
                            </h2>
                            <p className="text-gray-400 text-lg sm:text-xl font-light leading-relaxed whitespace-pre-line">
                                {agent?.bio}
                            </p>
                        </div>

                        <div className="space-y-10">
                            <h2 className="text-2xl font-light text-white uppercase tracking-[0.2em] flex items-center gap-4">
                                <span className="w-2 h-2 rounded-full bg-[#BD9B5F]"></span>
                                Specialization
                            </h2>
                            <div className="flex flex-wrap gap-4">
                                {specialties.map((specialty, idx) => (
                                    <span key={idx} className="px-6 py-3 rounded-full border border-white/10 bg-white/5 text-xs uppercase tracking-[0.2em] text-gray-300">
                                        {specialty}
                                    </span>
                                ))}
                                {languages.map((lang, idx) => (
                                    <span key={idx} className="px-6 py-3 rounded-full border border-[#BD9B5F]/30 bg-[#BD9B5F]/5 text-xs uppercase tracking-[0.4em] text-[#BD9B5F]">
                                        {lang}
                                    </span>
                                ))}
                            </div>
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
                                        className="group p-8 rounded-[2rem] border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-500"
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