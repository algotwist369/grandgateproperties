import React from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../common/Button'
import { homeSectionsData } from '../../data/homeSections'
import { motion } from 'framer-motion'

const RealEstateExperts = ({ selectedCountry }) => {
  const navigate = useNavigate();
  const data = homeSectionsData[selectedCountry]?.experts || homeSectionsData['Dubai'].experts;
  const statistics = data.stats;

  return (
    <div className='relative py-20 lg:py-32 overflow-hidden bg-black'>
      <div className='container mx-auto px-6 relative z-20'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-16 items-center'>
          {/* Left Side - Text Content */}
          <motion.div
            className='space-y-8'
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Heading */}
            <div className='space-y-4'>
              <h2 className='text-3xl sm:text-4xl lg:text-5xl xl:text-6xl text-white font-light leading-tight tracking-tight uppercase'>
                {data.title}
                <span className='block text-[#BD9B5F] font-medium mt-2'> {data.highlight}</span>
              </h2>
            </div>

            {/* Description */}
            <div className='space-y-6'>
              <p className='text-base lg:text-lg text-gray-400 font-light leading-relaxed max-w-xl'>
                {data.description1}
              </p>
              <p className='text-base lg:text-lg text-gray-400 font-light leading-relaxed max-w-xl'>
                {data.description2}
              </p>
            </div>

            {/* Enquire Now Button */}
            <div className='flex flex-col sm:flex-row gap-4 pt-4'>
              <Button
                text="Enquire Now"
                className='w-full sm:min-w-[200px] py-4'
                onClick={() => navigate('/en/properties')}
              />

              <Button
                variant='secondary'
                text="View All Experts"
                className='w-full sm:min-w-[200px] py-4 border-[#BD9B5F]/30 text-white hover:border-[#BD9B5F]'
                onClick={() => navigate('/en/agents')}
              />
            </div>

            {/* Statistics */}
            <div className='grid grid-cols-2 gap-8 pt-12 border-t border-gray-800'>
              {statistics.map((stat, index) => (
                <div key={index}>
                  <motion.div
                    className='text-3xl lg:text-5xl font-bold text-[#BD9B5F] mb-2'
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + (index * 0.1) }}
                  >
                    {stat.number}
                  </motion.div>
                  <div className='text-sm text-gray-400 uppercase tracking-widest font-medium'>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>


          {/* Right Side - Image */}
          <motion.div
            className='relative lg:order-last'
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <div className='relative overflow-hidden rounded-3xl shadow-2xl border border-white/5'>
              <img
                src={data.image}
                alt='Real Estate Expert'
                className='w-full h-[400px] lg:h-[650px] object-cover hover:scale-105 transition-transform duration-700'
              />
              <div className='absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60'></div>
            </div>

            {/* Minimalist Decoration */}
            <div className='absolute -top-10 -right-10 w-40 h-40 bg-[#BD9B5F]/10 rounded-full blur-[80px]'></div>
            <div className='absolute -bottom-10 -left-10 w-32 h-32 bg-[#BD9B5F]/10 rounded-full blur-[60px]'></div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default RealEstateExperts