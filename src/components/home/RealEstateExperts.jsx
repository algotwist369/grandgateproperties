import React from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../common/Button'
import { homeSectionsData } from '../../data/homeSections'

const RealEstateExperts = ({ selectedCountry }) => {
  const navigate = useNavigate();
  const data = homeSectionsData[selectedCountry]?.experts || homeSectionsData['Dubai'].experts;
  const statistics = data.stats;

  return (
    <div className='relative py-4 sm:py-6 md:py-10 lg:py-14 xl:py-16'>
      <div className='container mx-auto px-3 sm:px-4 md:px-6 lg:px-4 relative z-20'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12 items-center'>
          {/* Left Side - Text Content */}
          <div className='space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6 xl:space-y-7'>
            {/* Heading */}
            <div className='space-y-2 sm:space-y-3 lg:space-y-4'>
              <h2 className='text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-gray-400 leading-tight sm:leading-[32px] md:leading-[40px] lg:leading-[50px]'>
                {data.title}
                <span className='relative z-10 text-[#D3A188]'> {data.highlight}</span>
              </h2>
            </div>

            {/* Description */}
            <div className='space-y-2 sm:space-y-3 lg:space-y-4'>
              <p className='text-xs sm:text-sm md:text-base lg:text-lg text-gray-400 leading-relaxed'>
                {data.description1}
              </p>
              <p className='text-xs sm:text-sm md:text-base lg:text-lg text-gray-400 leading-relaxed'>
                {data.description2}
              </p>
            </div>

            {/* Enquire Now Button */}
            <div className='flex flex-col sm:flex-row gap-2 sm:gap-3 lg:gap-4'>
              <Button
                text="Enquire Now"
                className='w-full sm:min-w-[180px] sm:w-auto text-[10px] sm:text-xs md:text-sm lg:text-base px-3 py-2 sm:px-4 sm:py-2.5'
                onClick={() => navigate('/properties')}
              />

              <Button
                variant='secondary'
                text="View All Experts"
                className='w-full sm:min-w-[180px] sm:w-auto text-[10px] sm:text-xs md:text-sm lg:text-base px-3 py-2 sm:px-4 sm:py-2.5'
                onClick={() => navigate('/agents')}
              />

            </div>

            {/* Statistics */}
            <div className='grid grid-cols-2 gap-3 sm:gap-4 md:gap-5 lg:gap-6 pt-4 sm:pt-5 md:pt-6 lg:pt-7 xl:pt-8 border-t border-[#D3A188]/20'>
              {statistics.map((stat, index) => (
                <div key={index} className='text-center lg:text-left'>
                  <div className='text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[#D3A188] mb-1 sm:mb-2'>
                    {stat.number}
                  </div>
                  <div className='text-[10px] sm:text-xs md:text-sm text-gray-400'>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>


          {/* Right Side - Image */}
          <div className='relative lg:order-last'>
            <div className='relative overflow-hidden rounded-lg sm:rounded-xl lg:rounded-none'>
              <img
                src={data.image}
                alt='Real Estate Expert'
                className='w-full h-[250px] sm:h-[300px] md:h-[400px] lg:h-[500px] xl:h-[600px] object-contain'
              />
              <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent'></div>
            </div>
            {/* Decorative Element */}
            <div className='hidden lg:block absolute -bottom-6 -right-6 w-32 h-32 bg-[#D3A188]/20 rounded-full blur-3xl'></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RealEstateExperts