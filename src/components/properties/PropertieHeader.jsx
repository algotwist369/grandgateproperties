import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaWhatsapp, FaPhone, FaMobile, FaGlobe, FaCheckCircle, FaCommentDots } from 'react-icons/fa'
import { MdCall } from 'react-icons/md'
import { MdOutlineMarkEmailRead, MdOutlineFacebook } from 'react-icons/md'
import { FaLinkedin } from 'react-icons/fa6'
import Heading from '../common/Heading'
import { FaBed, FaBath, FaRulerCombined, FaHome, FaInstagram } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

const MAP_FALLBACK =
    "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15081.626343519032!2d73.0047826!3d19.0898111!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c1d305a5b82b%3A0x9180c9d872385d37!2sThe%20King's%20Luxury%20Spa!5e0!3m2!1sen!2sin!4v1763381077242!5m2!1sen!2sin"

const formatCurrency = (value, currency = 'AED', maximumFractionDigits = 0) => {
    if (typeof value !== 'number') return value || '—'
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        maximumFractionDigits,
        minimumFractionDigits: 0,
    }).format(value)
}

const formatNumber = (value) => {
    if (typeof value !== 'number') return value || '—'
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value)
}

const sanitizeDigits = (value = '') => value.replace(/[^+\d]/g, '')

