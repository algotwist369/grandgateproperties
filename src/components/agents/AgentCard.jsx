import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const AgentCard = () => {
    const navigate = useNavigate();
    const agents = [
        {
            id: "ben-thomas",
            name: "Ben Thomas",
            role: "Head of Secondary",
            experience: "19 years",
            languages: "English, Spanish",
            communities: "Dubai Marina, Palm Jumeirah",
            image: "https://fnst.axflare.com/img/team/JPEG/oEsyFzyLSm.jpg",
            specialties: ["Luxury Sales", "Penthouses"],
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
        },
    ];

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleNavigate = (agent) => {
        navigate(`/en/agents/${agent.id}`, {
            state: { agent },
        });
    };

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
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    return (
        <div className="w-full py-24 sm:py-32 px-6 lg:px-24 bg-black overflow-hidden">
            <motion.div
                className="w-full flex flex-col gap-6 mb-16"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                <div className="flex items-center gap-4">
                    <div className="w-12 h-px bg-[#BD9B5F]"></div>
                    <p className="text-xs uppercase tracking-[0.4em] text-[#BD9B5F]">
                        Elite Partners
                    </p>
                </div>

                <div className="w-full flex flex-col md:flex-row md:items-end md:justify-between gap-8">
                    <div className="flex flex-col gap-4 max-w-2xl">
                        <h1 className="text-4xl sm:text-6xl font-light text-white uppercase tracking-tight">
                            Find your <span className="text-[#A17158] font-medium italic">Partner</span>
                        </h1>
                        <p className="text-gray-400 text-lg font-light leading-relaxed">
                            Connect with seasoned advisors fluent in your language and specialized in the world's most in-demand luxury communities.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 bg-white/5 p-4 rounded-3xl border border-white/10 backdrop-blur-xl">
                        <select className="bg-transparent text-gray-300 border-none focus:ring-0 outline-none text-sm cursor-pointer px-4">
                            <option value="">Specialization</option>
                        </select>
                        <div className="w-px h-8 bg-white/10"></div>
                        <select className="bg-transparent text-gray-300 border-none focus:ring-0 outline-none text-sm cursor-pointer px-4">
                            <option value="">Language</option>
                        </select>
                        <div className="w-px h-8 bg-white/10"></div>
                        <input
                            type="search"
                            placeholder="Search by Agent name..."
                            className="bg-transparent p-2 text-gray-300 outline-none placeholder:text-gray-600 text-sm min-w-[200px]"
                        />
                    </div>
                </div>
            </motion.div>

            <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8"
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
            >
                {agents.map((agent, index) => (
                    <motion.div
                        key={index}
                        variants={itemVariants}
                        className="group relative h-[500px] sm:h-[600px] lg:h-[700px] rounded-[2rem] overflow-hidden cursor-pointer"
                        whileHover={{ y: -15 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        onClick={() => handleNavigate(agent)}
                    >
                        <img
                            src={agent.image}
                            alt={agent.name}
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500"></div>

                        <div className="absolute bottom-0 left-0 right-0 p-10 transform translate-y-12 group-hover:translate-y-0 transition-transform duration-500">
                            <div className="space-y-6">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-1 h-6 bg-[#BD9B5F]"></div>
                                        <p className="text-xs uppercase tracking-widest text-gray-400">
                                            {agent.role}
                                        </p>
                                    </div>
                                    <h2 className="text-3xl font-light text-white tracking-wide uppercase">
                                        {agent.name}
                                    </h2>
                                </div>

                                <div className="space-y-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 pb-2">
                                    <div className="w-full h-px bg-white/10"></div>
                                    <div className="flex justify-between text-xs tracking-widest text-gray-400 uppercase">
                                        <span>Exp</span>
                                        <span className="text-white">{agent.experience}</span>
                                    </div>
                                    <div className="flex justify-between text-xs tracking-widest text-gray-400 uppercase">
                                        <span>Langs</span>
                                        <span className="text-white">{agent.languages}</span>
                                    </div>
                                </div>

                                <button className="w-full py-4 bg-white/5 hover:bg-[#BD9B5F] text-white border border-white/10 hover:border-[#BD9B5F] rounded-xl text-xs uppercase tracking-[0.2em] transition-all duration-300">
                                    Enquire Now
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
};

export default AgentCard;
