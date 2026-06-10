import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getFullUrl } from "../../apis/user_api";

const AgentCard = ({ agents = [], loading = false }) => {
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleNavigate = (agent) => {
        // Use slug for navigation if available, else _id
        const identifier = agent.slug || agent._id;
        navigate(`/en/agents/${identifier}`, {
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

    if (loading) {
        return (
            <div className="w-full py-20 text-center bg-black">
                <div className="inline-block w-8 h-8 border-4 border-[#BD9B5F] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-500 mt-4 uppercase tracking-widest text-xs">Summoning Experts...</p>
            </div>
        );
    }

    if (!agents || agents.length === 0) {
        return (
            <div className="w-full py-20 text-center bg-black">
                <p className="text-gray-500 uppercase tracking-widest text-xs">No experts found in this sector.</p>
            </div>
        );
    }

    return (
        <div className="w-full md:py-8 px-6 lg:px-24 bg-black overflow-hidden pb-20">
            <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
            >
                {agents.map((agent, index) => (
                    <motion.div
                        key={agent._id || index}
                        variants={itemVariants}
                        className="group relative h-[450px] sm:h-[500px] lg:h-[550px] rounded-[2rem] overflow-hidden cursor-pointer bg-white/5 border border-white/5"
                        whileHover={{ y: -15 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        onClick={() => handleNavigate(agent)}
                    >
                        <img
                            src={agent.avatar_url ? getFullUrl(agent.avatar_url) : '/agent/Agent1.jpeg'}
                            alt={agent.agent_name}
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500"></div>

                        <div className="absolute bottom-0 left-0 right-0 p-10 transform translate-y-10 group-hover:translate-y-0 transition-transform duration-500 text-left">
                            <div className="space-y-6">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-1 h-6 bg-[#BD9B5F]"></div>
                                        <p className="text-xs uppercase tracking-widest text-gray-400">
                                            {agent.agent_role || 'Real Estate Consultant'}
                                        </p>
                                    </div>
                                    <h2 className="text-3xl font-light text-white tracking-wide uppercase">
                                        {agent.agent_name}
                                    </h2>
                                </div>

                                <div className="space-y-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 pb-2">
                                    <div className="w-full h-px bg-white/10"></div>
                                    <div className="flex justify-between text-xs tracking-widest text-gray-400 uppercase">
                                        <span>Exp</span>
                                        <span className="text-white">{agent.experience || 'Highly Experienced'}</span>
                                    </div>
                                    <div className="flex justify-between text-xs tracking-widest text-gray-400 uppercase">
                                        <span>Focus</span>
                                        <span className="text-white truncate max-w-[150px] text-right">
                                            {agent.agent_location || 'UAE'}
                                        </span>
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
