import React, {
    useState,
    useEffect,
    useMemo,
    useCallback,
    memo,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../common/Button';

/* =======================
   CONFIG / CONSTANTS
======================= */

const LOCATIONS = {
    Dubai: 'DUBAI',
    India: 'INDIA',
};

const SLIDES = ['/hero/hero2.webp'];

const PROPERTY_TYPES = [
    { value: '', label: 'Select Property Type' },
    { value: 'apartment', label: 'Apartment' },
    { value: 'villa', label: 'Villa' },
    { value: 'townhouse', label: 'Townhouse' },
    { value: 'penthouse', label: 'Penthouse' },
    { value: 'studio', label: 'Studio' },
];

const BEDROOM_OPTIONS = [
    { value: '', label: 'Select Bedrooms' },
    { value: '1', label: '1 Bedroom' },
    { value: '2', label: '2 Bedrooms' },
    { value: '3', label: '3 Bedrooms' },
    { value: '4', label: '4 Bedrooms' },
    { value: '5+', label: '5+ Bedrooms' },
];

const PRICE_RANGES = {
    India: [
        'All Prices',
        'Under ₹1 Cr',
        '₹1 Cr - ₹5 Cr',
        '₹5 Cr - ₹20 Cr',
        'Above ₹20 Cr',
    ],
    Dubai: [
        'All Prices',
        'Under 1M AED',
        '1M - 5M AED',
        '5M - 20M AED',
        'Above 20M AED',
    ],
};

/* =======================
   REUSABLE SELECT
======================= */

const SelectField = memo(({ label, value, onChange, options }) => (
    <div>
        <label className="block text-xs lg:text-sm font-medium text-gray-400 mb-2 uppercase tracking-widest">
            {label}
        </label>
        <select
            value={value}
            onChange={onChange}
            className="w-full p-3 lg:p-4 bg-white/5 border border-gray-800 rounded-xl
                       focus:outline-none focus:ring-1 focus:ring-[#D3A188]/50
                       text-white text-sm lg:text-base appearance-none hover:bg-white/10"
        >
            {options.map(opt => (
                <option
                    key={opt.value || opt.label}
                    value={opt.value}
                    className="text-white bg-[#0B0D10]"
                >
                    {opt.label}
                </option>
            ))}
        </select>
    </div>
));

/* =======================
   HERO SECTION
======================= */

const HeroSection = memo(({ selectedCountry, setSelectedCountry }) => {
    const navigate = useNavigate();

    const [currentSlide, setCurrentSlide] = useState(0);
    const [filters, setFilters] = useState({
        propertyType: '',
        bedrooms: '',
        priceRange: 'All Prices',
        autoSearch: true,
    });

    const priceRanges = useMemo(
        () =>
            PRICE_RANGES[selectedCountry].map(r => ({
                label: r,
                value: r,
            })),
        [selectedCountry]
    );

    /* Auto slider */
    useEffect(() => {
        const timer = setInterval(
            () => setCurrentSlide(s => (s + 1) % SLIDES.length),
            5000
        );
        return () => clearInterval(timer);
    }, []);

    /* Handlers */
    const updateFilter = useCallback(
        key => e =>
            setFilters(prev => ({ ...prev, [key]: e.target.value })),
        []
    );

    const handleSearch = useCallback(() => {
        navigate('/en/properties', {
            state: {
                country: selectedCountry,
                ...filters,
            },
        });
    }, [navigate, selectedCountry, filters]);

    return (
        <div className="relative w-full min-h-[600px] sm:h-[700px] lg:h-[850px] bg-black overflow-hidden">

            {/* ================= SLIDER ================= */}
            <div className="absolute inset-0">
                <AnimatePresence mode="wait">
                    {SLIDES.map(
                        (slide, i) =>
                            i === currentSlide && (
                                <motion.img
                                    key={i}
                                    src={slide}
                                    alt="Hero Slide"
                                    className="absolute inset-0 w-full h-full object-cover"
                                    initial={{ opacity: 0, scale: 1.1 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 1.5 }}
                                />
                            )
                    )}
                </AnimatePresence>
            </div>

            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/70" />

            {/* ================= CONTENT ================= */}
            <div className="relative z-10 w-full h-full flex items-center">
                <div className="w-11/12 max-w-[99rem] mx-auto px-4">
                    <div className="md:backdrop-blur-md md:rounded-2xl md:p-6 lg:p-12 md:border md:border-[#D3A188]/20 md:bg-black/10 md:shadow-2xl grid lg:grid-cols-2 gap-12">

                        {/* LEFT */}
                        <div className="hidden md:flex flex-col justify-center gap-6">
                            <h1 className="text-white text-3xl sm:text-4xl lg:text-[56px] leading-snug lg:leading-[1.2] uppercase">
                                INVEST IN{' '}
                                <span className="text-[#D3A188] font-medium">
                                    {LOCATIONS[selectedCountry]}
                                </span>
                                <br />
                                REAL ESTATE WITH{' '}
                                <span className="font-semibold">
                                    Grand Gate
                                </span>
                            </h1>

                            <p className="text-gray-300 max-w-xl text-sm lg:text-xl">
                                Discover premium properties in Dubai, Georgia
                                and India with expert guidance and trust.
                            </p>

                            <div className="flex flex-wrap gap-4">
                                <Button
                                    text="Explore Properties"
                                    onClick={() =>
                                        navigate('/en/properties', {
                                            state: {
                                                country: selectedCountry,
                                            },
                                        })
                                    }
                                />
                                <Button
                                    text="Contact Us"
                                    variant="secondary"
                                    onClick={() =>
                                        navigate('/en/contact')
                                    }
                                />
                            </div>
                        </div>

                        {/* RIGHT */}
                        <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 lg:p-8 border border-[#D3A188]/20 shadow-2xl mt-16 md:mt-0">

                            {/* TABS */}
                            <div className="flex gap-6 mb-8 border-b border-gray-800">
                                {Object.keys(LOCATIONS).map(country => (
                                    <button
                                        key={country}
                                        onClick={() =>
                                            setSelectedCountry(country)
                                        }
                                        className={`pb-3 font-medium transition-all ${selectedCountry === country
                                            ? 'text-[#D3A188]'
                                            : 'text-gray-500 hover:text-gray-300'
                                            }`}
                                    >
                                        {country}
                                    </button>
                                ))}
                            </div>

                            {/* FORM */}
                            <div className="space-y-5">
                                <SelectField
                                    label="Property Type"
                                    value={filters.propertyType}
                                    onChange={updateFilter('propertyType')}
                                    options={PROPERTY_TYPES}
                                />

                                <SelectField
                                    label="Bedrooms"
                                    value={filters.bedrooms}
                                    onChange={updateFilter('bedrooms')}
                                    options={BEDROOM_OPTIONS}
                                />

                                <SelectField
                                    label="Price Range"
                                    value={filters.priceRange}
                                    onChange={updateFilter('priceRange')}
                                    options={priceRanges}
                                />

                                <div className="flex items-center gap-3 pt-2">
                                    <input
                                        type="checkbox"
                                        checked={filters.autoSearch}
                                        onChange={e =>
                                            setFilters(prev => ({
                                                ...prev,
                                                autoSearch:
                                                    e.target.checked,
                                            }))
                                        }
                                        className="w-5 h-5 accent-[#D3A188]"
                                    />
                                    <span className="text-sm text-gray-400">
                                        Enable Smart Search
                                    </span>
                                </div>

                                <Button
                                    text="Search Properties"
                                    className="w-full mt-4 py-4 font-bold uppercase tracking-widest"
                                    onClick={handleSearch}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

HeroSection.displayName = 'HeroSection';
export default HeroSection;
