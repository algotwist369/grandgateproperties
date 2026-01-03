import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { propertyDirectory } from '../../data/dubai_Properties';
import PropertyCard from '../../components/common/PropertyCard';
import { IoSearchOutline, IoFilterOutline } from 'react-icons/io5';
import { IoMdClose } from 'react-icons/io';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Debounce hook for search input
const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

const PropertyPage = () => {
    const location = useLocation();

    // Filter States
    const [filters, setFilters] = useState({
        country: 'All',
        type: 'All',
        bedrooms: 'All',
        priceRange: 'All',
        search: ''
    });

    // Debounce search input to reduce filtering operations
    const debouncedSearch = useDebounce(filters.search, 300);

    // Initialize from Location State (Hero Search)
    useEffect(() => {
        if (location.state) {
            const { country, type, bedrooms } = location.state;
            setFilters(prev => ({
                ...prev,
                country: country || 'All',
                type: type || 'All',
                bedrooms: bedrooms || 'All'
            }));

            // Clear state to prevent reapplying on refresh/navigation
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Infinite Scroll State
    const [visibleCount, setVisibleCount] = useState(9);
    const observerTarget = useRef(null);

    // Reset visible count when filters change
    useEffect(() => {
        window.scrollTo(0, 0);
        setVisibleCount(9);
    }, [filters]);

    // Derived Values
    const countries = ['All', 'Dubai', 'India'];
    const propertyTypes = useMemo(() => {
        const types = new Set();
        propertyDirectory.forEach(p => {
            if (Array.isArray(p.propertyTypes)) {
                p.propertyTypes.forEach(t => types.add(t));
            } else if (p.propertyType) {
                types.add(p.propertyType);
            } else if (p.propertyCategory) {
                types.add(p.propertyCategory);
            }
        });
        return ['All', ...Array.from(types)];
    }, []);

    const bedroomOptions = ['All', '1', '2', '3', '4', '5+'];

    // Dynamic Price Ranges based on Country
    const priceRanges = useMemo(() => {
        if (filters.country === 'India') {
            return [
                { label: 'All', min: 0, max: Infinity },
                { label: 'Under ₹1 Cr', min: 0, max: 10000000 },
                { label: '₹1 Cr - ₹5 Cr', min: 10000000, max: 50000000 },
                { label: '₹5 Cr - ₹20 Cr', min: 50000000, max: 200000000 },
                { label: 'Above ₹20 Cr', min: 200000000, max: Infinity },
            ];
        } else {
            // Default (AED - Dubai / All)
            return [
                { label: 'All', min: 0, max: Infinity },
                { label: 'Under 1M AED', min: 0, max: 1000000 },
                { label: '1M - 5M AED', min: 1000000, max: 5000000 },
                { label: '5M - 20M AED', min: 5000000, max: 20000000 },
                { label: 'Above 20M AED', min: 20000000, max: Infinity },
            ];
        }
    }, [filters.country]);


    // Helper Formatter
    const formatCurrency = (amount, currency) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency || 'AED',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const numberFormatter = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });

    // Filtering Logic - use debounced search
    const filteredProperties = useMemo(() => {
        return propertyDirectory.map(property => ({
            ...property,
            // Normalize data for display card
            location: property.location || `${property.community}, ${property.emirate}`,
            priceDisplay: property.startingPrice
                ? `From ${formatCurrency(property.startingPrice, property.currency)}`
                : formatCurrency(property.price, property.currency),
            area: property.sqft ? `${numberFormatter.format(property.sqft)} sqft` : '',
            image: property.heroImage || property.gallery?.[0] || property.image,
            type: property.propertyType || property.propertyCategory,
            source: property,
        })).filter(property => {
            // 1. Search Text (Title or Location) - use debounced value
            const searchLower = debouncedSearch.toLowerCase();
            const searchMatch = !debouncedSearch ||
                property.title.toLowerCase().includes(searchLower) ||
                property.location.toLowerCase().includes(searchLower);

            // 2. Country
            const countryMatch = filters.country === 'All' || property.country === filters.country;

            // 3. Property Type
            let typeMatch = filters.type === 'All';
            if (!typeMatch) {
                if (Array.isArray(property.propertyTypes)) {
                    typeMatch = property.propertyTypes.includes(filters.type);
                } else {
                    typeMatch = property.propertyType === filters.type || property.propertyCategory === filters.type;
                }
            }

            // 4. Bedrooms
            let bedroomMatch = filters.bedrooms === 'All';
            if (!bedroomMatch) {
                const targetBeds = filters.bedrooms === '5+' ? 5 : parseInt(filters.bedrooms);

                if (property.units && property.units.length > 0) {
                    const unitBeds = property.units.map(u => u.bedrooms).filter(b => b != null);
                    if (filters.bedrooms === '5+') {
                        bedroomMatch = unitBeds.some(b => b >= 5);
                    } else {
                        bedroomMatch = unitBeds.includes(targetBeds);
                    }
                } else {
                    if (filters.bedrooms === '5+') {
                        bedroomMatch = property.bedrooms >= 5;
                    } else {
                        bedroomMatch = property.bedrooms === targetBeds;
                    }
                }
            }

            // 5. Price Range
            const selectedRange = priceRanges.find(r => r.label === filters.priceRange);
            let priceMatch = true;

            if (selectedRange && selectedRange.label !== 'All') {
                const priceValue = property.startingPrice || property.price;
                priceMatch = priceValue >= selectedRange.min && priceValue <= selectedRange.max;
            }

            return searchMatch && countryMatch && typeMatch && bedroomMatch && priceMatch;
        });
    }, [debouncedSearch, filters.country, filters.type, filters.bedrooms, filters.priceRange, priceRanges, numberFormatter]);

    const handleFilterChange = useCallback((key, value) => {
        if (key === 'country') {
            setFilters(prev => ({ ...prev, [key]: value, priceRange: 'All' }));
        } else {
            setFilters(prev => ({ ...prev, [key]: value }));
        }
    }, []);

    const handleResetFilters = useCallback(() => {
        setFilters({ country: 'All', type: 'All', bedrooms: 'All', priceRange: 'All', search: '' });
    }, []);

    // Intersection Observer for Infinite Scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && visibleCount < filteredProperties.length) {
                    setVisibleCount(prev => prev + 6);
                }
            },
            {
                threshold: 0.1,
                rootMargin: '100px'
            }
        );

        const currentTarget = observerTarget.current;
        if (currentTarget) {
            observer.observe(currentTarget);
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
        };
    }, [visibleCount, filteredProperties.length]);


    const visibleProperties = filteredProperties.slice(0, visibleCount);

    return (
        <div className="min-h-screen pt-32 pb-24 bg-black text-gray-100 selection:bg-[#BD9B5F] selection:text-black">
            {/* Header */}
            <motion.div
                className="max-w-7xl mx-auto px-6 lg:px-8 text-center mb-24"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <div className="flex items-center justify-center gap-4 mb-6">
                    <div className="w-12 h-px bg-[#BD9B5F]"></div>
                    <span className="text-xs uppercase tracking-[0.5em] text-[#BD9B5F] font-medium">Curated Collection</span>
                    <div className="w-12 h-px bg-[#BD9B5F]"></div>
                </div>
                <h1 className="text-5xl md:text-8xl font-light text-white uppercase tracking-tighter mb-8 leading-none">
                    Discover your <span className="text-[#BD9B5F] font-medium italic">Legacy</span>
                </h1>
                <p className="text-gray-400 max-w-2xl mx-auto text-lg font-light leading-relaxed">
                    Explore our exclusive portfolio of ultra-luxury residences, architecturally synchronized with the world's most prestigious environments.
                </p>
            </motion.div>

            {/* Filter Bar - Desktop */}
            <motion.div
                className="max-w-7xl mx-auto px-6 lg:px-8 mb-24 hidden lg:block"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <div className="bg-white/5 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 p-4 shadow-2xl flex items-center gap-4">
                    <div className="flex-1 relative group">
                        <IoSearchOutline className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#BD9B5F] transition-colors" />
                        <input
                            type="text"
                            placeholder="Explore by location or name..."
                            value={filters.search}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                            className="w-full bg-black/20 border border-transparent focus:border-white/10 rounded-2xl py-4 pl-16 pr-6 text-sm outline-none transition-all"
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <select
                            value={filters.country}
                            onChange={(e) => handleFilterChange('country', e.target.value)}
                            className="bg-black/20 border border-white/5 rounded-2xl px-6 py-4 text-[10px] uppercase tracking-[0.2em] font-bold outline-none cursor-pointer hover:bg-white/5 transition-all text-white"
                        >
                            {countries.map(c => <option key={c} value={c} className="bg-neutral-900">{c}</option>)}
                        </select>

                        <select
                            value={filters.type}
                            onChange={(e) => handleFilterChange('type', e.target.value)}
                            className="bg-black/20 border border-white/5 rounded-2xl px-6 py-4 text-[10px] uppercase tracking-[0.2em] font-bold outline-none cursor-pointer hover:bg-white/5 transition-all text-white"
                        >
                            {propertyTypes.map(t => <option key={t} value={t} className="bg-neutral-900">{t}</option>)}
                        </select>

                        <select
                            value={filters.bedrooms}
                            onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                            className="bg-black/20 border border-white/5 rounded-2xl px-6 py-4 text-[10px] uppercase tracking-[0.2em] font-bold outline-none cursor-pointer hover:bg-white/5 transition-all text-white"
                        >
                            <option value="All" className="bg-neutral-900">Any Beds</option>
                            {bedroomOptions.filter(b => b !== 'All').map(b => <option key={b} value={b} className="bg-neutral-900">{b} Beds</option>)}
                        </select>

                        <select
                            value={filters.priceRange}
                            onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                            className="bg-black/20 border border-white/5 rounded-2xl px-6 py-4 text-[10px] uppercase tracking-[0.2em] font-bold outline-none cursor-pointer hover:bg-white/5 transition-all text-white"
                        >
                            {priceRanges.map(r => <option key={r.label} value={r.label} className="bg-neutral-900">{r.label}</option>)}
                        </select>

                        <button
                            onClick={handleResetFilters}
                            className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] font-bold text-[#BD9B5F] hover:text-white transition-colors"
                        >
                            Reset
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Mobile Filter Toggle */}
            <div className="lg:hidden px-6 mb-8">
                <button
                    onClick={() => setIsFilterOpen(true)}
                    className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl py-5 px-6 flex items-center justify-between text-[#BD9B5F]"
                >
                    <div className="flex items-center gap-3">
                        <IoFilterOutline size={20} />
                        <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Refine Results</span>
                    </div>
                    <span className="text-[10px] bg-[#BD9B5F] text-black px-3 py-1 rounded-full font-bold">Filters</span>
                </button>
            </div>

            {/* Mobile Filter Menu */}
            <AnimatePresence>
                {isFilterOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] lg:hidden"
                    >
                        <div className="absolute inset-0 bg-black/90 backdrop-blur-2xl" onClick={() => setIsFilterOpen(false)} />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-neutral-900 border-l border-white/10 shadow-2xl p-8 overflow-y-auto"
                        >
                            <div className="flex items-center justify-between mb-12">
                                <h2 className="text-2xl font-light uppercase tracking-widest text-white">Filters</h2>
                                <button onClick={() => setIsFilterOpen(false)} className="text-gray-400 hover:text-white">
                                    <IoMdClose size={32} />
                                </button>
                            </div>

                            <div className="space-y-10">
                                <div className="space-y-4">
                                    <label className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-bold px-1">Location</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {countries.map(c => (
                                            <button
                                                key={c}
                                                onClick={() => handleFilterChange('country', c)}
                                                className={`py-4 rounded-xl text-[10px] uppercase tracking-widest font-bold border transition-all ${filters.country === c ? 'bg-[#BD9B5F] border-[#BD9B5F] text-black' : 'bg-white/5 border-white/5 text-white'}`}
                                            >
                                                {c}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-bold px-1">Property Type</label>
                                    <select
                                        value={filters.type}
                                        onChange={(e) => handleFilterChange('type', e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white outline-none appearance-none"
                                    >
                                        {propertyTypes.map(t => <option key={t} value={t} className="bg-neutral-900">{t}</option>)}
                                    </select>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-bold px-1">Bedrooms</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {bedroomOptions.map(b => (
                                            <button
                                                key={b}
                                                onClick={() => handleFilterChange('bedrooms', b)}
                                                className={`py-4 rounded-xl text-[10px] uppercase tracking-widest font-bold border transition-all ${filters.bedrooms === b ? 'bg-[#BD9B5F] border-[#BD9B5F] text-black' : 'bg-white/5 border-white/5 text-white'}`}
                                            >
                                                {b}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-bold px-1">Price Range</label>
                                    <div className="space-y-2">
                                        {priceRanges.map(r => (
                                            <button
                                                key={r.label}
                                                onClick={() => handleFilterChange('priceRange', r.label)}
                                                className={`w-full py-4 px-6 rounded-xl text-[10px] uppercase tracking-widest font-bold border transition-all text-left flex justify-between items-center ${filters.priceRange === r.label ? 'bg-[#BD9B5F] border-[#BD9B5F] text-black' : 'bg-white/5 border-white/5 text-white'}`}
                                            >
                                                {r.label}
                                                {filters.priceRange === r.label && <div className="w-2 h-2 bg-black rounded-full" />}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-16 pt-8 border-t border-white/10 space-y-4">
                                <button
                                    onClick={() => setIsFilterOpen(false)}
                                    className="w-full py-5 bg-white text-black text-[10px] uppercase tracking-[0.3em] font-bold rounded-2xl"
                                >
                                    Show {filteredProperties.length} Results
                                </button>
                                <button
                                    onClick={handleResetFilters}
                                    className="w-full py-5 border border-white/10 text-white text-[10px] uppercase tracking-[0.3em] font-bold rounded-2xl"
                                >
                                    Reset All
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Results Grid */}
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex justify-between items-center mb-12">
                    <span className="text-[10px] uppercase tracking-[0.4em] text-gray-500 font-medium font-bold">Showing {filteredProperties.length} elite residences</span>
                </div>

                {filteredProperties.length > 0 ? (
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
                        layout
                    >
                        <AnimatePresence mode="popLayout">
                            {visibleProperties.map((property) => (
                                <motion.div
                                    key={property.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    <PropertyCard property={{ ...property, price: property.priceDisplay }} />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                ) : (
                    <motion.div
                        className="py-32 text-center rounded-[3rem] border border-white/5 bg-white/5"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <h3 className="text-3xl font-light text-white uppercase tracking-widest mb-4">No Matches Found</h3>
                        <p className="text-gray-500 font-light mb-12">Expand your horizons to discover more possibilities.</p>
                        <button
                            onClick={handleResetFilters}
                            className="px-12 py-5 bg-white text-black text-xs uppercase tracking-[0.3em] font-bold rounded-2xl hover:bg-[#BD9B5F] hover:text-white transition-all shadow-xl shadow-white/5"
                        >
                            Clear All Filters
                        </button>
                    </motion.div>
                )}

                {/* Infinite Scroll Loader */}
                {visibleCount < filteredProperties.length && (
                    <div ref={observerTarget} className="mt-24 text-center">
                        <div className="inline-flex items-center gap-4 px-10 py-6 bg-white/5 rounded-full border border-white/10">
                            <motion.div
                                className="w-2 h-2 bg-[#BD9B5F] rounded-full"
                                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                            ></motion.div>
                            <span className="text-[10px] uppercase tracking-[0.4em] text-gray-400 font-bold">Discovering more treasures</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PropertyPage;