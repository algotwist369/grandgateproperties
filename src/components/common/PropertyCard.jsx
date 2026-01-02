import React, { useState, useCallback, useEffect, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import InquiryModal from './InquiryModal';
import { FaLocationArrow } from "react-icons/fa6";

const PropertyCard = memo(({ property, onModalChange }) => {
    // Helper to get display values (handles both simple and multi-unit properties)
    const getDisplayValues = () => {
        if (!property) return {};

        let priceLabel = property.price;
        let bedsLabel = property.bedrooms;
        let bathsLabel = property.bathrooms;
        let areaLabel = property.area || (property.sqft ? `${property.sqft.toLocaleString()} sq.ft` : null);

        // Handle multi-unit properties (e.g. Bay Grove)
        if (property.units && property.units.length > 0) {
            // Price
            if (property.startingPrice) {
                priceLabel = `From AED ${property.startingPrice.toLocaleString()}`;
            }

            // Beds Range
            const beds = property.units.map(u => u.bedrooms).filter(b => b != null);
            if (beds.length > 0) {
                const minBeds = Math.min(...beds);
                const maxBeds = Math.max(...beds);
                bedsLabel = minBeds === maxBeds ? minBeds : `${minBeds} - ${maxBeds}`;
            }

            // Baths Range
            const baths = property.units.map(u => u.bathrooms).filter(b => b != null);
            if (baths.length > 0) {
                const minBaths = Math.min(...baths);
                const maxBaths = Math.max(...baths);
                bathsLabel = minBaths === maxBaths ? minBaths : `${minBaths} - ${maxBaths}`;
            }

            // Area Range - check for sqft or sqftRange
            const areas = property.units.map(u => u.sqft).filter(a => a != null);
            const ranges = property.units.map(u => u.sqftRange).filter(r => r != null);

            if (areas.length > 0) {
                const minArea = Math.min(...areas);
                const maxArea = Math.max(...areas);
                areaLabel = minArea === maxArea
                    ? `${minArea.toLocaleString()} sq.ft`
                    : `${minArea.toLocaleString()} - ${maxArea.toLocaleString()} sq.ft`;
            } else if (ranges.length > 0) {
                // If we have text ranges like "6,043+ sq.ft", just show the first one or a generic label
                areaLabel = ranges[0];
            }
        }

        return { priceLabel, bedsLabel, bathsLabel, areaLabel };
    };

    const { priceLabel, bedsLabel, bathsLabel, areaLabel } = getDisplayValues();

    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    useEffect(() => {
        onModalChange?.(isModalOpen);
    }, [isModalOpen, onModalChange]);

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
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    return (
        <motion.div
            variants={cardVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            whileHover={{ y: -12 }}
            className="group relative bg-[#0F3E5E]/10 rounded-2xl overflow-hidden border border-white/10 hover:border-[#D3A188]/40 transition-all duration-500 hover:shadow-2xl hover:shadow-[#D3A188]/10"
        >
            {/* Image Section */}
            <div
                className="relative h-64 sm:h-72 overflow-hidden cursor-pointer"
                onClick={handleViewDetails}
            >
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
                    src={property?.image}
                    alt={property?.title}
                    onLoad={handleImageLoad}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className={`w-full h-full object-cover transition-all duration-1000 ${imageLoaded ? 'opacity-100 grayscale-[0.3] group-hover:grayscale-0' : 'opacity-0'}`}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>

                {/* Badges */}
                <div className="absolute top-6 left-6 flex flex-wrap gap-2">
                    <div className="bg-[#D3A188] px-4 py-1.5 rounded-2xl">
                        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-black">
                            {property?.propertyTypes?.join(', ') || property?.type}
                        </span>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-8">
                <div className="space-y-4">
                    <h3
                        onClick={handleViewDetails}
                        className="text-2xl font-light text-white uppercase tracking-tight cursor-pointer hover:text-[#D3A188] transition-colors line-clamp-1"
                    >
                        {property?.title}
                    </h3>

                    <div className="flex items-center gap-2 text-[#D3A188]/80">
                        <FaLocationArrow size={12} />
                        <span className="text-[10px] uppercase tracking-[0.2em] font-medium">{property?.location}</span>
                    </div>

                    {/* Specifications */}
                    <div className="flex items-center gap-6 pt-4 border-t border-white/10">
                        {bedsLabel && (
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] uppercase tracking-[0.1em] text-gray-500">Beds</span>
                                <span className="text-sm text-white font-light">{bedsLabel}</span>
                            </div>
                        )}
                        {bathsLabel && (
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] uppercase tracking-[0.1em] text-gray-500">Baths</span>
                                <span className="text-sm text-white font-light">{bathsLabel}</span>
                            </div>
                        )}
                        {areaLabel && (
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] uppercase tracking-[0.1em] text-gray-500">Area</span>
                                <span className="text-sm text-white font-light">{areaLabel}</span>
                            </div>
                        )}
                    </div>

                    {/* Pricing and Actions */}
                    <div className="pt-6 flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase tracking-[0.2em] text-[#D3A188] font-bold">Investment</span>
                            <span className="text-2xl font-light text-white">{priceLabel}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-6">
                        <button
                            onClick={handleViewDetails}
                            className="py-4 border border-white/10 hover:border-[#D3A188]/30 text-[10px] uppercase tracking-[0.2em] font-bold text-white rounded-2xl transition-all hover:bg-white/5"
                        >
                            Details
                        </button>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="py-4 bg-white text-black hover:bg-[#D3A188] hover:text-white text-[10px] uppercase tracking-[0.2em] font-bold rounded-2xl transition-all shadow-xl hover:shadow-[#D3A188]/20"
                        >
                            Inquire
                        </button>
                    </div>
                </div>
            </div>

            <InquiryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                property={property}
            />
        </motion.div>
    );
}, (prev, next) =>
    prev.property?.id === next.property?.id &&
    prev.property?.image === next.property?.image
);

PropertyCard.displayName = 'PropertyCard';

export default PropertyCard;