const PropertieHeader = ({ property }) => {
    const [currentImageIdx, setCurrentImageIdx] = useState(0)
    const [isZoomed, setIsZoomed] = useState(false)
    const resolvedProperty = property ?? null

    useEffect(() => {
        setCurrentImageIdx(0)
    }, [resolvedProperty?.id])

    // Lock body scroll when zoom modal is open
    useEffect(() => {
        if (isZoomed) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isZoomed])

    const gallery = useMemo(() => {
        let items = []
        if (Array.isArray(resolvedProperty?.gallery)) items = [...resolvedProperty.gallery]
        else if (Array.isArray(resolvedProperty?.image)) items = [...resolvedProperty.image]
        else if (typeof resolvedProperty?.image === 'string') items = [resolvedProperty.image]

        if (resolvedProperty?.heroImage && !items.includes(resolvedProperty.heroImage)) {
            items.unshift(resolvedProperty.heroImage)
        }
        return items
    }, [resolvedProperty])

    const breadcrumbs = useMemo(() => {
        if (resolvedProperty?.breadcrumbs?.length) return resolvedProperty.breadcrumbs
        const crumbs = [
            { label: 'Home', path: '/en/' },
            { label: resolvedProperty?.propertyType ? `${resolvedProperty.propertyType}s` : 'Properties', path: '/en/properties' },
        ]
        if (resolvedProperty?.community) crumbs.push({ label: resolvedProperty.community, path: '#' })
        if (resolvedProperty?.title) crumbs.push({ label: resolvedProperty.title, path: '#' })
        return crumbs
    }, [resolvedProperty])

    const agent = resolvedProperty?.agent ?? {}
    let bedrooms = resolvedProperty?.bedrooms ?? resolvedProperty?.beds
    let bathrooms = resolvedProperty?.bathrooms ?? resolvedProperty?.baths
    let sqftLabel = resolvedProperty?.sqft ? `${formatNumber(resolvedProperty.sqft)} sq.ft` : resolvedProperty?.area

    // Derive ranges from units if top-level data is missing
    if (resolvedProperty?.units?.length > 0) {
        if (!bedrooms) {
            const beds = resolvedProperty.units.map(u => u.bedrooms).filter(b => b != null);
            if (beds.length > 0) bedrooms = Math.min(...beds) === Math.max(...beds) ? Math.min(...beds) : `${Math.min(...beds)} - ${Math.max(...beds)}`;
        }
        if (!bathrooms) {
            const baths = resolvedProperty.units.map(u => u.bathrooms).filter(b => b != null);
            if (baths.length > 0) bathrooms = Math.min(...baths) === Math.max(...baths) ? Math.min(...baths) : `${Math.min(...baths)} - ${Math.max(...baths)}`;
        }
        if (!sqftLabel) {
            const areas = resolvedProperty.units.map(u => u.sqft).filter(a => a != null);
            const ranges = resolvedProperty.units.map(u => u.sqftRange).filter(r => r != null);

            if (areas.length > 0) {
                const minApp = Math.min(...areas);
                const maxApp = Math.max(...areas);
                sqftLabel = minApp === maxApp ? `${formatNumber(minApp)} sq.ft` : `${formatNumber(minApp)} - ${formatNumber(maxApp)} sq.ft`;
            } else if (ranges.length > 0) {
                sqftLabel = ranges[0];
            }
        }
    }
    const propertyType = resolvedProperty?.propertyTypes?.join(', ') ?? resolvedProperty?.propertyType ?? resolvedProperty?.type
    const priceLabel = resolvedProperty?.startingPrice
        ? `From ${formatCurrency(resolvedProperty.startingPrice, resolvedProperty?.currency)}`
        : (resolvedProperty?.price ? formatCurrency(resolvedProperty.price, resolvedProperty?.currency) : resolvedProperty?.price)
    const pricePerSqftLabel = resolvedProperty?.pricePerSqft
        ? `${formatCurrency(resolvedProperty.pricePerSqft, resolvedProperty?.currency, 2)} / sq.ft`
        : resolvedProperty?.pricePerSqftText ?? resolvedProperty?.pricePerSqft

    const shareUrl = useMemo(() => {
        if (resolvedProperty?.shareUrl) return resolvedProperty.shareUrl
        if (typeof window !== 'undefined') return window.location.href
        return ''
    }, [resolvedProperty?.shareUrl])

    const shareText = resolvedProperty?.title
        ? `Check out ${resolvedProperty.title} in ${resolvedProperty?.community || 'Dubai'}.`
        : 'Check out this Dubai property.'

    const shareOptions = useMemo(() => {
        const encodedUrl = encodeURIComponent(shareUrl)
        const encodedText = encodeURIComponent(shareText)
        return [
            {
                id: 'email',
                label: 'Email',
                href: `mailto:?subject=${encodeURIComponent(resolvedProperty?.title || 'Property Inquiry')}&body=${encodeURIComponent(
                    `${shareText} ${shareUrl}`
                )}`,
                Icon: MdOutlineMarkEmailRead,
            },
            {
                id: 'facebook',
                label: 'Facebook',
                href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
                Icon: MdOutlineFacebook,
            },
            {
                id: 'linkedin',
                label: 'LinkedIn',
                href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
                Icon: FaLinkedin,
            },
            {
                id: 'instagram',
                label: 'Copy link',
                type: 'copy',
                Icon: FaInstagram,
            },
            {
                id: 'whatsapp-share',
                label: 'WhatsApp',
                href: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
                Icon: FaWhatsapp,
            },
        ]
    }, [resolvedProperty?.title, shareText, shareUrl])

    const messageText = `Hello ${agent.name || 'Grand Gate Properties'},\n\nI would like to schedule a viewing for:\n${resolvedProperty?.title || 'this property'}\n\nLocation: ${resolvedProperty?.community || 'Dubai'}\nPrice: ${priceLabel}\n\nPlease contact me to arrange a viewing.\n\nThank you.`
    const encodedMessage = encodeURIComponent(messageText)

    const whatsappHref = agent?.whatsapp ? `https://wa.me/${sanitizeDigits(agent.whatsapp)}?text=${encodedMessage}` : undefined
    const callHref = agent?.phone ? `tel:${sanitizeDigits(agent.phone)}` : undefined

    const handleInquiry = () => {
        if (!agent?.whatsapp) return
        window.open(`https://wa.me/${sanitizeDigits(agent.whatsapp)}?text=${encodedMessage}`, '_blank');
    }

    const handleCopyLink = async () => {
        try {
            if (navigator?.clipboard && shareUrl) {
                await navigator.clipboard.writeText(shareUrl)
            }
        } catch {
            // ignore copy failures
        }
    }

    const [direction, setDirection] = useState(0)

    const handlePrevImage = useCallback(() => {
        setDirection(-1)
        setCurrentImageIdx((prev) => (prev === 0 ? gallery.length - 1 : prev - 1))
    }, [gallery.length])

    const handleNextImage = useCallback(() => {
        setDirection(1)
        setCurrentImageIdx((prev) => (prev === gallery.length - 1 ? 0 : prev + 1))
    }, [gallery.length])

    const slideVariants = {
        enter: (direction) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0
        })
    }

    const swipeConfidenceThreshold = 10000;
    const swipePower = (offset, velocity) => {
        return Math.abs(offset) * velocity;
    };

    if (!resolvedProperty) {
        return (
            <div className="min-h-[50vh] bg-[#111010] flex items-center justify-center text-gray-400">
                Property details unavailable.
            </div>
        )
    }

    const amenities = resolvedProperty?.amenities ?? []
    const schoolsNearby = resolvedProperty?.schoolsNearby ?? []
    const listingDetails = [
        { label: 'Location', value: resolvedProperty?.location },
        { label: 'Price per sq.ft', value: pricePerSqftLabel },
        { label: 'RERA No.', value: resolvedProperty?.rera },
        { label: 'Reference No.', value: resolvedProperty?.reference },
        { label: 'DLD Permit Number', value: resolvedProperty?.dldPermit },
        { label: 'Furnishing', value: resolvedProperty?.furnishing },
        { label: 'Property type', value: propertyType },
        { label: 'Parking Lots', value: resolvedProperty?.parkingLots },
    ].filter((item) => item.value)

    const marketInsights = resolvedProperty?.marketInsights ?? []
    const areaStats = resolvedProperty?.stats ?? {}
    const heroImage = resolvedProperty?.heroImage || areaStats.heroImage || gallery[0] || 'https://fnst.axflare.com/community/WEBP/oyLcYvyrCp.webp'
    const mapEmbedUrl = resolvedProperty?.mapEmbedUrl || MAP_FALLBACK

    const amenityRows = useMemo(() => {
        const rows = []
        for (let i = 0; i < amenities.length; i += 4) {
            rows.push(amenities.slice(i, i + 4))
        }
        return rows
    }, [amenities])

    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-[#111010] pb-24 lg:pb-0">
            <div className="py-4 text-xs sm:text-sm">
                <div className="max-w-[99rem] mx-auto px-4 sm:px-6">
                    {breadcrumbs.map((crumb, idx) => (
                        <React.Fragment key={`${crumb.label}-${idx}`}>
                            <a
                                href={crumb.path}
                                className={`transition ${crumb.path === '#' ? 'text-[#D3A188] font-semibold' : 'text-gray-400 hover:text-[#D3A188]'}`}
                            >
                                {crumb.label}
                            </a>
                            {idx < breadcrumbs.length - 1 && <span className="text-gray-600 mx-1 sm:mx-2">›</span>}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            <div className="max-w-[99rem] mx-auto px-4 sm:px-6 py-6 sm:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px] gap-6 lg:gap-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="w-full"
                    >
                        <div className="mb-6 flex flex-col lg:flex-row gap-4">
                            <div
                                className="relative w-full h-64 sm:h-80 lg:h-[28rem] bg-gray-900 overflow-hidden group rounded-lg cursor-zoom-in"
                                onClick={() => gallery.length && setIsZoomed(true)}
                            >
                                <AnimatePresence initial={false} custom={direction} mode='popLayout'>
                                    {gallery.length ? (
                                        <motion.img
                                            key={currentImageIdx}
                                            src={gallery[currentImageIdx]}
                                            custom={direction}
                                            variants={slideVariants}
                                            initial="enter"
                                            animate="center"
                                            exit="exit"
                                            transition={{
                                                x: { type: "spring", stiffness: 300, damping: 30 },
                                                opacity: { duration: 0.2 }
                                            }}
                                            drag="x"
                                            dragConstraints={{ left: 0, right: 0 }}
                                            dragElastic={1}
                                            onDragEnd={(e, { offset, velocity }) => {
                                                const swipe = swipePower(offset.x, velocity.x);

                                                if (swipe < -swipeConfidenceThreshold) {
                                                    handleNextImage();
                                                } else if (swipe > swipeConfidenceThreshold) {
                                                    handlePrevImage();
                                                }
                                            }}
                                            alt={`${resolvedProperty.title} - Image ${currentImageIdx + 1}`}
                                            className="w-full h-full object-cover absolute inset-0 cursor-grab active:cursor-grabbing"
                                            loading="eager"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-500">Images unavailable</div>
                                    )}
                                </AnimatePresence>

                                {gallery.length > 1 && (
                                    <>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handlePrevImage();
                                            }}
                                            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 sm:p-3 rounded-full transition opacity-100 lg:opacity-0 lg:group-hover:opacity-100 z-10"
                                            aria-label="Previous image"
                                        >
                                            ❮
                                        </button>

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleNextImage();
                                            }}
                                            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 sm:p-3 rounded-full transition opacity-100 lg:opacity-0 lg:group-hover:opacity-100 z-10"
                                            aria-label="Next image"
                                        >
                                            ❯
                                        </button>
                                    </>
                                )}

                                {gallery.length > 0 && (
                                    <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-2 rounded text-sm font-semibold">
                                        {currentImageIdx + 1} / {gallery.length}
                                    </div>
                                )}
                            </div>

                            {gallery.length > 1 && (
                                <div className="flex lg:flex-col gap-2 overflow-auto no-scrollbar">
                                    {gallery.slice(0, 5).map((img, idx) => (
                                        <button
                                            key={`${img}-${idx}`}
                                            onClick={() => setCurrentImageIdx(idx)}
                                            className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition flex-shrink-0 relative ${currentImageIdx === idx
                                                ? 'border-[#D3A188]'
                                                : 'border-gray-600 hover:border-gray-500'
                                                }`}
                                            aria-label={`Go to image ${idx + 1}`}
                                        >
                                            <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
                                            {idx === 4 && gallery.length > 5 && (
                                                <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-white font-semibold text-sm">
                                                    +{gallery.length - 5}
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <h1 className="text-xl sm:text-2xl lg:text-[30px] text-white mb-4 sm:mb-8 leading-tight">{resolvedProperty.title}</h1>
                        <p className="text-gray-400 text-base sm:text-lg lg:text-xl pb-6">{resolvedProperty.description}</p>
                    </motion.div>

                    <aside className="w-full lg:sticky lg:top-20 self-start flex flex-col gap-8">
                        <div className="p-6 border border-gray-700 text-gray-400 rounded-lg bg-[#0f0f0f]">
                            <div className="flex gap-5 mb-6">
                                <img
                                    src={agent.avatar || 'https://via.placeholder.com/96'}
                                    alt={agent.name || 'Agent'}
                                    className="w-24 h-24 object-cover border-2 border-[#996515] rounded-full"
                                />

                                <div className="flex flex-col justify-center">
                                    <h2 className="text-xl font-semibold text-white">{agent.name || 'Your advisor'}</h2>
                                    <p className="text-gray-500 text-sm">{agent.title || 'Property Consultant'}</p>

                                    <div className="flex gap-3 mt-2 text-gray-400">
                                        {agent.facebook && (
                                            <a href={agent.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-[#1877F2] transition-colors">
                                                <MdOutlineFacebook size={20} />
                                            </a>
                                        )}
                                        {agent.instagram && (
                                            <a href={agent.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-[#E4405F] transition-colors">
                                                <FaInstagram size={18} />
                                            </a>
                                        )}
                                        {agent.linkedin && (
                                            <a href={agent.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-[#0A66C2] transition-colors">
                                                <FaLinkedin size={18} />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex gap-3">
                                    <a
                                        href={whatsappHref || '#'}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`px-2 flex items-center justify-center gap-2 flex-1 py-3 border rounded transition ${whatsappHref
                                            ? 'border-[#996515] text-[#996515] hover:bg-[#996515]/10'
                                            : 'border-gray-700 text-gray-600 cursor-not-allowed'
                                            }`}
                                        title="WhatsApp"
                                    >
                                        <FaWhatsapp className="text-xl" /> <span className="hidden sm:inline">WhatsApp</span>
                                    </a>

                                    <a
                                        href={agent?.phone ? `sms:${sanitizeDigits(agent.phone)}?body=${encodedMessage}` : '#'}
                                        className={`flex items-center justify-center gap-2 flex-1 py-3 border rounded transition ${agent?.phone
                                            ? 'border-[#996515] text-[#996515] hover:bg-[#996515]/10'
                                            : 'border-gray-700 text-gray-600 cursor-not-allowed'
                                            }`}
                                        title="Send SMS"
                                    >
                                        <FaCommentDots className="text-xl" /> <span className="hidden sm:inline">SMS</span>
                                    </a>

                                    <a
                                        href={callHref || '#'}
                                        className={`flex items-center justify-center gap-2 flex-1 py-3 border rounded transition ${callHref
                                            ? 'border-[#996515] text-[#996515] hover:bg-[#996515]/10'
                                            : 'border-gray-700 text-gray-600 cursor-not-allowed'
                                            }`}
                                        title="Call Now"
                                    >
                                        <MdCall className="text-xl" /> <span className="hidden sm:inline">Call</span>
                                    </a>
                                </div>

                                <button
                                    type="button"
                                    className={`w-full py-3 rounded ${agent?.whatsapp ? 'bg-[#a06917b2] text-gray-100 hover:bg-[#a06917]' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}
                                    onClick={handleInquiry}
                                >
                                    Send Inquiry
                                </button>
                            </div>
                        </div>

                        {marketInsights.length > 0 && (
                            <div className="p-6 border border-gray-700 rounded-lg bg-[#0f0f0f] text-gray-300 space-y-4">
                                {marketInsights.map((insight, idx) => (
                                    <React.Fragment key={`${insight.label}-${idx}`}>
                                        <div>
                                            <p className="text-sm text-gray-400">{insight.label}</p>
                                            <p className="text-lg text-white">{insight.value}</p>
                                        </div>
                                        {idx < marketInsights.length - 1 && <div className="border-t border-gray-800" />}
                                    </React.Fragment>
                                ))}
                            </div>
                        )}

                        <div className="p-6 border border-gray-700 rounded-lg bg-[#0f0f0f]">
                            <h2 className="text-lg text-center mb-4 text-white">Share With</h2>

                            <div className="flex items-center justify-center gap-4 flex-wrap">
                                {shareOptions.map(({ id, Icon, href, type, label }) =>
                                    href ? (
                                        <a
                                            key={id}
                                            href={href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-2xl text-gray-300 hover:text-[#D3A188] transition"
                                            aria-label={`Share via ${label}`}
                                        >
                                            <Icon />
                                        </a>
                                    ) : (
                                        <button
                                            key={id}
                                            type="button"
                                            onClick={type === 'copy' ? handleCopyLink : undefined}
                                            className="text-2xl text-gray-300 hover:text-[#D3A188] transition"
                                            aria-label={label}
                                        >
                                            <Icon />
                                        </button>
                                    )
                                )}
                            </div>
                        </div>
                    </aside>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:gap-8 w-full lg:max-w-[70%]">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="w-full"
                    >
                        <div className="border border-[#d3a1888c] p-4 sm:p-6 mb-6 sm:mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-2 sm:gap-4">
                            <p className="text-[#cea591] text-2xl sm:text-3xl">{priceLabel}</p>
                            {pricePerSqftLabel && <p className="text-gray-400 text-base sm:text-lg">{pricePerSqftLabel}</p>}
                        </div>

                        <div className="border-t border-b border-gray-800 py-6 sm:py-8 my-8">
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-8 gap-x-4">
                                {bedrooms && (
                                    <div className="flex flex-col items-center justify-center text-center px-2">
                                        <div className="flex items-center gap-2 mb-1">
                                            <FaBed className="text-[#D3A188] text-xl sm:text-2xl" />
                                            <span className="text-white text-lg sm:text-xl font-medium">{bedrooms}</span>
                                        </div>
                                        <p className="text-gray-500 text-xs sm:text-sm uppercase tracking-wider">Bedrooms</p>
                                    </div>
                                )}
                                {bathrooms && (
                                    <div className="flex flex-col items-center justify-center text-center px-2">
                                        <div className="flex items-center gap-2 mb-1">
                                            <FaBath className="text-[#D3A188] text-xl sm:text-2xl" />
                                            <span className="text-white text-lg sm:text-xl font-medium">{bathrooms}</span>
                                        </div>
                                        <p className="text-gray-500 text-xs sm:text-sm uppercase tracking-wider">Bathrooms</p>
                                    </div>
                                )}
                                {sqftLabel && (
                                    <div className="flex flex-col items-center justify-center text-center px-2">
                                        <div className="flex items-center gap-2 mb-1">
                                            <FaRulerCombined className="text-[#D3A188] text-xl sm:text-2xl" />
                                            <span className="text-white text-lg sm:text-xl font-medium">{sqftLabel}</span>
                                        </div>
                                        <p className="text-gray-500 text-xs sm:text-sm uppercase tracking-wider">Total Area</p>
                                    </div>
                                )}
                                {propertyType && (
                                    <div className="flex flex-col items-center justify-center text-center px-2">
                                        <div className="flex items-center gap-2 mb-1">
                                            <FaHome className="text-[#D3A188] text-xl sm:text-2xl" />
                                            <span className="text-white text-lg sm:text-xl font-medium truncate max-w-[120px] sm:max-w-none" title={propertyType}>{propertyType}</span>
                                        </div>
                                        <p className="text-gray-500 text-xs sm:text-sm uppercase tracking-wider">Property Type</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="py-4 sm:py-6 rounded-lg">
                            <h2 className="text-xl sm:text-2xl text-white">About This Property</h2>
                            <p className="text-gray-300 text-sm sm:text-base mt-3 sm:mt-4 leading-relaxed">{resolvedProperty.description}</p>
                        </div>


                        {amenities.length > 0 && (
                            <div className="py-6 mt-6">
                                <Heading as="h3" size="h3" color="white">Features & Amenities</Heading>
                                <div className="overflow-x-auto mt-4 border border-gray-700">
                                    <table className="min-w-full text-sm text-left text-gray-300">
                                        <tbody>
                                            <tr className="border-b border-gray-700">
                                                <td className="py-3 px-2 font-medium border-r border-gray-700">Bedrooms</td>
                                                <td className="py-3 px-2">{bedrooms}</td>
                                            </tr>
                                            <tr className="border-b border-gray-700">
                                                <td className="py-3 px-2 font-medium border-r border-gray-700">Bathrooms</td>
                                                <td className="py-3 px-2">{bathrooms}</td>
                                            </tr>
                                            <tr className="border-b border-gray-700">
                                                <td className="py-3 px-2 font-medium border-r border-gray-700">Size</td>
                                                <td className="py-3 px-2">{sqftLabel}</td>
                                            </tr>
                                            <tr className="border-b border-gray-700">
                                                <td className="py-3 px-2 font-medium border-r border-gray-700">Type</td>
                                                <td className="py-3 px-2">{propertyType}</td>
                                            </tr>
                                            {amenityRows.map((cols, idx) => (
                                                <tr key={`amenity-row-${idx}`} className="border-b border-gray-700">
                                                    {Array.from({ length: 4 }).map((_, colIdx) => (
                                                        <td
                                                            key={`${idx}-${colIdx}`}
                                                            className={`py-3 px-2 ${colIdx < 3 ? 'border-r border-gray-700' : ''}`}
                                                        >
                                                            {cols[colIdx] ?? ''}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {listingDetails.length > 0 && (
                            <div className="py-6 mt-6">
                                <Heading as="h3" size="h3" color="white">Listing Details</Heading>
                                <div className="border border-gray-600 p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-gray-300 text-sm">
                                    {listingDetails.map((detail) => (
                                        <div key={detail.label}>
                                            <p className="font-medium text-gray-200">{detail.label}</p>
                                            <p className="mt-1">{detail.value}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="py-6 border-t border-gray-600">
                            <p className="text-gray-300 text-xl mt-2">Location</p>

                            <div className="mt-4 w-full h-[28rem] bg-black rounded overflow-hidden border border-gray-700">
                                <iframe
                                    src={mapEmbedUrl}
                                    title="Property location map"
                                    className="w-full h-full rounded filter invert grayscale contrast-[1.3] brightness-[0.9]"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                            </div>
                        </div>
                        {schoolsNearby.length > 0 && (
                            <div className="py-6 rounded-lg mt-6">
                                <Heading as="h3" size="h3" color="white">Schools Nearby</Heading>
                                <ul className="border border-gray-600 p-4 mt-4 space-y-2 text-gray-300">
                                    {schoolsNearby.map((school, idx) => (
                                        <li key={`${school}-${idx}`}>{school}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Buildings Section */}
                        {resolvedProperty?.buildings?.length > 0 && (
                            <div className="py-6 mt-6">
                                <Heading as="h3" size="h3" color="white">Building Details</Heading>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                                    {resolvedProperty.buildings.map((building, idx) => (
                                        <div key={`building-${idx}`} className="border border-gray-700 rounded-lg p-4 bg-[#0f0f0f]">
                                            <h4 className="text-[#D3A188] text-lg font-semibold mb-3">{building.name}</h4>
                                            <div className="space-y-2 text-sm text-gray-300">
                                                <p><span className="text-gray-400">Floors:</span> {building.floors}</p>
                                                <p><span className="text-gray-400">Apartments:</span> {building.apartments}</p>
                                                {building.commercialSpace && (
                                                    <p><span className="text-gray-400">Commercial:</span> {building.commercialSpace.toLocaleString()} m²</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Commercial Units Section */}
                        {resolvedProperty?.commercialUnits?.length > 0 && (
                            <div className="py-6 mt-6">
                                <Heading as="h3" size="h3" color="white">Commercial Spaces</Heading>
                                <div className="overflow-x-auto mt-4 border border-gray-700 rounded-lg">
                                    <table className="min-w-full text-sm text-left text-gray-300">
                                        <thead className="bg-[#1a1a1a] text-[#D3A188]">
                                            <tr>
                                                <th className="py-3 px-4 border-b border-gray-700">Floor</th>
                                                <th className="py-3 px-4 border-b border-gray-700">Area (m²)</th>
                                                <th className="py-3 px-4 border-b border-gray-700">Price/Rent</th>
                                                <th className="py-3 px-4 border-b border-gray-700">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {resolvedProperty.commercialUnits.map((unit, idx) => (
                                                <tr key={`unit-${idx}`} className="border-b border-gray-700 hover:bg-[#1a1a1a]">
                                                    <td className="py-3 px-4">{unit.floor}</td>
                                                    <td className="py-3 px-4">{unit.area?.toLocaleString()}</td>
                                                    <td className="py-3 px-4">
                                                        {unit.totalPrice ? `$${unit.totalPrice.toLocaleString()}` :
                                                            unit.rentalPrice ? `$${unit.rentalPrice.toLocaleString()}/mo` :
                                                                unit.pricePerSqm ? `$${unit.pricePerSqm}/m²` : '—'}
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <span className={`px-2 py-1 rounded text-xs font-medium ${unit.status === 'Available' ? 'bg-green-900/50 text-green-400' :
                                                            unit.status === 'Leased' ? 'bg-yellow-900/50 text-yellow-400' : 'bg-gray-700 text-gray-300'
                                                            }`}>
                                                            {unit.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Nearby Landmarks Section */}
                        {resolvedProperty?.nearbyLandmarks?.length > 0 && (
                            <div className="py-6 mt-6">
                                <Heading as="h3" size="h3" color="white">Nearby Landmarks</Heading>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
                                    {resolvedProperty.nearbyLandmarks.map((landmark, idx) => (
                                        <div key={`landmark-${idx}`} className="flex items-center justify-between border border-gray-700 rounded-lg p-3 bg-[#0f0f0f]">
                                            <span className="text-gray-300 text-sm">{landmark.name}</span>
                                            <span className="text-[#D3A188] text-sm font-medium">{landmark.distance}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Investment Highlights Section */}
                        {resolvedProperty?.investmentHighlights?.length > 0 && (
                            <div className="py-6 mt-6">
                                <Heading as="h3" size="h3" color="white">Investment Highlights</Heading>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                                    {resolvedProperty.investmentHighlights.map((highlight, idx) => (
                                        <div key={`highlight-${idx}`} className="flex items-start gap-3 border border-gray-700 rounded-lg p-4 bg-[#0f0f0f]">
                                            <FaCheckCircle className="text-[#D3A188] text-lg flex-shrink-0 mt-0.5" />
                                            <span className="text-gray-300 text-sm">{highlight}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Available Units Section (Responsive) */}
                        {resolvedProperty?.units?.length > 0 && (
                            <div className="py-6 mt-6">
                                <Heading as="h3" size="h3" color="white">Available Configurations</Heading>

                                {/* Mobile View: Cards */}
                                <div className="md:hidden mt-4 space-y-4">
                                    {resolvedProperty.units.map((unit, idx) => (
                                        <div key={`unit-card-${idx}`} className="border border-gray-700 rounded-lg p-4 bg-[#0f0f0f]">
                                            <div className="flex justify-between items-start mb-2 gap-2">
                                                <h4 className="font-semibold text-white text-base">{unit.title}</h4>
                                                <span className="font-bold text-[#D3A188] text-sm whitespace-nowrap">
                                                    {formatCurrency(unit.price, resolvedProperty.currency)}
                                                </span>
                                            </div>

                                            <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-400 mb-3">
                                                {unit.bedrooms && (
                                                    <span className="flex items-center gap-1"><FaBed /> {unit.bedrooms} Bed</span>
                                                )}
                                                {unit.bathrooms && (
                                                    <span className="flex items-center gap-1"><FaBath /> {unit.bathrooms} Bath</span>
                                                )}
                                                {(unit.sqft || unit.sqftRange) && (
                                                    <span className="flex items-center gap-1"><FaRulerCombined /> {unit.sqft?.toLocaleString() ?? unit.sqftRange} sq.ft</span>
                                                )}
                                            </div>

                                            {unit.description && (
                                                <p className="text-sm text-gray-500 border-t border-gray-700 pt-3 mt-1 leading-relaxed">
                                                    {unit.description}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* Desktop View: Table */}
                                <div className="hidden md:block overflow-x-auto mt-4 border border-gray-700 rounded-lg">
                                    <table className="min-w-full text-sm text-left text-gray-300">
                                        <thead className="bg-[#1a1a1a] text-[#D3A188]">
                                            <tr>
                                                <th className="py-3 px-4 border-b border-gray-700">Unit Type</th>
                                                <th className="py-3 px-4 border-b border-gray-700">Key Features</th>
                                                <th className="py-3 px-4 border-b border-gray-700">Size (sq.ft)</th>
                                                <th className="py-3 px-4 border-b border-gray-700">Price</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {resolvedProperty.units.map((unit, idx) => (
                                                <tr key={`unit-config-${idx}`} className="border-b border-gray-700 hover:bg-[#1a1a1a] transition-colors">
                                                    <td className="py-3 px-4">
                                                        <div className="font-semibold text-white">{unit.title}</div>
                                                        <div className="text-xs text-gray-500 mt-1">
                                                            {[
                                                                unit.bedrooms ? `${unit.bedrooms} Bed` : null,
                                                                unit.bathrooms ? `${unit.bathrooms} Bath` : null
                                                            ].filter(Boolean).join(' • ')}
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4 text-xs text-gray-400 max-w-xs">{unit.description}</td>
                                                    <td className="py-3 px-4 whitespace-nowrap">{unit.sqft?.toLocaleString() ?? unit.sqftRange ?? '—'}</td>
                                                    <td className="py-3 px-4 font-bold text-[#D3A188] whitespace-nowrap">
                                                        {formatCurrency(unit.price, resolvedProperty.currency)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Unit Types Section */}
                        {resolvedProperty?.unitTypes?.length > 0 && (
                            <div className="py-6 mt-6">
                                <Heading as="h3" size="h3" color="white">Unit Types & Investment Returns</Heading>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                                    {resolvedProperty.unitTypes.map((unit, idx) => (
                                        <div key={`unit-type-${idx}`} className="border border-gray-700 rounded-lg p-4 bg-[#0f0f0f]">
                                            <h4 className="text-[#D3A188] text-lg font-semibold mb-3">{unit.type}</h4>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-400">Investment:</span>
                                                    <span className="text-white font-medium">${unit.totalInvestment?.toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-400">Annual Income:</span>
                                                    <span className="text-green-400 font-medium">${unit.annualIncome?.toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between pt-2 border-t border-gray-700">
                                                    <span className="text-gray-400">ROI:</span>
                                                    <span className="text-[#D3A188] font-bold text-lg">{unit.roi}%</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Rental Projections Section */}
                        {resolvedProperty?.rentalProjections && (
                            <div className="py-6 mt-6">
                                <Heading as="h3" size="h3" color="white">Rental Income Projections</Heading>

                                {/* Annual Growth & Season Info */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                                    <div className="border border-gray-700 rounded-lg p-4 bg-[#0f0f0f] text-center">
                                        <p className="text-gray-400 text-xs mb-1">Annual Growth</p>
                                        <p className="text-[#D3A188] text-2xl font-bold">{resolvedProperty.rentalProjections.annualPriceGrowth}%</p>
                                    </div>
                                    {resolvedProperty.rentalProjections.minimumRentalDays && (
                                        <>
                                            <div className="border border-gray-700 rounded-lg p-4 bg-[#0f0f0f] text-center">
                                                <p className="text-gray-400 text-xs mb-1">Off-Season</p>
                                                <p className="text-white text-xl font-semibold">{resolvedProperty.rentalProjections.minimumRentalDays.offSeason} days</p>
                                            </div>
                                            <div className="border border-gray-700 rounded-lg p-4 bg-[#0f0f0f] text-center">
                                                <p className="text-gray-400 text-xs mb-1">Mid-Season</p>
                                                <p className="text-white text-xl font-semibold">{resolvedProperty.rentalProjections.minimumRentalDays.midSeason} days</p>
                                            </div>
                                            <div className="border border-gray-700 rounded-lg p-4 bg-[#0f0f0f] text-center">
                                                <p className="text-gray-400 text-xs mb-1">Peak Season</p>
                                                <p className="text-white text-xl font-semibold">{resolvedProperty.rentalProjections.minimumRentalDays.peakSeason} days</p>
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Monthly Rates Table */}
                                {resolvedProperty.rentalProjections.monthlyRates && (
                                    <div className="mt-6 overflow-x-auto">
                                        <p className="text-gray-300 text-sm mb-3">Monthly Rental Rates (USD)</p>
                                        <table className="min-w-full text-xs text-center border border-gray-700 rounded-lg overflow-hidden">
                                            <thead className="bg-[#1a1a1a]">
                                                <tr>
                                                    <th className="py-2 px-2 text-[#D3A188] border-b border-gray-700">Unit</th>
                                                    <th className="py-2 px-2 text-gray-400 border-b border-gray-700">Jan</th>
                                                    <th className="py-2 px-2 text-gray-400 border-b border-gray-700">Feb</th>
                                                    <th className="py-2 px-2 text-gray-400 border-b border-gray-700">Mar</th>
                                                    <th className="py-2 px-2 text-gray-400 border-b border-gray-700">Apr</th>
                                                    <th className="py-2 px-2 text-gray-400 border-b border-gray-700">May</th>
                                                    <th className="py-2 px-2 text-yellow-400 border-b border-gray-700">Jun</th>
                                                    <th className="py-2 px-2 text-green-400 border-b border-gray-700">Jul</th>
                                                    <th className="py-2 px-2 text-green-400 border-b border-gray-700">Aug</th>
                                                    <th className="py-2 px-2 text-yellow-400 border-b border-gray-700">Sep</th>
                                                    <th className="py-2 px-2 text-gray-400 border-b border-gray-700">Oct</th>
                                                    <th className="py-2 px-2 text-gray-400 border-b border-gray-700">Nov</th>
                                                    <th className="py-2 px-2 text-gray-400 border-b border-gray-700">Dec</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {Object.entries(resolvedProperty.rentalProjections.monthlyRates).map(([unitType, rates], idx) => (
                                                    <tr key={`rate-${idx}`} className="border-b border-gray-700 hover:bg-[#1a1a1a]">
                                                        <td className="py-2 px-2 text-[#D3A188] font-medium capitalize">{unitType.replace(/([A-Z])/g, ' $1').trim()}</td>
                                                        <td className="py-2 px-2 text-gray-300">${rates.jan}</td>
                                                        <td className="py-2 px-2 text-gray-300">${rates.feb}</td>
                                                        <td className="py-2 px-2 text-gray-300">${rates.mar}</td>
                                                        <td className="py-2 px-2 text-gray-300">${rates.apr}</td>
                                                        <td className="py-2 px-2 text-gray-300">${rates.may}</td>
                                                        <td className="py-2 px-2 text-yellow-300">${rates.jun}</td>
                                                        <td className="py-2 px-2 text-green-300 font-medium">${rates.jul}</td>
                                                        <td className="py-2 px-2 text-green-300 font-medium">${rates.aug}</td>
                                                        <td className="py-2 px-2 text-yellow-300">${rates.sep}</td>
                                                        <td className="py-2 px-2 text-gray-300">${rates.oct}</td>
                                                        <td className="py-2 px-2 text-gray-300">${rates.nov}</td>
                                                        <td className="py-2 px-2 text-gray-300">${rates.dec}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        <p className="text-gray-500 text-xs mt-2">Peak season (Jul-Aug) highlighted in green • Mid-season (Jun, Sep) in yellow</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Developer Info Section */}
                        {resolvedProperty?.developer && typeof resolvedProperty.developer === 'object' && (
                            <div className="py-6 mt-6">
                                <Heading as="h3" size="h3" color="white">Developer Information</Heading>
                                <div className="border border-gray-700 rounded-lg p-6 bg-[#0f0f0f] mt-4">
                                    <h4 className="text-[#D3A188] text-xl font-semibold mb-4">{resolvedProperty.developer.name}</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                        {resolvedProperty.developer.established && (
                                            <div>
                                                <p className="text-gray-400">Established</p>
                                                <p className="text-gray-200">{resolvedProperty.developer.established}</p>
                                            </div>
                                        )}
                                        {resolvedProperty.developer.experience && (
                                            <div>
                                                <p className="text-gray-400">Experience</p>
                                                <p className="text-gray-200">{resolvedProperty.developer.experience}</p>
                                            </div>
                                        )}
                                        {resolvedProperty.developer.specialization && (
                                            <div>
                                                <p className="text-gray-400">Specialization</p>
                                                <p className="text-gray-200">{resolvedProperty.developer.specialization}</p>
                                            </div>
                                        )}
                                        {resolvedProperty.developer.website && (
                                            <div>
                                                <p className="text-gray-400">Website</p>
                                                <a href={`https://${resolvedProperty.developer.website}`} target="_blank" rel="noopener noreferrer" className="text-[#D3A188] hover:underline">
                                                    {resolvedProperty.developer.website}
                                                </a>
                                            </div>
                                        )}
                                        {resolvedProperty.developer.phone && (
                                            <div>
                                                <p className="text-gray-400">Phone</p>
                                                <a href={`tel:${resolvedProperty.developer.phone}`} className="text-gray-200 hover:text-[#D3A188]">
                                                    {resolvedProperty.developer.phone}
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                    {resolvedProperty.developer.certifications?.length > 0 && (
                                        <div className="mt-4 pt-4 border-t border-gray-700">
                                            <p className="text-gray-400 text-sm mb-2">Certifications</p>
                                            <div className="flex flex-wrap gap-2">
                                                {resolvedProperty.developer.certifications.map((cert, idx) => (
                                                    <span key={`cert-${idx}`} className="px-3 py-1 bg-[#D3A188]/10 text-[#D3A188] text-xs rounded-full border border-[#D3A188]/30">
                                                        {cert}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Contact Info Section */}
                        {resolvedProperty?.contactInfo && (
                            <div className="py-6 mt-6">
                                <Heading as="h3" size="h3" color="white">Contact Information</Heading>
                                <div className="border border-gray-700 rounded-lg p-6 bg-[#0f0f0f] mt-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                        {resolvedProperty.contactInfo.phone && (
                                            <div className="flex items-center gap-3">
                                                <FaPhone className="text-[#D3A188]" />
                                                <a href={`tel:${resolvedProperty.contactInfo.phone}`} className="text-gray-200 hover:text-[#D3A188]">
                                                    {resolvedProperty.contactInfo.phone}
                                                </a>
                                            </div>
                                        )}
                                        {resolvedProperty.contactInfo.alternatePhone && (
                                            <div className="flex items-center gap-3">
                                                <FaMobile className="text-[#D3A188]" />
                                                <a href={`tel:${resolvedProperty.contactInfo.alternatePhone}`} className="text-gray-200 hover:text-[#D3A188]">
                                                    {resolvedProperty.contactInfo.alternatePhone}
                                                </a>
                                            </div>
                                        )}
                                        {resolvedProperty.contactInfo.website && (
                                            <div className="flex items-center gap-3">
                                                <FaGlobe className="text-[#D3A188]" />
                                                <a href={`https://${resolvedProperty.contactInfo.website}`} target="_blank" rel="noopener noreferrer" className="text-[#D3A188] hover:underline">
                                                    {resolvedProperty.contactInfo.website}
                                                </a>
                                            </div>
                                        )}
                                        {resolvedProperty.contactInfo.social && (
                                            <div className="flex items-center gap-3">
                                                <FaInstagram className="text-[#D3A188]" />
                                                <span className="text-gray-200">@{resolvedProperty.contactInfo.social}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>

            <div className="border border-gray-800"></div>

            <div className="w-full text-white py-8 sm:py-12 lg:py-14 flex justify-center px-4">
                <div className="max-w-[1400px] w-full flex flex-col lg:flex-row shadow-xl">
                    <div className="w-full lg:w-1/2 bg-gradient-to-br from-black via-[#111111] to-[#222222] p-6 sm:p-8 lg:p-12 flex flex-col justify-center">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light mb-4 sm:mb-6 text-white">
                            {areaStats.areaName || resolvedProperty.community || 'Dubai'}
                        </h2>

                        <p className="text-gray-300 text-base sm:text-lg">
                            Apartments: <span className="text-white">{areaStats.listingCount ?? '—'}</span>
                        </p>
                        <p className="text-gray-300 text-base sm:text-lg mb-4 sm:mb-6">
                            Price from: <span className="text-white">{areaStats.priceFrom ?? '—'}</span>
                        </p>

                        <p className="text-gray-400 text-sm sm:text-base leading-6 sm:leading-7 max-w-full sm:max-w-[450px] mb-6 sm:mb-10">
                            {areaStats.summary || 'Discover handpicked residences with waterfront living and resort amenities.'}
                        </p>

                        <button onClick={() => navigate('/properties')} type="button" className="px-6 sm:px-8 py-2.5 sm:py-3 border border-[#b07b33] text-[#b07b33] hover:bg-[#b07b3315] transition-all duration-300 text-sm sm:text-base">
                            EXPLORE
                        </button>
                    </div>

                    <div className="w-full lg:w-1/2 h-[250px] sm:h-[350px] lg:h-auto">
                        <img
                            src={heroImage}
                            className="w-full h-full object-cover"
                            alt={areaStats.areaName || resolvedProperty.community || 'Community'}
                        />
                    </div>
                </div>
            </div>

            {/* Mobile Fixed Bottom Actions */}
            <motion.div
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="fixed bottom-0 left-0 right-0 bg-[#111010] border-t border-gray-800 p-3 lg:hidden z-40 flex items-center justify-between gap-3 px-4 pb-safe"
            >
                <a
                    href={whatsappHref || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition ${whatsappHref
                        ? 'bg-[#D3A188]/10 border border-[#D3A188] text-[#D3A188] hover:bg-[#D3A188]/20'
                        : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                        }`}
                >
                    <FaWhatsapp className="text-xl" />
                    <span>WhatsApp</span>
                </a>

                <a
                    href={agent?.phone ? `sms:${sanitizeDigits(agent.phone)}?body=${encodedMessage}` : '#'}
                    className={`flex items-center justify-center justify-self-center p-3 rounded-lg transition aspect-square ${agent?.phone
                        ? 'bg-[#D3A188]/20 text-[#D3A188] border border-[#D3A188]/50'
                        : 'bg-gray-800 text-gray-500 border border-gray-700 cursor-not-allowed'
                        }`}
                    title="SMS"
                >
                    <FaCommentDots className="text-xl" />
                </a>

                <a
                    href={callHref || '#'}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition ${callHref
                        ? 'bg-[#D3A188] text-white hover:bg-[#c49278]'
                        : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                        }`}
                >
                    <MdCall className="text-xl" />
                    <span>Call Now</span>
                </a>
            </motion.div>

            {/* Image Zoom Modal */}
            {isZoomed && gallery.length > 0 && (
                <div
                    className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center touch-none"
                    onClick={() => setIsZoomed(false)}
                >
                    {/* Close Button */}
                    <button
                        onClick={() => setIsZoomed(false)}
                        className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 transition z-50"
                        aria-label="Close zoom"
                    >
                        ×
                    </button>

                    {/* Image Counter */}
                    <div className="absolute top-4 left-4 bg-black/60 text-white px-4 py-2 rounded text-sm font-semibold z-50">
                        {currentImageIdx + 1} / {gallery.length}
                    </div>

                    {/* Main Image */}
                    <div className="relative w-full h-full flex items-center justify-center px-4 sm:px-16 overflow-hidden">
                        <AnimatePresence initial={false} custom={direction} mode='popLayout'>
                            <motion.img
                                key={currentImageIdx}
                                src={gallery[currentImageIdx]}
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{
                                    x: { type: "spring", stiffness: 300, damping: 30 },
                                    opacity: { duration: 0.2 }
                                }}
                                drag="x"
                                dragConstraints={{ left: 0, right: 0 }}
                                dragElastic={1}
                                onDragEnd={(e, { offset, velocity }) => {
                                    const swipe = swipePower(offset.x, velocity.x);

                                    if (swipe < -swipeConfidenceThreshold) {
                                        handleNextImage();
                                    } else if (swipe > swipeConfidenceThreshold) {
                                        handlePrevImage();
                                    }
                                }}
                                alt={`${resolvedProperty.title} - Image ${currentImageIdx + 1}`}
                                loading="eager"
                                className="max-w-full max-h-full object-contain absolute cursor-grab active:cursor-grabbing"
                                onClick={(e) => e.stopPropagation()}
                            />
                        </AnimatePresence>

                        {/* Navigation Arrows */}
                        {gallery.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handlePrevImage();
                                    }}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 sm:p-4 rounded-full transition text-xl sm:text-2xl"
                                    aria-label="Previous image"
                                >
                                    ❮
                                </button>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleNextImage();
                                    }}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 sm:p-4 rounded-full transition text-xl sm:text-2xl"
                                    aria-label="Next image"
                                >
                                    ❯
                                </button>
                            </>
                        )}
                    </div>

                    {/* Thumbnail Strip */}
                    {gallery.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto no-scrollbar max-w-[90%] bg-black/60 p-2 rounded-lg">
                            {gallery.map((img, idx) => (
                                <button
                                    key={`zoom-thumb-${idx}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setCurrentImageIdx(idx);
                                    }}
                                    className={`w-16 h-16 rounded overflow-hidden border-2 transition flex-shrink-0 ${currentImageIdx === idx
                                        ? 'border-[#D3A188]'
                                        : 'border-gray-600 hover:border-gray-400'
                                        }`}
                                    aria-label={`Go to image ${idx + 1}`}
                                >
                                    <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default PropertieHeader

