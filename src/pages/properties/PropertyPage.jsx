import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react'
import { propertyDirectory } from '../../data/properties'
import PropertyCard from '../../components/common/PropertyCard'
import { IoSearchOutline, IoFilterOutline } from 'react-icons/io5'
import { useLocation } from 'react-router-dom'

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
            window.history.replaceState({}, document.title)
        }
    }, [location.state]);

    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Infinite Scroll State
    const [visibleCount, setVisibleCount] = useState(9);
    const observerTarget = React.useRef(null);

    // Reset visible count when filters change
    useEffect(() => {
        window.scrollTo(0, 0);
        setVisibleCount(9);
    }, [filters]);

    // Derived Values
    const countries = ['All', 'Dubai', 'India'];
    const propertyTypes = ['All', ...new Set(propertyDirectory.map(p => p.propertyType))];
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
            location: `${property.community}, ${property.emirate}`,
            priceDisplay: formatCurrency(property.price, property.currency),
            area: `${numberFormatter.format(property.sqft)} sqft`,
            image: property.gallery?.[0],
            type: property.propertyType,
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
            const typeMatch = filters.type === 'All' || property.propertyType === filters.type;

            // 4. Bedrooms
            let bedroomMatch = true;
            if (filters.bedrooms !== 'All') {
                if (filters.bedrooms === '5+') {
                    bedroomMatch = property.bedrooms >= 5;
                } else {
                    bedroomMatch = property.bedrooms === parseInt(filters.bedrooms);
                }
            }

            // 5. Price Range
            const selectedRange = priceRanges.find(r => r.label === filters.priceRange);
            let priceMatch = true;

            if (selectedRange && selectedRange.label !== 'All') {
                // If filtering by price, ensure we are comparing apples to apples (same currency)
                // If Country is 'All', we skip price filtering or default to AED checks which might be inaccurate for other currencies
                // Ideally prompt user to select country first, but for now:

                // Only filter if property currency matches filter context or if it's broad range
                priceMatch = property.price >= selectedRange.min && property.price <= selectedRange.max;
            }

            return searchMatch && countryMatch && typeMatch && bedroomMatch && priceMatch;
        });
    }, [debouncedSearch, filters.country, filters.type, filters.bedrooms, filters.priceRange, priceRanges, numberFormatter]);

    const handleFilterChange = useCallback((key, value) => {
        // If changing country, reset price range as the units change
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
                rootMargin: '100px' // Start loading before reaching the bottom
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
        <div className='min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8 bg-[#0B0D10] text-gray-100'>

            {/* Header */}
            <div className='text-center mb-10'>
                <h1 className='text-3xl md:text-5xl font-bold text-gray-200 mb-4'>
                    Find Your <span className='text-[#D3A188]'>Dream Property</span>
                </h1>
                <p className='text-gray-400 max-w-2xl mx-auto'>
                    Browse our extensive collection of premium properties across Dubai and India.
                </p>
            </div>

            {/* Filter Bar (Desktop) */}
            <div className='hidden lg:flex flex-wrap items-center justify-center gap-4 mb-10 p-4 bg-[#111] rounded-2xl border border-[#D3A188]/20 shadow-xl backdrop-blur-md'>

                {/* Search */}
                <div className='relative w-64'>
                    <IoSearchOutline className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
                    <input
                        type="text"
                        placeholder="Search location or title..."
                        value={filters.search}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                        className='w-full bg-black/50 border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-[#D3A188] text-sm'
                    />
                </div>

                {/* Country */}
                <select
                    value={filters.country}
                    onChange={(e) => handleFilterChange('country', e.target.value)}
                    className='bg-black/50 border border-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#D3A188] text-sm cursor-pointer'
                >
                    {countries.map(c => <option key={c} value={c}>Country: {c}</option>)}
                </select>

                {/* Type */}
                <select
                    value={filters.type}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                    className='bg-black/50 border border-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#D3A188] text-sm cursor-pointer'
                >
                    {propertyTypes.map(t => <option key={t} value={t}>Type: {t}</option>)}
                </select>

                {/* Bedrooms */}
                <select
                    value={filters.bedrooms}
                    onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                    className='bg-black/50 border border-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#D3A188] text-sm cursor-pointer'
                >
                    <option value="All">Bedrooms: All</option>
                    {bedroomOptions.filter(b => b !== 'All').map(b => <option key={b} value={b}>{b} Bedrooms</option>)}
                </select>

                {/* Price */}
                <select
                    value={filters.priceRange}
                    onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                    className='bg-black/50 border border-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#D3A188] text-sm cursor-pointer'
                >
                    {priceRanges.map(r => <option key={r.label} value={r.label}>Price: {r.label}</option>)}
                </select>

                {/* Reset */}
                <button
                    onClick={handleResetFilters}
                    className='text-sm text-[#D3A188] hover:text-white transition-colors duration-200 underline'
                >
                    Reset
                </button>
            </div>

            {/* Mobile Filter Toggle */}
            <div className='lg:hidden mb-6'>
                <div className='relative w-full mb-4'>
                    <IoSearchOutline className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
                    <input
                        type="text"
                        placeholder="Search properties..."
                        value={filters.search}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                        className='w-full bg-black/50 border border-gray-700 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-[#D3A188]'
                    />
                </div>
                <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className='w-full flex items-center justify-center gap-2 bg-[#D3A188] text-[#0B0D10] font-bold py-3 rounded-lg'
                >
                    <IoFilterOutline /> {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
                </button>
            </div>

            {/* Mobile Filter Menu */}
            {isFilterOpen && (
                <div className='lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 bg-[#111] p-4 rounded-xl border border-gray-800'>
                    <select
                        value={filters.country}
                        onChange={(e) => handleFilterChange('country', e.target.value)}
                        className='bg-black/50 border border-gray-700 rounded-lg px-3 py-3 w-full text-sm'
                    >
                        {countries.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <select
                        value={filters.type}
                        onChange={(e) => handleFilterChange('type', e.target.value)}
                        className='bg-black/50 border border-gray-700 rounded-lg px-3 py-3 w-full text-sm'
                    >
                        {propertyTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <select
                        value={filters.bedrooms}
                        onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                        className='bg-black/50 border border-gray-700 rounded-lg px-3 py-3 w-full text-sm'
                    >
                        <option value="All">Any Beds</option>
                        {bedroomOptions.filter(b => b !== 'All').map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                    <select
                        value={filters.priceRange}
                        onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                        className='bg-black/50 border border-gray-700 rounded-lg px-3 py-3 w-full text-sm'
                    >
                        {priceRanges.map(r => <option key={r.label} value={r.label}>{r.label}</option>)}
                    </select>
                </div>
            )}

            {/* Results Grid */}
            <div className='max-w-7xl mx-auto'>
                <div className='flex justify-between items-center mb-6 text-gray-400 text-sm'>
                    <p>Showing <span className='text-white font-bold'>{filteredProperties.length}</span> properties</p>
                </div>

                {filteredProperties.length > 0 ? (
                    <>
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6'>
                            {visibleProperties.map(property => (
                                <PropertyCard key={property.id} property={{ ...property, price: property.priceDisplay }} />
                            ))}
                        </div>

                        {/* Loading Indicator / Sentinel */}
                        {visibleCount < filteredProperties.length && (
                            <div ref={observerTarget} className='h-20 flex items-center justify-center mt-8'>
                                <div className='flex gap-2'>
                                    <div className='w-2 h-2 bg-[#D3A188] rounded-full animate-bounce'></div>
                                    <div className='w-2 h-2 bg-[#D3A188] rounded-full animate-bounce delay-100'></div>
                                    <div className='w-2 h-2 bg-[#D3A188] rounded-full animate-bounce delay-200'></div>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className='text-center py-20 bg-[#111] rounded-2xl border border-dashed border-gray-800'>
                        <h3 className='text-xl text-gray-300 font-bold mb-2'>No Properties Found</h3>
                        <p className='text-gray-500'>Try adjusting your filters or search criteria.</p>
                        <button
                            onClick={handleResetFilters}
                            className='mt-4 text-[#D3A188] hover:underline transition-colors duration-200'
                        >
                            Clear all filters
                        </button>
                    </div>
                )}
            </div>

        </div>
    )
}

export default PropertyPage