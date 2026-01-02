import React, { useState, useCallback, useEffect, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
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

    return (
        <>
            <div className="rounded-sm overflow-hidden bg-[#0F3E5E]/30 border border-white/10
                hover:border-[#D3A188]/40 transition-all duration-300 shadow-lg hover:shadow-xl">

                {/* Image */}
                <div
                    className="relative h-[220px] md:h-[280px] lg:h-[320px] cursor-pointer"
                    onClick={handleViewDetails}
                >
                    {!imageLoaded && (
                        <div className="absolute inset-0 bg-slate-800 animate-pulse" />
                    )}

                    <img
                        src={property?.image}
                        alt={property?.title || 'Luxury Property'}
                        loading="lazy"
                        decoding="async"
                        onLoad={handleImageLoad}
                        className={`w-full h-full object-cover transition-opacity duration-300
                            ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Type */}
                    <span className="absolute top-3 left-3 bg-[#D3A188] text-[#114566]
                        px-3 py-1 rounded-full text-xs font-semibold">
                        {property?.propertyTypes?.join(', ') || property?.type}
                    </span>

                    {/* Featured */}
                    {property?.featured && (
                        <span className="absolute top-3 right-3 bg-black/60 backdrop-blur
                            text-[#D3A188] border border-[#D3A188]/40
                            px-3 py-1 rounded-full text-xs font-semibold">
                            Featured
                        </span>
                    )}
                </div>

                {/* Content */}
                <div className="p-4 lg:p-5">
                    <h3
                        onClick={handleViewDetails}
                        className="text-lg lg:text-xl font-semibold text-white
                        cursor-pointer hover:text-[#D3A188] transition-colors line-clamp-1"
                    >
                        {property?.title}
                    </h3>

                    <p className="text-[#D3A188] text-sm flex items-center gap-1 mt-1">
                        <FaLocationArrow /> {property?.location}
                    </p>

                    {/* Specs */}
                    <div className="flex gap-4 text-sm text-gray-300 mt-3 border-b border-white/10 pb-3">
                        {bedsLabel && <span>{bedsLabel} Beds</span>}
                        {bathsLabel && <span>{bathsLabel} Baths</span>}
                        {areaLabel && <span>{areaLabel}</span>}
                    </div>

                    {/* Price */}
                    <div className="mt-4 text-2xl font-bold text-[#D3A188]">
                        {priceLabel}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 mt-4">
                        <Button
                            text="View Details"
                            variant="secondary"
                            className="flex-1 text-sm"
                            onClick={handleViewDetails}
                        />
                        <Button
                            text="Inquiry Now"
                            className="flex-1 text-sm font-bold"
                            primaryBg="bg-[#D3A188]"
                            primaryText="text-black"
                            onClick={() => setIsModalOpen(true)}
                        />
                    </div>
                </div>
            </div>

            <InquiryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                property={property}
            />
        </>
    );
}, (prev, next) =>
    prev.property?.id === next.property?.id &&
    prev.property?.image === next.property?.image
);

PropertyCard.displayName = 'PropertyCard';
export default PropertyCard;
