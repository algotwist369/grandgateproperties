import { useMemo, memo, useRef, useState, useEffect } from 'react';
import PropertyCard from '../common/PropertyCard';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { getAllProperties } from '../../apis/property_api';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

const ExclusivesSection = memo(({ selectedCountry }) => {
    const prevRef = useRef(null);
    const nextRef = useRef(null);
    const [properties, setProperties] = useState([]);

    useEffect(() => {
        const fetchExclusives = async () => {
            try {
                const params = { featured: true };
                if (selectedCountry && selectedCountry !== 'All') {
                    params.country = selectedCountry;
                }
                const data = await getAllProperties(1, 10, params);
                setProperties(data.properties || []);
            } catch (error) {
                console.error('Error fetching exclusives:', error);
            }
        };
        fetchExclusives();
    }, [selectedCountry]);

    const exclusiveProperties = useMemo(() => {
        return properties.map(p => ({
            ...p,
            id: p._id,
            image: p.hero_image || p.gallery?.[0],
            location: p.location || `${p.community}, ${p.emirate}`,
            propertyTypes: p.property_types,
            startingPrice: p.starting_price,
            source: p
        }));
    }, [properties]);

    if (!exclusiveProperties.length) return null;

    return (
        <section className="relative py-20 lg:py-32 overflow-hidden bg-[#0B0D10]">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://res.cloudinary.com/dcm79v527/image/upload/v1770632396/bg-4_n150li.png"
                    alt="Background"
                    className="w-full h-full object-cover opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0B0D10] via-[#0B0D10]/10 to-[#0B0D10]"></div>
            </div>

            <div className="max-w-[1400px] mx-auto px-6 relative z-10">
                {/* Header */}
                <motion.div
                    className="text-center mb-16 select-none"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-3xl lg:text-6xl font-light tracking-tight text-white mb-6 uppercase">
                        Our <span className="text-[#BD9B5F] font-medium">Exclusive</span> Residences
                    </h2>
                    <div className='flex items-center justify-center gap-4 mb-8'>
                        <div className='w-20 h-px bg-gradient-to-r from-transparent to-[#BD9B5F]/50'></div>
                        <div className='w-2 h-2 rounded-full border border-[#BD9B5F]'></div>
                        <div className='w-20 h-px bg-gradient-to-l from-transparent to-[#BD9B5F]/50'></div>
                    </div>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg lg:text-xl font-light">
                        Discover a curated collection of ultra-luxury properties in the world's most desired locations.
                    </p>
                </motion.div>

                {/* Slider Container */}
                <div className="relative group overflow-hidden">
                    <Swiper
                        modules={[Navigation, Autoplay]}
                        spaceBetween={30}
                        slidesPerView={1}
                        loop={true}
                        autoplay={{ delay: 3000, disableOnInteraction: false }}
                        navigation={{
                            prevEl: prevRef.current,
                            nextEl: nextRef.current,
                        }}
                        onBeforeInit={(swiper) => {
                            swiper.params.navigation.prevEl = prevRef.current;
                            swiper.params.navigation.nextEl = nextRef.current;
                        }}
                        breakpoints={{
                            640: {
                                slidesPerView: 1,
                            },
                            768: {
                                slidesPerView: 2,
                            },
                            1024: {
                                slidesPerView: 3,
                            },
                        }}
                        className="!overflow-visible"
                    >
                        {exclusiveProperties.map((property) => (
                            <SwiperSlide key={property.id} className="h-auto">
                                <PropertyCard property={property} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </section>
    );
});

ExclusivesSection.displayName = 'ExclusivesSection';
export default ExclusivesSection;
