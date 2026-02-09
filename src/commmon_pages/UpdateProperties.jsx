import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    RiBuildingLine, RiMapPinLine, RiPriceTagLine, RiImageAddLine,
    RiInformationLine, RiHistoryLine, RiGalleryLine, RiDeleteBinLine,
    RiStarLine, RiRocketLine, RiCheckLine, RiRefreshLine, RiAddLine,
    RiFilePdfLine, RiUserAddLine, RiHomeLine
} from 'react-icons/ri';
import Input from './Input';
import Button from './Button';
import { getPropertyBySlug, updateProperty } from '../apis/property_api';
import { getAllAgents } from '../apis/agent_api';

const UpdateProperties = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [propertyId, setPropertyId] = useState('');
    const [heroImage, setHeroImage] = useState(null);
    const [heroUrl, setHeroUrl] = useState('');
    const [heroInputMode, setHeroInputMode] = useState('url'); // Always start with 'url' for existing
    const [galleryItems, setGalleryItems] = useState([]); // [{id, type, file, url}]
    const [brochureItems, setBrochureItems] = useState([]); // [{id, type, file, url, title, language}]
    const [availableAgents, setAvailableAgents] = useState([]);
    const [customEmirate, setCustomEmirate] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        headline: '',
        description: '',
        developer: '',
        community: '',
        location: '',
        emirate: 'Dubai',
        country: 'UAE',
        property_category: 'Apartment',
        property_types: [],
        starting_price: '',
        currency: 'AED',
        handover: '',
        featured: false,
        is_new: false,
        status: 'active',
        amenities: [],
        units: [],
        agents: [],
        nearby_locations: [],
        payment_plan: []
    });

    const categories = ['Apartment', 'Villa', 'Townhouse', 'Penthouse', 'Office', 'Retail', 'Plot'];
    const countries = ['UAE', 'India'];
    const uaeEmirates = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Umm Al Quwain', 'Ras Al Khaimah', 'Fujairah', 'Custom'];
    const indianStates = ['Maharashtra', 'Karnataka', 'Delhi', 'Tamil Nadu', 'Gujarat', 'Telangana', 'Rajasthan', 'Uttar Pradesh', 'West Bengal', 'Kerala', 'Custom'];
    const currencies = ['AED', 'INR'];
    const propertyTypeOptions = ['Studio', '1 Bedroom', '2 Bedroom', '3 Bedroom', '4 Bedroom', '5+ Bedroom', 'Penthouse', 'Duplex', 'Townhouse', 'Villa', 'Office', 'Retail'];
    const amenityOptions = [
        'Swimming Pool', 'Gym / Fitness Center', 'Security / CCTV', 'Parking',
        'Central AC', 'Balcony / Terrace', 'Garden / Landscaping', 'Play Area',
        'Maid\'s Room', 'Built-in Wardrobes', 'Smart Home Features', 'Concierge Service',
        'Beach Access', 'Golf Course', 'Tennis Court', 'Spa & Wellness'
    ];
    const languageOptions = ['en', 'ar', 'fr', 'ru', 'zh', 'cn', 'de', 'es'];

    // Helper to format image URLs from backend
    const formatImageUrl = (url) => {
        if (!url) return '';
        if (url.startsWith('http') || url.startsWith('blob:')) return url;
        const baseUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000';
        return `${baseUrl}/${url.startsWith('/') ? url.slice(1) : url}`;
    };

    const isFetched = useRef(false);

    useEffect(() => {
        if (isFetched.current) return;
        isFetched.current = true;

        const fetchProperty = async () => {
            setFetching(true);
            try {
                const data = await getPropertyBySlug(slug);
                setPropertyId(data._id);
                const savedEmirate = data.emirate || 'Dubai';
                const currentCountry = data.country || 'UAE';
                const isCustomEmirate = currentCountry === 'UAE'
                    ? !uaeEmirates.includes(savedEmirate)
                    : !indianStates.includes(savedEmirate);

                setFormData({
                    title: data.title || '',
                    headline: data.headline || '',
                    description: data.description || '',
                    developer: data.developer || '',
                    community: data.community || '',
                    location: data.location || '',
                    emirate: isCustomEmirate ? 'Custom' : savedEmirate,
                    country: currentCountry,
                    property_category: data.property_category || 'Apartment',
                    property_types: data.property_types || [],
                    starting_price: data.starting_price || '',
                    currency: data.currency || 'AED',
                    handover: data.handover || '',
                    featured: !!data.featured,
                    is_new: !!data.is_new,
                    status: data.status || 'active',
                    amenities: data.amenities || [],
                    units: data.units || [],
                    agents: (data.agents || []).map(a => a._id || a),
                    nearby_locations: data.nearby_locations || [],
                    payment_plan: data.payment_plan || []
                });
                if (isCustomEmirate) setCustomEmirate(savedEmirate);

                // Hero Image
                setHeroUrl(data.hero_image || '');
                setHeroInputMode('url');

                // Gallery
                const fetchedGallery = (data.gallery || []).map((url, i) => ({
                    id: `gallery-url-${Date.now()}-${i}`,
                    type: 'url',
                    url
                }));
                setGalleryItems(fetchedGallery);

                // Brochures
                const fetchedBrochures = (data.brochure_pdfs || []).map((pdf, i) => ({
                    id: `brochure-url-${Date.now()}-${i}`,
                    type: 'url',
                    url: pdf.file_url,
                    title: pdf.title,
                    language: pdf.language
                }));
                setBrochureItems(fetchedBrochures);
            } catch (err) {
                setError('Failed to fetch property details. It may have been removed.');
                console.error(err);
            } finally {
                setFetching(false);
            }
        };

        const fetchAgents = async () => {
            try {
                const response = await getAllAgents(1, 100);
                setAvailableAgents(response.agents || []);
            } catch (err) {
                console.error('Failed to fetch agents:', err);
            }
        };

        fetchProperty();
        fetchAgents();
    }, [slug]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        // Auto-switch currency and reset emirate when country changes
        if (name === 'country') {
            setFormData(prev => ({
                ...prev,
                country: value,
                currency: value === 'UAE' ? 'AED' : 'INR',
                emirate: value === 'UAE' ? 'Dubai' : 'Maharashtra'
            }));
            setCustomEmirate('');
        } else if (name === 'emirate' && value !== 'Custom') {
            // Clear custom input when switching away from Custom
            setCustomEmirate('');
            setFormData(prev => ({
                ...prev,
                emirate: value
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    const handleArrayChange = (name, value) => {
        setFormData(prev => {
            const current = [...prev[name]];
            const index = current.indexOf(value);
            if (index > -1) current.splice(index, 1);
            else current.push(value);
            return { ...prev, [name]: current };
        });
    };

    const handleHeroImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setHeroImage(e.target.files[0]);
            setHeroUrl('');
        }
    };

    const addGalleryFiles = (e) => {
        if (e.target.files) {
            const newItems = Array.from(e.target.files).map(file => ({
                id: `gallery-file-${Date.now()}-${Math.random()}`,
                type: 'file',
                file,
                url: URL.createObjectURL(file)
            }));
            setGalleryItems(prev => [...prev, ...newItems]);
        }
    };

    const addGalleryUrl = () => {
        setGalleryItems(prev => [...prev, {
            id: `gallery-url-${Date.now()}`,
            type: 'url',
            url: ''
        }]);
    };

    const updateGalleryUrl = (id, url) => {
        setGalleryItems(prev => prev.map(item =>
            item.id === id ? { ...item, url } : item
        ));
    };

    const removeGalleryItem = (id) => {
        setGalleryItems(prev => prev.filter(item => item.id !== id));
    };

    const addBrochureFile = (e) => {
        if (e.target.files) {
            const newItems = Array.from(e.target.files).map(file => ({
                id: `brochure-file-${Date.now()}-${Math.random()}`,
                type: 'file',
                file,
                title: file.name.replace('.pdf', ''),
                language: 'en'
            }));
            setBrochureItems(prev => [...prev, ...newItems]);
        }
    };

    const addBrochureUrl = () => {
        setBrochureItems(prev => [...prev, {
            id: `brochure-url-${Date.now()}`,
            type: 'url',
            url: '',
            title: '',
            language: 'en'
        }]);
    };

    const updateBrochureItem = (id, field, value) => {
        setBrochureItems(prev => prev.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        ));
    };

    const removeBrochureItem = (id) => {
        setBrochureItems(prev => prev.filter(item => item.id !== id));
    };

    const addUnit = () => {
        setFormData(prev => ({
            ...prev,
            units: [...prev.units, {
                unit_id: `unit-${Date.now()}`,
                title: '',
                bedrooms: '',
                bathrooms: '',
                sqm: '',
                sqft: '',
                price: '',
                description: ''
            }]
        }));
    };

    const updateUnit = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            units: prev.units.map((unit, i) =>
                i === index ? { ...unit, [field]: value } : unit
            )
        }));
    };

    const removeUnit = (index) => {
        setFormData(prev => ({
            ...prev,
            units: prev.units.filter((_, i) => i !== index)
        }));
    };

    const addNearbyLocation = () => {
        setFormData(prev => ({
            ...prev,
            nearby_locations: [...prev.nearby_locations, { name: '', distance: '' }]
        }));
    };

    const updateNearbyLocation = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            nearby_locations: prev.nearby_locations.map((loc, i) =>
                i === index ? { ...loc, [field]: value } : loc
            )
        }));
    };

    const removeNearbyLocation = (index) => {
        setFormData(prev => ({
            ...prev,
            nearby_locations: prev.nearby_locations.filter((_, i) => i !== index)
        }));
    };

    const addPaymentPlanStage = () => {
        setFormData(prev => ({
            ...prev,
            payment_plan: [...prev.payment_plan, { percentage: '', title: '', subtitle: '' }]
        }));
    };

    const updatePaymentPlanStage = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            payment_plan: prev.payment_plan.map((stage, i) =>
                i === index ? { ...stage, [field]: value } : stage
            )
        }));
    };

    const removePaymentPlanStage = (index) => {
        setFormData(prev => ({
            ...prev,
            payment_plan: prev.payment_plan.filter((_, i) => i !== index)
        }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            const data = new FormData();

            // Append basic fields
            Object.keys(formData).forEach(key => {
                if (key === 'emirate' && formData.emirate === 'Custom') {
                    // Use custom emirate if Custom is selected
                    data.append(key, customEmirate);
                } else if (Array.isArray(formData[key])) {
                    data.append(key, JSON.stringify(formData[key]));
                } else {
                    data.append(key, formData[key]);
                }
            });

            // Append Hero Image
            if (heroInputMode === 'upload' && heroImage) {
                data.append('hero_image', heroImage);
            } else if (heroInputMode === 'url' && heroUrl) {
                data.append('hero_image', heroUrl);
            }

            // Append Gallery
            const galleryUrls = galleryItems.filter(item => item.type === 'url').map(item => item.url);
            data.append('gallery', JSON.stringify(galleryUrls));

            galleryItems.filter(item => item.type === 'file').forEach(item => {
                data.append('gallery', item.file);
            });

            // Append Brochures with Metadata
            const brochureMetadata = brochureItems.map(item => ({
                title: item.title,
                language: item.language,
                file_url: item.type === 'url' ? item.url : undefined,
                isFile: item.type === 'file'
            }));
            data.append('brochure_pdfs', JSON.stringify(brochureMetadata));

            brochureItems.filter(item => item.type === 'file').forEach(item => {
                data.append('brochure_pdfs', item.file);
            });

            await updateProperty(propertyId, data);
            setSuccess(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setTimeout(() => navigate(-1), 2000);
        } catch (err) {
            setError(typeof err === 'string' ? err : 'Failed to update property. Please verify your inputs.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return (
        <div className="h-96 flex flex-col items-center justify-center space-y-4">
            <RiRefreshLine size={48} className="text-[#BD9B5F] animate-spin" />
            <p className="text-gray-500 font-medium tracking-widest uppercase text-xs">Loading Property Intel...</p>
        </div>
    );

    return (
        <div className="p-6 md:p-8 max-w-5xl mx-auto animate-fade-in text-left">
            <div className="mb-10 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Update <span className="text-[#BD9B5F]">Property</span></h1>
                    <p className="text-gray-400">Refine the details for <span className="text-white italic">{formData.title}</span></p>
                </div>
                <button onClick={() => navigate(-1)} className="p-3 bg-white/5 border border-[#333] rounded-2xl text-gray-400 hover:text-white transition-all">
                    <RiHistoryLine size={20} />
                </button>
            </div>

            <AnimatePresence>
                {success && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mb-8 p-4 bg-green-500/10 border border-green-500/20 rounded-2xl text-green-400 text-sm flex items-center gap-3"
                    >
                        <RiCheckLine size={24} />
                        <div>
                            <p className="font-bold">Changes Saved!</p>
                            <p className="text-xs opacity-80">The listing has been updated. Redirecting back...</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {error && (
                <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm flex items-center gap-3">
                    <RiInformationLine size={24} />
                    <span>{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <section className="md:col-span-2 space-y-8">
                        {/* Basic Info */}
                        <div className="bg-[#1a1a1a] p-8 rounded-3xl border border-[#333] space-y-6">
                            <h2 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                <RiInformationLine className="text-[#BD9B5F]" /> Basic Information
                            </h2>

                            <Input label="Property Title" name="title" value={formData.title} onChange={handleChange} required />
                            <Input label="Headline" name="headline" value={formData.headline} onChange={handleChange} placeholder="Catchy subtitle..." />

                            <div className="flex flex-col space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="5"
                                    className="w-full bg-[#222] border border-[#333] rounded-2xl px-5 py-4 text-white focus:border-[#BD9B5F] focus:outline-none transition-all resize-none"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input label="Developer" name="developer" value={formData.developer} onChange={handleChange} />
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Category</label>
                                    <select
                                        name="property_category"
                                        value={formData.property_category}
                                        onChange={handleChange}
                                        className="w-full bg-[#222] border border-[#333] rounded-2xl px-5 py-4 text-white focus:border-[#BD9B5F] outline-none"
                                    >
                                        {categories.map(cat => <option key={cat}>{cat}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* Property Types Multi-Select */}
                            <div className="space-y-4">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Property Types / Configurations</label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {propertyTypeOptions.map(type => (
                                        <label
                                            key={type}
                                            className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${formData.property_types.includes(type)
                                                ? 'bg-[#BD9B5F]/10 border-[#BD9B5F] text-white shadow-lg shadow-[#BD9B5F]/5'
                                                : 'bg-black/20 border-[#333] text-gray-500 hover:border-[#BD9B5F]/30'
                                                }`}
                                        >
                                            <input
                                                type="checkbox"
                                                className="hidden"
                                                checked={formData.property_types.includes(type)}
                                                onChange={() => handleArrayChange('property_types', type)}
                                            />
                                            <span className="text-[10px] font-bold uppercase tracking-wider">{type}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Amenities Section */}
                        <div className="bg-[#1a1a1a] p-8 rounded-3xl border border-[#333] space-y-6">
                            <h2 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                <RiCheckLine className="text-[#BD9B5F]" /> Amenities & Features
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {amenityOptions ? amenityOptions.map(amenity => (
                                    <label
                                        key={amenity}
                                        className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${formData.amenities.includes(amenity)
                                            ? 'bg-[#BD9B5F]/10 border-[#BD9B5F] text-white shadow-lg shadow-[#BD9B5F]/5'
                                            : 'bg-black/20 border-[#333] text-gray-500 hover:border-[#BD9B5F]/30'
                                            }`}
                                    >
                                        <input
                                            type="checkbox"
                                            className="hidden"
                                            checked={formData.amenities.includes(amenity)}
                                            onChange={() => handleArrayChange('amenities', amenity)}
                                        />
                                        <RiCheckLine className={formData.amenities.includes(amenity) ? 'text-[#BD9B5F]' : 'text-gray-600'} />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">{amenity}</span>
                                    </label>
                                )) : (
                                    <p className="text-gray-500 text-xs">Loading amenities...</p>
                                )}
                            </div>
                        </div>

                        {/* Location */}
                        <div className="bg-[#1a1a1a] p-8 rounded-3xl border border-[#333] space-y-6">
                            <h2 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                <RiMapPinLine className="text-[#BD9B5F]" /> Location & Address
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Country</label>
                                    <select
                                        name="country"
                                        value={formData.country}
                                        onChange={handleChange}
                                        className="w-full bg-[#222] border border-[#333] rounded-2xl px-5 py-4 text-white focus:border-[#BD9B5F] outline-none"
                                        required
                                    >
                                        {countries.map(country => <option key={country}>{country}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">
                                        {formData.country === 'UAE' ? 'Emirate' : 'State'}
                                    </label>
                                    <select
                                        name="emirate"
                                        value={formData.emirate}
                                        onChange={handleChange}
                                        className="w-full bg-[#222] border border-[#333] rounded-2xl px-5 py-4 text-white focus:border-[#BD9B5F] outline-none"
                                    >
                                        {(formData.country === 'UAE' ? uaeEmirates : indianStates).map(location =>
                                            <option key={location}>{location}</option>
                                        )}
                                    </select>
                                </div>
                            </div>

                            {/* Custom Emirate/State Input */}
                            {formData.emirate === 'Custom' && (
                                <Input
                                    label={`Custom ${formData.country === 'UAE' ? 'Emirate' : 'State'}`}
                                    value={customEmirate}
                                    onChange={(e) => setCustomEmirate(e.target.value)}
                                    placeholder="Enter custom location"
                                    required
                                />
                            )}

                            <Input label="Community" name="community" value={formData.community} onChange={handleChange} />
                            <Input label="Detailed Address" name="location" value={formData.location} onChange={handleChange} />
                        </div>

                        {/* Nearby Locations */}
                        <div className="bg-[#1a1a1a] p-8 rounded-3xl border border-[#333] space-y-6">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <RiMapPinLine size={22} className="text-[#BD9B5F]" />
                                    <h2 className="text-lg font-bold text-white uppercase tracking-wider">Nearby Locations</h2>
                                </div>
                                <button
                                    type="button"
                                    onClick={addNearbyLocation}
                                    className="flex items-center gap-2 px-4 py-2 bg-[#BD9B5F]/10 border border-[#BD9B5F]/30 rounded-xl text-[#BD9B5F] text-xs font-bold uppercase tracking-wider hover:bg-[#BD9B5F]/20 transition-all"
                                >
                                    <RiAddLine size={16} /> Add Location
                                </button>
                            </div>

                            {formData.nearby_locations.length === 0 ? (
                                <p className="text-gray-500 text-sm text-center py-8">Specify nearby landmarks or points of interest (e.g. Burj Khalifa - 10 mins).</p>
                            ) : (
                                <div className="space-y-4">
                                    {formData.nearby_locations.map((loc, index) => (
                                        <div key={index} className="flex gap-4 items-end">
                                            <div className="flex-1">
                                                <Input
                                                    label="Landmark / Location Name"
                                                    value={loc.name}
                                                    onChange={(e) => updateNearbyLocation(index, 'name', e.target.value)}
                                                    placeholder="e.g. Dubai Mall"
                                                />
                                            </div>
                                            <div className="w-48">
                                                <Input
                                                    label="Distance / Time"
                                                    value={loc.distance}
                                                    onChange={(e) => updateNearbyLocation(index, 'distance', e.target.value)}
                                                    placeholder="e.g. 5 mins"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeNearbyLocation(index)}
                                                className="mb-3 p-3 text-red-400 hover:text-red-300 transition-all"
                                            >
                                                <RiDeleteBinLine size={20} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Pricing */}
                        <div className="bg-[#1a1a1a] p-8 rounded-3xl border border-[#333] space-y-6">
                            <h2 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                <RiPriceTagLine className="text-[#BD9B5F]" /> Pricing & Handover
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Currency</label>
                                    <select
                                        name="currency"
                                        value={formData.currency}
                                        onChange={handleChange}
                                        className="w-full bg-[#222] border border-[#333] rounded-2xl px-5 py-4 text-white focus:border-[#BD9B5F] outline-none"
                                    >
                                        {currencies.map(curr => <option key={curr}>{curr}</option>)}
                                    </select>
                                </div>
                                <Input label={`Price (${formData.currency})`} type="number" name="starting_price" value={formData.starting_price} onChange={handleChange} required />
                            </div>
                            <Input label="Handover" name="handover" value={formData.handover} onChange={handleChange} />
                        </div>

                        {/* Payment Plan */}
                        <div className="bg-[#1a1a1a] p-8 rounded-3xl border border-[#333] space-y-6">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <RiPriceTagLine size={22} className="text-[#BD9B5F]" />
                                    <h2 className="text-lg font-bold text-white uppercase tracking-wider">Payment Plan</h2>
                                </div>
                                <button
                                    type="button"
                                    onClick={addPaymentPlanStage}
                                    className="flex items-center gap-2 px-4 py-2 bg-[#BD9B5F]/10 border border-[#BD9B5F]/30 rounded-xl text-[#BD9B5F] text-xs font-bold uppercase tracking-wider hover:bg-[#BD9B5F]/20 transition-all"
                                >
                                    <RiAddLine size={16} /> Add Stage
                                </button>
                            </div>

                            {formData.payment_plan.length === 0 ? (
                                <p className="text-gray-500 text-sm text-center py-8">No payment plan stages added. e.g. 20% Down Payment.</p>
                            ) : (
                                <div className="space-y-4">
                                    {formData.payment_plan.map((stage, index) => (
                                        <div key={index} className="flex gap-4 items-end bg-[#222] p-6 rounded-2xl border border-[#333]">
                                            <div className="w-24">
                                                <Input
                                                    label="%"
                                                    type="number"
                                                    value={stage.percentage}
                                                    onChange={(e) => updatePaymentPlanStage(index, 'percentage', e.target.value)}
                                                    placeholder="20"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <Input
                                                    label="Title"
                                                    value={stage.title}
                                                    onChange={(e) => updatePaymentPlanStage(index, 'title', e.target.value)}
                                                    placeholder="e.g. Down Payment"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <Input
                                                    label="Subtitle / Condition"
                                                    value={stage.subtitle}
                                                    onChange={(e) => updatePaymentPlanStage(index, 'subtitle', e.target.value)}
                                                    placeholder="e.g. On Booking"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removePaymentPlanStage(index)}
                                                className="mb-3 p-3 text-red-400 hover:text-red-300 transition-all"
                                            >
                                                <RiDeleteBinLine size={20} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Agent Showcase */}
                        <div className="bg-[#1a1a1a] p-8 rounded-3xl border border-[#333] space-y-6">
                            <h2 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                <RiUserAddLine className="text-[#BD9B5F]" /> Agent Showcase
                            </h2>
                            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Assign agents to this property listing</p>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {availableAgents.map((agent) => (
                                    <label
                                        key={agent._id}
                                        className={`flex items-center gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${formData.agents.includes(agent._id)
                                            ? 'bg-[#BD9B5F]/10 border-[#BD9B5F] text-white shadow-lg shadow-[#BD9B5F]/5'
                                            : 'bg-black/20 border-[#333] text-gray-500 hover:border-[#BD9B5F]/30'
                                            }`}
                                    >
                                        <input
                                            type="checkbox"
                                            className="hidden"
                                            checked={formData.agents.includes(agent._id)}
                                            onChange={() => handleArrayChange('agents', agent._id)}
                                        />
                                        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 border border-[#333]">
                                            <img src={formatImageUrl(agent.avatar_url)} alt={agent.agent_name} className="w-full h-full object-cover" />
                                        </div>
                                        <span className="text-[10px] font-bold uppercase tracking-tighter truncate">{agent.agent_name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Brochure PDFs */}
                        <div className="bg-[#1a1a1a] p-8 rounded-3xl border border-[#333] space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                    <RiFilePdfLine className="text-[#BD9B5F]" /> Brochures (PDFs)
                                </h2>
                                <button
                                    type="button"
                                    onClick={addBrochureUrl}
                                    className="text-[10px] font-bold text-[#BD9B5F] uppercase hover:underline"
                                >
                                    + Add URL
                                </button>
                            </div>

                            <input
                                type="file"
                                multiple
                                onChange={addBrochureFile}
                                className="hidden"
                                id="brochure-upload"
                                accept="application/pdf"
                            />
                            <label
                                htmlFor="brochure-upload"
                                className="flex flex-col items-center justify-center p-8 bg-black/20 border border-[#333] rounded-2xl cursor-pointer hover:border-[#BD9B5F]/50 transition-all text-gray-500 hover:text-[#BD9B5F]"
                            >
                                <RiFilePdfLine size={32} className="mb-2" />
                                <span className="text-[10px] font-bold uppercase tracking-tighter">Upload PDFs</span>
                            </label>

                            {brochureItems.length > 0 && (
                                <div className="space-y-4 mt-6">
                                    {brochureItems.map((item) => (
                                        <div key={item.id} className="bg-[#222] p-4 rounded-2xl border border-[#333] space-y-3">
                                            <div className="flex items-center justify-between">
                                                <RiFilePdfLine className={item.type === 'file' ? 'text-red-400' : 'text-[#BD9B5F]'} size={18} />
                                                <button
                                                    type="button"
                                                    onClick={() => removeBrochureItem(item.id)}
                                                    className="text-red-400 hover:text-red-300 transition-colors"
                                                >
                                                    <RiDeleteBinLine size={16} />
                                                </button>
                                            </div>

                                            {item.type === 'url' && (
                                                <Input
                                                    label="PDF URL"
                                                    value={item.url}
                                                    onChange={(e) => updateBrochureItem(item.id, 'url', e.target.value)}
                                                    placeholder="https://example.com/brochure.pdf"
                                                />
                                            )}

                                            <Input
                                                label="Title"
                                                value={item.title}
                                                onChange={(e) => updateBrochureItem(item.id, 'title', e.target.value)}
                                                placeholder="Brochure title"
                                            />
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Language</label>
                                                <select
                                                    value={item.language}
                                                    onChange={(e) => updateBrochureItem(item.id, 'language', e.target.value)}
                                                    className="w-full bg-[#111] border border-[#333] rounded-lg px-3 py-2 text-white text-xs focus:border-[#BD9B5F] outline-none"
                                                >
                                                    {languageOptions.map(lang => (
                                                        <option key={lang} value={lang}>{lang.toUpperCase()}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            {item.type === 'file' && <p className="text-[10px] text-gray-500 truncate">{item.file.name}</p>}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>

                    <aside className="space-y-8">
                        {/* Status */}
                        <div className="bg-[#BD9B5F]/5 p-6 rounded-3xl border border-[#BD9B5F]/20 space-y-4">
                            <h3 className="text-sm font-bold text-[#BD9B5F] uppercase tracking-widest">Visibility</h3>
                            <label className="flex items-center gap-4 p-3 bg-black/20 rounded-2xl cursor-pointer hover:bg-[#BD9B5F]/10 transition-all">
                                <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} className="w-5 h-5 accent-[#BD9B5F]" />
                                <span className="text-sm text-white font-medium">Featured</span>
                            </label>
                            <label className="flex items-center gap-4 p-3 bg-black/20 rounded-2xl cursor-pointer hover:bg-[#BD9B5F]/10 transition-all">
                                <input type="checkbox" name="is_new" checked={formData.is_new} onChange={handleChange} className="w-5 h-5 accent-[#BD9B5F]" />
                                <span className="text-sm text-white font-medium">New Launch</span>
                            </label>
                        </div>

                        {/* Hero Update */}
                        <div className="bg-[#1a1a1a] p-6 rounded-3xl border border-[#333] space-y-4">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-sm font-bold text-white uppercase tracking-widest">Hero Image</h3>
                                <div className="flex bg-black/40 rounded-lg p-1">
                                    <button
                                        type="button"
                                        onClick={() => setHeroInputMode('upload')}
                                        className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${heroInputMode === 'upload' ? 'bg-[#BD9B5F] text-black' : 'text-gray-500'}`}
                                    >
                                        UPLOAD
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setHeroInputMode('url')}
                                        className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${heroInputMode === 'url' ? 'bg-[#BD9B5F] text-black' : 'text-gray-500'}`}
                                    >
                                        URL
                                    </button>
                                </div>
                            </div>

                            {heroInputMode === 'upload' ? (
                                <div className="relative group">
                                    <input type="file" onChange={handleHeroImageChange} className="hidden" id="hero-upload" accept="image/*" />
                                    <label
                                        htmlFor="hero-upload"
                                        className="block aspect-[4/3] w-full bg-black/40 border-2 border-dashed border-[#333] rounded-2xl cursor-pointer overflow-hidden relative group"
                                    >
                                        {heroImage ? (
                                            <img src={URL.createObjectURL(heroImage)} alt="hero" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 group-hover:text-[#BD9B5F] transition-all">
                                                <RiImageAddLine size={40} className="mb-2 opacity-50" />
                                                <span className="text-xs font-bold uppercase tracking-wider">Select Hero</span>
                                            </div>
                                        )}
                                    </label>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <Input
                                        label="Hero Image URL"
                                        value={heroUrl}
                                        onChange={(e) => setHeroUrl(e.target.value)}
                                        placeholder="https://example.com/image.jpg"
                                    />
                                    {heroUrl && (
                                        <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden border border-[#333]">
                                            <img src={formatImageUrl(heroUrl)} alt="hero preview" className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Gallery Update */}
                        <div className="bg-[#1a1a1a] p-6 rounded-3xl border border-[#333] space-y-4">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-sm font-bold text-white uppercase tracking-widest">Gallery</h3>
                                <button
                                    type="button"
                                    onClick={addGalleryUrl}
                                    className="text-[10px] font-bold text-[#BD9B5F] uppercase hover:underline"
                                >
                                    + Add URL
                                </button>
                            </div>

                            <input type="file" multiple onChange={addGalleryFiles} className="hidden" id="gallery-upload" accept="image/*" />
                            <label
                                htmlFor="gallery-upload"
                                className="flex flex-col items-center justify-center p-6 bg-black/20 border border-[#333] rounded-2xl cursor-pointer hover:border-[#BD9B5F]/50 transition-all text-gray-500 hover:text-[#BD9B5F]"
                            >
                                <RiGalleryLine size={24} className="mb-2" />
                                <span className="text-[10px] font-bold uppercase tracking-tighter">Add More Images</span>
                            </label>

                            <div className="space-y-4 mt-4">
                                {/* URL Inputs */}
                                {galleryItems.filter(item => item.type === 'url').map((item) => (
                                    <div key={item.id} className="flex gap-2">
                                        <div className="flex-1">
                                            <Input
                                                placeholder="Image URL"
                                                value={item.url}
                                                onChange={(e) => updateGalleryUrl(item.id, e.target.value)}
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeGalleryItem(item.id)}
                                            className="p-3 bg-red-500/10 text-red-400 rounded-xl border border-red-500/20 hover:bg-red-500/20 transition-all"
                                        >
                                            <RiDeleteBinLine size={18} />
                                        </button>
                                    </div>
                                ))}

                                {/* Image Grid */}
                                <div className="grid grid-cols-3 gap-2">
                                    {galleryItems.map((item) => (
                                        (item.type === 'file' || (item.type === 'url' && item.url)) && (
                                            <div key={item.id} className="aspect-square rounded-lg bg-[#222] border border-[#333] overflow-hidden relative group">
                                                <img src={formatImageUrl(item.url)} alt="preview" className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
                                                <button
                                                    type="button"
                                                    onClick={() => removeGalleryItem(item.id)}
                                                    className="absolute inset-0 bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                                                >
                                                    <RiDeleteBinLine size={20} />
                                                </button>
                                            </div>
                                        )
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>

                <div className="pt-10 flex justify-end gap-4">
                    <button type="button" onClick={() => navigate(-1)} className="px-10 py-5 rounded-2xl border border-[#333] text-gray-400 font-bold uppercase tracking-widest text-xs">Cancel</button>
                    <Button type="submit" isLoading={loading} className="px-12 py-5 shadow-lg shadow-[#BD9B5F]/20">Save Intel</Button>
                </div>
            </form>
        </div>
    );
};

export default UpdateProperties;
