import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
        navigate(`/agents/${agent.id}`, {
            state: {
                agent,
            },
        });
    };

    return (
        <div className="w-full py-10 px-4 sm:px-6 md:px-12 lg:px-24 space-y-8">
            <div className="w-full flex flex-col gap-4">
                <p className="text-sm uppercase tracking-[0.4em] text-gray-500 text-center md:text-left">
                    OUR EXPERTS
                </p>
                <div className="w-full flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                    {/* Heading */}
                    <div className="flex flex-col gap-3 text-center md:text-left w-full md:w-1/2">
                        <h1 className="text-3xl sm:text-4xl lg:text-[45px] text-gray-100 font-light leading-tight">
                            Find your partner
                        </h1>
                        <p className="text-gray-400 text-base">
                            Connect with seasoned advisors fluent in your language and specialized in Dubai’s most in-demand communities.
                        </p>
                    </div>

                    {/* Filters Section */}
                    <div className="w-full md:w-auto bg-[#111] border border-gray-800 rounded-md p-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-2 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
                        {/* Specialization */}
                        <select
                            name="specialization"
                            className="w-full sm:w-[180px] p-2 bg-[#0a0a0a] text-gray-300 border border-gray-700 focus:border-gray-500 outline-none rounded-sm transition-colors"
                        >
                            <option value="">Specialization</option>
                            <option value="top-rated">Top Rated</option>
                            <option value="experience">Most Experienced</option>
                            <option value="popular">Most Popular</option>
                        </select>

                        {/* Language */}
                        <select
                            name="language"
                            className="w-full sm:w-[180px] p-2 bg-[#0a0a0a] text-gray-300 border border-gray-700 focus:border-gray-500 outline-none rounded-sm transition-colors"
                        >
                            <option value="">Language</option>
                            <option value="english">English</option>
                            <option value="spanish">Spanish</option>
                            <option value="russian">Russian</option>
                            <option value="hindi">Hindi</option>
                        </select>

                        {/* Search Field */}
                        <div className="flex items-center w-full sm:w-[220px] bg-[#0a0a0a] border border-gray-700 rounded-sm overflow-hidden focus-within:border-gray-500 transition-colors">
                            <span className="px-3 text-gray-500 text-sm whitespace-nowrap hidden sm:block">
                                Search
                            </span>
                            <input
                                type="search"
                                placeholder="Agent name..."
                                className="w-full p-2 bg-transparent text-gray-300 outline-none placeholder:text-gray-600"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {agents.map((agent, index) => (
                    <div
                        key={index}
                        role="button"
                        tabIndex={0}
                        onClick={() => handleNavigate(agent)}
                        onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                                event.preventDefault();
                                handleNavigate(agent);
                            }
                        }}
                        className="group relative bg-[#181818] rounded-lg overflow-hidden border border-transparent hover:border-gray-600 transition-all duration-300 shadow-[0_15px_40px_rgba(0,0,0,0.35)] cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-gray-400"
                    >
                        {/* Agent Image */}
                        <div className="w-full h-[360px] sm:h-[420px] lg:h-[520px] overflow-hidden">
                            <img
                                src={agent.image}
                                alt={agent.name}
                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                            />
                        </div>

                        {/* Content OVER Image */}
                        <div className="absolute bottom-0 left-0 w-full p-6 text-white bg-gradient-to-t from-black/85 via-black/40 to-transparent space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="h-[2px] w-6 bg-white/70" />
                                        <p className="text-xs uppercase tracking-[0.3em] text-gray-300">
                                            Elite
                                        </p>
                                    </div>
                                    <h2 className="text-2xl font-light">{agent.name}</h2>
                                </div>
                                <span className="px-3 py-1 text-xs uppercase border border-white/30 rounded-full text-gray-100">
                                    {agent.role.split(" ")[0]}
                                </span>
                            </div>

                            <p className="text-gray-300 text-sm">{agent.role}</p>

                            <div className="flex flex-col gap-2 border-t border-white/10 pt-3">
                                <div className="flex items-center justify-between text-gray-300 text-sm">
                                    <span className="text-gray-400">Experience</span>
                                    <span>{agent.experience}</span>
                                </div>
                                <div className="flex flex-wrap gap-2 text-gray-300 text-sm">
                                    <span className="text-gray-400">Languages:</span>
                                    <span className="font-light">{agent.languages}</span>
                                </div>
                                <div className="flex flex-wrap gap-2 text-gray-300 text-sm">
                                    <span className="text-gray-400">Areas:</span>
                                    <span className="font-light">{agent.communities}</span>
                                </div>
                                <div className="flex flex-wrap gap-2 pt-1">
                                    {agent.specialties.map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-3 py-1 text-[11px] uppercase tracking-[0.2em] border border-white/20 rounded-full text-gray-200"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <button className="w-full py-2 border border-white/40 rounded-sm text-sm uppercase tracking-[0.2em] text-gray-100 hover:bg-white/10 transition-colors">
                                Connect
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AgentCard;
