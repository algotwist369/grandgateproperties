import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link, useOutletContext } from 'react-router-dom';
import {
    RiBuildingLine, RiSearchLine, RiFilterLine, RiMore2Line,
    RiMapPinLine, RiPriceTagLine, RiEditLine, RiDeleteBinLine,
    RiRefreshLine, RiAddLine
} from 'react-icons/ri';
import { getAllProperties, deleteProperty } from '../../apis/property_api';
import Pagination from '../../commmon_pages/Pagination';

// Helper to format image URLs from backend
const formatImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http') || url.startsWith('blob:')) return url;
    const baseUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000';
    return `${baseUrl}/${url.startsWith('/') ? url.slice(1) : url}`;
};

const PropertiesList = () => {
    const navigate = useNavigate();
    const { user } = useOutletContext();
    const isAdmin = user?.role === 'admin';
    const role = user?.role || 'admin';

    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const fetchedRef = React.useRef(false);

    const fetchProperties = async (page = 1) => {
        setLoading(true);
        setError('');
        try {
            const params = {};
            if (!isAdmin) {
                params.createdBy = user?._id;
            }
            const data = await getAllProperties(page, 9, params); // 9 for 3x3 grid
            setProperties(data.properties || []);
            setTotalPages(data.pages || 1);
            setTotalItems(data.total || 0);
            setCurrentPage(data.page || 1);
        } catch (err) {
            setError('Failed to fetch properties');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const lastFetchedKey = React.useRef('');

    useEffect(() => {
        if (!user) return;

        const fetchKey = `${user._id}-${currentPage}`;
        if (lastFetchedKey.current === fetchKey) return;

        lastFetchedKey.current = fetchKey;
        fetchProperties(currentPage);
    }, [currentPage, user]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this property?')) {
            try {
                await deleteProperty(id);
                setProperties(prev => prev.filter(p => p._id !== id));
                fetchProperties(currentPage);
            } catch (err) {
                alert('Failed to delete property');
            }
        }
    };

    const filteredProperties = properties.filter(prop =>
        prop.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prop.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prop.property_category?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-fade-in text-left">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                        {isAdmin ? 'Global' : 'My'} <span className="text-[#BD9B5F]">Properties</span>
                    </h1>
                    <p className="text-gray-400">
                        {isAdmin ? 'Overview of all property listings across the platform.' : 'Manage your personal property listings and exclusives.'}
                    </p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <div className="relative flex-1 md:flex-none">
                        <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search properties..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-[#1a1a1a] border border-[#333] rounded-2xl pl-12 pr-6 py-3 text-white focus:border-[#BD9B5F] outline-none transition-all w-full md:w-64"
                        />
                    </div>
                    <Link
                        to={`/${role}/add-property`}
                        className="flex items-center gap-2 px-6 py-3 bg-[#BD9B5F] text-black font-bold rounded-2xl hover:bg-[#a68650] transition-all shadow-lg shadow-[#BD9B5F]/10"
                    >
                        <RiAddLine />
                        <span>Add Property</span>
                    </Link>
                    <button
                        onClick={() => fetchProperties(currentPage)}
                        className="p-3 bg-[#1a1a1a] border border-[#333] rounded-2xl text-gray-400 hover:text-[#BD9B5F] transition-all"
                    >
                        <RiRefreshLine size={20} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-900/20 border border-red-900/50 rounded-2xl text-red-400 text-sm">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="py-20 flex flex-col items-center justify-center">
                    <RiRefreshLine size={48} className="text-[#BD9B5F] animate-spin mb-4" />
                    <p className="text-gray-500 font-medium tracking-wide uppercase text-xs">Fetching properties...</p>
                </div>
            ) : filteredProperties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProperties.map((prop) => (
                        <motion.div
                            key={prop._id}
                            whileHover={{ y: -5 }}
                            className="bg-[#1a1a1a] border border-[#333] rounded-3xl overflow-hidden shadow-2xl group hover:border-[#BD9B5F]/30 transition-all"
                        >
                            <div className="h-48 bg-[#222] relative overflow-hidden">
                                {prop.hero_image ? (
                                    <img
                                        src={formatImageUrl(prop.hero_image)}
                                        alt={prop.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1a1a1a] to-[#222]">
                                        <RiBuildingLine size={48} className="text-[#333]" />
                                    </div>
                                )}
                                <div className="absolute top-4 left-4 bg-[#BD9B5F] text-black text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-lg">
                                    {prop.property_category || 'Property'}
                                </div>
                                <div className="absolute top-4 right-4 flex gap-2">
                                    <Link
                                        to={`/${role}/update-property/${prop.slug}`}
                                        className="bg-black/40 backdrop-blur-md p-2 rounded-xl text-white hover:text-[#BD9B5F] transition-colors"
                                    >
                                        <RiEditLine size={18} />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(prop._id)}
                                        className="bg-black/40 backdrop-blur-md p-2 rounded-xl text-white hover:text-red-500 transition-colors"
                                    >
                                        <RiDeleteBinLine size={18} />
                                    </button>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center gap-2 text-[#BD9B5F] text-[10px] font-bold uppercase tracking-widest mb-2">
                                    <span>{prop.developer || 'Grand Gate'}</span>
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2 truncate group-hover:text-[#BD9B5F] transition-colors">
                                    {prop.title}
                                </h3>
                                <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                                    <RiMapPinLine size={16} className="text-[#BD9B5F]" />
                                    <span className="truncate">{prop.location}, {prop.emirate}</span>
                                </div>
                                <div className="pt-4 border-t border-[#333] flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-white font-bold">
                                        <RiPriceTagLine className="text-[#BD9B5F]" />
                                        <span>{prop.currency} {prop.starting_price?.toLocaleString()}</span>
                                    </div>
                                    <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                                        {new Date(prop.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="bg-[#1a1a1a] border border-[#333] rounded-3xl p-20 text-center">
                    <RiBuildingLine size={48} className="text-[#333] mx-auto mb-4" />
                    <p className="text-gray-500 italic">No properties found matching your search.</p>
                </div>
            )}

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={totalItems}
            />
        </div>
    );
};

export default PropertiesList;
