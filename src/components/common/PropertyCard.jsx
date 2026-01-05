import React, { useState, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import Heading from './Heading';
import Button from './Button';
import { FaLocationArrow } from "react-icons/fa6";
import { contactData } from '../../data/contactData';

const PropertyCard = memo(({ property }) => {
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
    const [imageLoaded, setImageLoaded] = useState(false);

    const handleViewDetails = useCallback(() => {
        if (!property?.slug) return;
        navigate(`/en/properties/${property.slug}`, {
            state: { propertyId: property.id, property: property.source },
        });
    }, [navigate, property]);

    const handleInquire = useCallback(() => {
        const whatsappNumber = contactData[0]?.whatsapp;
        if (!whatsappNumber) return;

        const message = encodeURIComponent(
            `Greetings,\n\nI am interested in the ${property?.title} located in ${property?.location}.\n\nCould you please provide more details regarding the pricing and availability?\n\nThank you.`
        );

        window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
    }, [property]);

    const handleImageLoad = useCallback(() => {
        setImageLoaded(true);
    }, []);

    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
        hover: { y: -12, transition: { duration: 0.4, ease: "easeOut" } }
    };

    return (
        <motion.div
            variants={cardVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            whileHover="hover"
            className="group relative bg-[#0F3E5E]/10 rounded-2xl overflow-hidden border border-white/10 hover:border-[#BD9B5F]/40 transition-all duration-500 hover:shadow-2xl hover:shadow-[#BD9B5F]/10"
        >
            {/* Image Section */}
            <div
                className="relative h-60 sm:h-72 overflow-hidden cursor-pointer"
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
                <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex flex-wrap gap-2">
                    <div className="bg-[#BD9B5F] px-3 py-1 sm:px-4 sm:py-1.5 rounded-2xl">
                        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-black">
                            {property?.propertyTypes?.join(', ') || property?.type}
                        </span>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-5 sm:p-7">
                <div className="space-y-4">
                    <div>
                        <Heading
                            as="h3"
                            size="text-xl sm:text-2xl"
                            weight="font-light"
                            className="text-white uppercase tracking-tight cursor-pointer hover:text-[#BD9B5F] transition-colors line-clamp-1 mb-2"
                            onClick={handleViewDetails}
                        >
                            {property?.title}
                        </Heading>

                        <div className="flex items-center gap-2 text-[#BD9B5F]/80">
                            <FaLocationArrow size={10} className="flex-shrink-0" />
                            <span className="text-[10px] uppercase tracking-[0.2em] font-medium truncate">{property?.location}</span>
                        </div>
                    </div>

                    {/* Pricing - Always Visible but refined */}
                    <div className="flex flex-col pt-2">
                        <span className="text-[9px] uppercase tracking-[0.2em] text-[#BD9B5F]/60 font-medium">Investment From</span>
                        <span className="text-xl font-light text-white">{priceLabel}</span>
                    </div>

                    {/* Revealable Details on Hover */}
                    <motion.div
                        initial={{ height: 0, opacity: 0, marginTop: 0 }}
                        variants={{
                            show: { height: 0, opacity: 0, marginTop: 0 },
                            hover: {
                                height: "auto",
                                opacity: 1,
                                marginTop: 16,
                                transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
                            }
                        }}
                        animate={undefined} // Controlled by group-hover via variants
                        className="overflow-hidden border-t border-white/5"
                    >
                        <div className="pt-4 space-y-6">
                            {/* Specifications */}
                            <div className="flex items-center gap-6">
                                {[
                                    { label: 'Beds', value: bedsLabel },
                                    { label: 'Baths', value: bathsLabel },
                                    { label: 'Area', value: areaLabel }
                                ].map((stat, index) => stat.value && (
                                    <div key={index} className="flex flex-col gap-1">
                                        <span className="text-[9px] uppercase tracking-[0.1em] text-gray-500 font-medium">{stat.label}</span>
                                        <span className="text-xs text-white font-light">{stat.value}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Actions */}
                            <div className="grid grid-cols-2 gap-3 pb-2">
                                <Button
                                    text="Details"
                                    onClick={handleViewDetails}
                                    className="py-3.5 border border-white/10 hover:border-[#BD9B5F]/30 text-[9px] uppercase tracking-[0.2em] font-bold text-white transition-all hover:bg-white/5 rounded-xl"
                                />
                                <Button
                                    text="Inquire"
                                    onClick={handleInquire}
                                    primaryBg="bg-[#BD9B5F]"
                                    primaryText="text-black"
                                    className="py-3.5 hover:bg-white hover:text-black text-[9px] uppercase tracking-[0.2em] font-bold transition-all shadow-lg rounded-xl"
                                />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}, (prev, next) =>
    prev.property?.id === next.property?.id &&
    prev.property?.image === next.property?.image
);

PropertyCard.displayName = 'PropertyCard';

export default PropertyCard;
