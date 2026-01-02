import React, {
    useState,
    useEffect,
    useMemo,
    useCallback,
    memo,
    useRef
} from 'react';
import PropertyCard from '../common/PropertyCard';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { propertyDirectory } from '../../data/dubai_Properties';

const DRAG_THRESHOLD = 60;

const ExclusivesSection = memo(({ selectedCountry }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [slidesToShow, setSlidesToShow] = useState(3);
    const [isPaused, setIsPaused] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const startX = useRef(0);
    const isDragging = useRef(false);

    /* ------------------ Formatters ------------------ */
    const currencyFormatter = useMemo(
        () =>
            new Intl.NumberFormat('en-AE', {
                style: 'currency',
                currency: 'AED',
                maximumFractionDigits: 0,
            }),
        []
    );

    const numberFormatter = useMemo(
        () =>
            new Intl.NumberFormat('en-US', {
                maximumFractionDigits: 0,
            }),
        []
    );

    /* ------------------ Responsive Logic ------------------ */
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;

            setIsMobile(width < 768);

            if (width < 768) setSlidesToShow(1);
            else if (width < 1024) setSlidesToShow(2);
            else setSlidesToShow(3);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    /* ------------------ Data Preparation ------------------ */
    const exclusiveProperties = useMemo(() => {
        return propertyDirectory
            .filter(p => p.featured && p.country === selectedCountry)
            .map(p => ({
                id: p.id,
                slug: p.slug,
                title: p.title,
                location: `${p.community}, ${p.emirate}`,
                price: p.price ? currencyFormatter.format(p.price) : null,
                startingPrice: p.startingPrice,
                units: p.units,
                bedrooms: p.bedrooms,
                bathrooms: p.bathrooms,
                area: p.sqft ? `${numberFormatter.format(p.sqft)} sqft` : null,
                image: p.heroImage || p.gallery?.[0],
                type: p.propertyType,
                propertyTypes: p.propertyTypes,
                source: p,
            }));
    }, [selectedCountry, currencyFormatter, numberFormatter]);

    const totalSlides = useMemo(() => {
        if (!exclusiveProperties.length) return 0;
        return Math.ceil(exclusiveProperties.length / slidesToShow);
    }, [exclusiveProperties.length, slidesToShow]);

    /* ------------------ Slide Bounds Safety ------------------ */
    useEffect(() => {
        if (currentSlide >= totalSlides) setCurrentSlide(0);
    }, [currentSlide, totalSlides]);

    /* ------------------ Auto Slide ------------------ */
    useEffect(() => {
        if (isPaused || isMobile || totalSlides <= 1) return;

        const timer = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % totalSlides);
        }, 5000);

        return () => clearInterval(timer);
    }, [isPaused, isMobile, totalSlides]);

    /* ------------------ Controls ------------------ */
    const nextSlide = useCallback(() => {
        setCurrentSlide(prev => (prev + 1) % totalSlides);
    }, [totalSlides]);

    const prevSlide = useCallback(() => {
        setCurrentSlide(prev => (prev - 1 + totalSlides) % totalSlides);
    }, [totalSlides]);

    /* ------------------ Drag Logic ------------------ */
    const onDragStart = (x) => {
        isDragging.current = true;
        startX.current = x;
        setIsPaused(true);
    };

    const onDragMove = (x) => {
        if (!isDragging.current) return;
        const diff = x - startX.current;

        if (Math.abs(diff) > DRAG_THRESHOLD) {
            diff > 0 ? prevSlide() : nextSlide();
            isDragging.current = false;
            setTimeout(() => setIsPaused(false), 800);
        }
    };

    const onDragEnd = () => {
        isDragging.current = false;
        setTimeout(() => setIsPaused(false), 800);
    };

    if (!exclusiveProperties.length) return null;

    return (
        <section className="relative py-10 lg:py-16">
            <div className="container mx-auto px-4">

                {/* Header */}
                <div className="text-center mb-10 select-none">
                    <h2 className="text-3xl lg:text-5xl text-gray-400">
                        OUR <span className="text-[#D3A188]">EXCLUSIVE</span> PROPERTIES
                    </h2>
                    <div className='flex items-center justify-center gap-2 sm:gap-3 lg:gap-4 my-4 sm:my-6 lg:my-8'>
                        <div className='w-8 sm:w-12 lg:w-16 h-px bg-gradient-to-r from-transparent to-[#D3A188]'></div>
                        <div className='w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#D3A188]'></div>
                        <div className='w-8 sm:w-12 lg:w-16 h-px bg-gradient-to-l from-transparent to-[#D3A188]'></div>
                    </div>
                    <p className="text-gray-400 mt-3 max-w-2xl mx-auto">
                        Handpicked premium residences across Dubai and India
                    </p>
                </div>

                {/* Slider */}
                <div
                    className="relative overflow-hidden rounded-2xl cursor-grab active:cursor-grabbing
                               select-none touch-none"
                    style={{ userSelect: 'none' }}
                    onMouseDown={(e) => onDragStart(e.clientX)}
                    onMouseMove={(e) => onDragMove(e.clientX)}
                    onMouseUp={onDragEnd}
                    onMouseLeave={onDragEnd}
                    onTouchStart={(e) => onDragStart(e.touches[0].clientX)}
                    onTouchMove={(e) => onDragMove(e.touches[0].clientX)}
                    onTouchEnd={onDragEnd}
                >
                    <div
                        className="flex transition-transform duration-500 ease-out will-change-transform"
                        style={{
                            transform: `translate3d(-${currentSlide * 100}%, 0, 0)`,
                        }}
                    >
                        {Array.from({ length: totalSlides }).map((_, i) => {
                            const start = i * slidesToShow;
                            const items = exclusiveProperties.slice(start, start + slidesToShow);

                            return (
                                <div
                                    key={i}
                                    className="min-w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-2"
                                >
                                    {items.map(property => (
                                        <PropertyCard
                                            key={property.id}
                                            property={property}
                                            onModalChange={setIsPaused}
                                        />
                                    ))}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Desktop Arrows */}
                <button
                    onClick={prevSlide}
                    className="hidden lg:flex absolute left-[91px] top-1/2 -translate-y-1/2
                    text-[#D3A188] p-3 rounded-full border border-[#D3A188]/40
                    backdrop-blur hover:border-[#D3A188] select-none"
                >
                    <IoIosArrowBack size={22} />
                </button>

                <button
                    onClick={nextSlide}
                    className="hidden lg:flex absolute right-[91px] top-1/2 -translate-y-1/2
                    text-[#D3A188] p-3 rounded-full border border-[#D3A188]/40
                    backdrop-blur hover:border-[#D3A188] select-none"
                >
                    <IoIosArrowForward size={22} />
                </button>

                {/* Progress Indicator */}
                <div className="flex justify-center mt-8 select-none">
                    <div className="w-32 h-[3px] bg-white/10 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-[#D3A188] transition-all duration-500"
                            style={{
                                width: `${((currentSlide + 1) / totalSlides) * 100}%`,
                            }}
                        />
                    </div>
                </div>

            </div>
        </section>
    );
});

ExclusivesSection.displayName = 'ExclusivesSection';
export default ExclusivesSection;
