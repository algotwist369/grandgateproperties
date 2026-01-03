import React, { memo } from 'react'
import HeroSection from '../../components/home/HeroSection'
import ExclusivesSection from '../../components/home/ExclusivesSection'
import RealEstateExperts from '../../components/home/RealEstateExperts'
import FINDYOURPARTNER from '../../components/home/FINDYOURPARTNER'
import Lifestyle from '../../components/home/Lifestyle'
import Visitouroffice from '../../components/home/Visitouroffice'
import WhyChooseUs from '../../components/home/WhyChooseUs'
import BestProperties from '../../components/home/BestProperties'

const HomePage = memo(({ selectedCountry, setSelectedCountry }) => {
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
    </div>
  )
});

HomePage.displayName = 'HomePage';

export default HomePage