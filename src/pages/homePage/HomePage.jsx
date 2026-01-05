import React, { memo } from 'react'
import HeroSection from '../../components/home/HeroSection'
import ExclusivesSection from '../../components/home/ExclusivesSection'
import RealEstateExperts from '../../components/home/RealEstateExperts'
import FINDYOURPARTNER from '../../components/home/FINDYOURPARTNER'
import Lifestyle from '../../components/home/Lifestyle'
import Visitouroffice from '../../components/home/Visitouroffice'
import WhyChooseUs from '../../components/home/WhyChooseUs'
import BestProperties from '../../components/home/BestProperties'
import { useState, useEffect, useMemo } from 'react'
import { propertyDirectory } from '../../data/dubai_Properties'
import { FeaturedPropertyModal, VideoModal } from '../../components/common'

const HomePage = memo(({ selectedCountry, setSelectedCountry }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  const newProperty = useMemo(() => {
    const property = propertyDirectory.find(p => p.is_new === 1);
    if (!property) return null;

    return {
      ...property,
      image: property.heroImage || property.gallery?.[0] || property.image,
      location: property.location || `${property.community}, ${property.emirate}`
    };
  }, []);

  useEffect(() => {
    if (newProperty) {
      const timer = setTimeout(() => {
        setShowPopup(true);
      }, 2000); // Delay for better UX
      return () => clearTimeout(timer);
    }
  }, [newProperty]);
  return (
    <div className=''>
      <HeroSection selectedCountry={selectedCountry} setSelectedCountry={setSelectedCountry} />
      <ExclusivesSection selectedCountry={selectedCountry} />
      <RealEstateExperts selectedCountry={selectedCountry} />
      <BestProperties selectedCountry={selectedCountry} />
      {/* <FINDYOURPARTNER selectedCountry={selectedCountry} /> */}
      <Lifestyle selectedCountry={selectedCountry} />
      <Visitouroffice selectedCountry={selectedCountry} />
      <WhyChooseUs selectedCountry={selectedCountry} />

      <FeaturedPropertyModal
        isOpen={showPopup}
        onClose={() => {
          setShowPopup(false);
          if (newProperty?.intro_video) {
            setTimeout(() => setShowVideo(true), 600);
          }
        }}
        property={newProperty}
      />

      <VideoModal
        isOpen={showVideo}
        onClose={() => setShowVideo(false)}
        videoUrl={newProperty?.intro_video}
      />
    </div>
  )
});

HomePage.displayName = 'HomePage';

export default HomePage