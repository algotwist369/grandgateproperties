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

const AgentDetailsPage = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const params = useParams();
    const routeAgentId = params.id || params.agentId || "";

    const agent = useMemo(() => {
        const stateAgent = state?.agent;
        const lookupId = stateAgent?.id || routeAgentId;
        const matchedAgent = lookupId
            ? agentDirectory.find((item) => item.id === lookupId)
            : undefined;

        if (stateAgent && matchedAgent) {
            return { ...matchedAgent, ...stateAgent };
        }

        if (stateAgent) {
            return stateAgent;
        }

        if (matchedAgent) {
            return matchedAgent;
        }

        return agentDirectory[0];
    }, [routeAgentId, state?.agent]);

    const languages = useMemo(() => {
        if (!agent?.languages) return [];
        return agent.languages.split(",").map((lang) => lang.trim());
    }, [agent]);

    const communities = useMemo(() => {
        if (!agent?.communities) return [];
        return agent.communities.split(",").map((area) => area.trim());
    }, [agent]);

    const specialties = agent?.specialties ?? [];
    const achievements = agent?.achievements ?? [];

    const contactEmail = agent?.email ?? "advisory@axestate.com";
    const directLine = agent?.phone ?? "+971 4 555 0123";
    const conciergeLine = agent?.concierge ?? "+971 50 777 4411";
    const officeHours = agent?.hours ?? "Sunday – Friday · 09:00 – 20:00 GST";
    const officeAddress =
        agent?.office ??
        "14th Floor, Westburry Office, Business Bay, Dubai, UAE";

    const sanitizeDigits = (value) => value.replace(/[^+\d]/g, "");
    const telHref = `tel:${sanitizeDigits(directLine)}`;
    const conciergeHref = `https://wa.me/${sanitizeDigits(conciergeLine)}`;
    const emailHref = `mailto:${contactEmail}`;
    const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        officeAddress
    )}`;

    const handleCall = useCallback(() => {
        window.location.href = telHref;
    }, [telHref]);

    const handleWhatsApp = useCallback(() => {
        window.open(conciergeHref, "_blank", "noopener,noreferrer");
    }, [conciergeHref]);

    const handleEmail = useCallback(() => {
        window.location.href = emailHref;
    }, [emailHref]);

    const contactButtons = useMemo(
        () => [
            {
                label: "Call",
                Icon: FaPhone,
                action: handleCall,
                variant: "secondary",
                primaryBg: "bg-[#996515]",
                primaryText: "text-white",
                className:
                    "flex items-center justify-center gap-3 uppercase tracking-[0.3em] font-medium",
            },
            {
                label: "WhatsApp",
                Icon: FaWhatsapp,
                action: handleWhatsApp,
                variant: "primary",
                primaryBg: "bg-[#996515]",
                primaryText: "text-white",
                className:
                    "flex items-center justify-center gap-3 uppercase tracking-[0.3em] font-medium",
            },
            {
                label: "Email",
                Icon: FaEnvelope,
                action: handleEmail,
                variant: "secondary",
                secondaryBg: "bg-[#996515]",
                primaryText: "text-white",
                className:
                    "flex items-center justify-center gap-3 uppercase tracking-[0.3em] font-medium",
            },
        ],
        [handleCall, handleWhatsApp, handleEmail]
    );

    const directAccessCards = useMemo(
        () => [
            {
                label: "Email",
                value: contactEmail,
                description: "Replies within 2 working hours",
                href: emailHref,
                target: "_self",
            },
            {
                label: "Direct Line",
                value: directLine,
                description: "Voice & secure messaging",
                href: telHref,
                target: "_self",
            },
            {
                label: "Concierge / WhatsApp",
                value: conciergeLine,
                description: "24/7 multilingual support",
                href: conciergeHref,
                target: "_blank",
            },
            {
                label: "Office Hours",
                value: officeHours,
                description: officeAddress,
                href: mapsHref,
                target: "_blank",
            },
        ],
        [contactEmail, directLine, conciergeLine, officeHours, officeAddress, emailHref, telHref, conciergeHref, mapsHref]
    );

    // Calculate professional metrics
    const experienceYears = parseInt(agent?.experience?.match(/\d+/)?.[0] || "0");

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#050505] via-[#080808] to-[#050505] text-gray-100">
            {/* Navigation */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="group inline-flex items-center gap-3 text-sm uppercase tracking-[0.3em] text-gray-300 hover:text-white transition-all duration-300"
                >
                    <IoIosArrowBack className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">Back to agents</span>
                </button>
            </div>

            {/* Main Content - Image and Details Side by Side */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                    {/* Left Side - Agent Image */}
                    <div className="lg:sticky lg:top-8 space-y-6">
                        <div className="relative w-full max-w-2xl mx-auto lg:mx-0 rounded-2xl overflow-hidden flex items-center justify-center">
                            <img
                                src={agent.image}
                                alt={agent.name}
                                className="w-full h-auto max-h-[620px] object-contain"
                            />
                        </div>

                        {/* Contact Buttons */}
                        <div className="flex gap-3">
                            {contactButtons.map(
                                ({
                                    label,
                                    Icon,
                                    action,
                                    variant,
                                    primaryBg,
                                    primaryText,
                                    secondaryBg,
                                    secondaryText,
                                    className,
                                }) => (
                                    <Button
                                        key={label}
                                        onClick={action}
                                        fullWidth
                                        variant={variant}
                                        primaryBg={primaryBg}
                                        primaryText={primaryText}
                                        secondaryBg={secondaryBg}
                                        secondaryText={secondaryText}
                                        size="py-4 text-sm"
                                        className={className}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span>{label}</span>
                                    </Button>
                                )
                            )}
                        </div>
                    </div>

                    {/* Right Side - Agent Details */}
                    <div className="space-y-8">
                        {/* Agent Name and Title */}
                        <div className="space-y-4">
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-white leading-tight">
                                {agent.name}
                            </h1>
                            <div className="space-y-3">
                                <p className="text-xl sm:text-2xl text-gray-300 font-light">{agent.role}</p>

                                {/* Key Information */}
                                <div className="space-y-3 pt-2">
                                    <div className="flex items-center gap-3 text-gray-300">
                                        <span className="text-gray-500 min-w-[120px]">Experience:</span>
                                        <span className="font-light">{agent.experience}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-300">
                                        <span className="text-gray-500 min-w-[120px]">Specialization:</span>
                                        <span className="font-light">{specialties.join(", ")}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-300">
                                        <span className="text-gray-500 min-w-[120px]">Language:</span>
                                        <span className="font-light">{languages.join(", ")}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bio Section */}
                        <div className="pt-6 border-t border-gray-800/60">
                            <h2 className="text-xl sm:text-2xl font-light text-white mb-4">About</h2>
                            <div className="prose prose-invert max-w-none">
                                <p className="text-gray-300 leading-relaxed text-base sm:text-lg whitespace-pre-line">
                                    {agent?.bio}
                                </p>
                            </div>
                        </div>

                        {/* Contact Details */}
                        <div className="space-y-6 pt-6 border-t border-gray-800/60">
                            <h2 className="text-xl sm:text-2xl font-light text-white">Direct Access</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {directAccessCards.map(({ label, value, description, href, target }) => (
                                    <a
                                        key={label}
                                        href={href}
                                        target={target}
                                        rel={target === "_blank" ? "noreferrer" : undefined}
                                        className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 space-y-1 hover:border-white/40 hover:bg-white/10 transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/60"
                                    >
                                        <p className="text-xs uppercase tracking-[0.4em] text-gray-400">{label}</p>
                                        <p className="text-lg text-white font-light">{value}</p>
                                        <p className="text-xs text-gray-500">{description}</p>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgentDetailsPage;