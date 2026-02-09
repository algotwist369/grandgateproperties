import React, { useState, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import Heading from './Heading';

// Helper to format image URLs from backend
const formatImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http') || url.startsWith('blob:')) return url;
    const baseUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000';
    return `${baseUrl}/${url.startsWith('/') ? url.slice(1) : url}`;
};

const PropertyCard = memo(({ property }) => {
    const navigate = useNavigate();
    const [imageLoaded, setImageLoaded] = useState(false);

    const handleViewDetails = useCallback(() => {
        if (!property?.slug) return;
        navigate(`/en/properties/${property.slug}`, {
            state: { propertyId: property.id, property: property.source },
        });
    }, [navigate, property]);

    const handleImageLoad = useCallback(() => {
        setImageLoaded(true);
    }, []);

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
        hover: { y: -8, transition: { duration: 0.4, ease: "easeOut" } }
    };

    return (
        <motion.div
            variants={cardVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            whileHover="hover"
            onClick={handleViewDetails}
            className="group relative w-full aspect-[4/5] sm:aspect-[3/4] bg-neutral-900 rounded-[2rem] overflow-hidden cursor-pointer shadow-2xl shadow-black/50 border border-white/5"
        >
            {/* Image Container */}
            <div className="absolute inset-0 w-full h-full">
                <AnimatePresence mode="wait">
                    {!imageLoaded ? (
                        <motion.div
                            key="shimmer"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-white/5 animate-pulse"
                        />
                    ) : null}
                </AnimatePresence>

                <motion.img
                    src={formatImageUrl(property?.image)}
                    alt={property?.title}
                    onLoad={handleImageLoad}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className={`w-full h-full object-cover transition-opacity duration-700 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                />

                {/* Gradient Overlay for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500"></div>
            </div>

            {/* Bottom Left Title */}
            <div className="absolute bottom-0 left-0 w-full p-6 sm:p-8 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                <Heading
                    as="h3"
                    size="text-2xl sm:text-3xl"
                    weight="font-light"
                    className="text-white uppercase tracking-tight leading-tight mb-2"
                >
                    {property?.title}
                </Heading>
                {/* Discovery Indicator */}
                <div className="h-0.5 w-0 bg-[#BD9B5F] mt-6 group-hover:w-16 transition-all duration-700 ease-in-out"></div>
            </div>

            {/* Top Right Arrow Icon for "Clickability" Cue */}
            <div className="absolute top-6 right-6 w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 group-hover:bg-[#BD9B5F] group-hover:border-[#BD9B5F] group-hover:text-black transition-all duration-500 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7"></line>
                    <polyline points="7 7 17 7 17 17"></polyline>
                </svg>
            </div>
        </motion.div>
    );
}, (prev, next) =>
    prev.property?.id === next.property?.id &&
    prev.property?.image === next.property?.image
);

PropertyCard.displayName = 'PropertyCard';

export default PropertyCard;
