import React, { useEffect, useMemo } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import PropertieHeader from '../../components/properties/PropertieHeader'
import { propertyDirectory, getPropertyBySlug } from '../../data/dubai_Properties'

const PropertyDetailsPage = () => {
    const { slug } = useParams()
    const location = useLocation()
    const navigate = useNavigate()

    const property = useMemo(() => {
        if (location.state?.property) {
            return location.state.property
        }

        if (location.state?.propertyId) {
            return propertyDirectory.find((item) => item.id === location.state.propertyId)
        }

        if (slug) {
            return getPropertyBySlug(slug)
        }

        return propertyDirectory[0]
    }, [location.state?.property, location.state?.propertyId, slug])

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    if (!property) {
        return (
            <div className='min-h-[60vh] flex flex-col items-center justify-center text-center text-gray-200 bg-[#080808] px-4'>
                <p className='text-xl mb-4'>We couldn’t find that property.</p>
                <button
                    onClick={() => navigate('/en')}
                    className='px-6 py-3 border border-[#BD9B5F] text-[#BD9B5F] rounded hover:bg-[#BD9B5F]/10 transition'
                >
                    Back to home
                </button>
            </div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
        >
            <PropertieHeader property={property} />
        </motion.div>
    )
}

export default PropertyDetailsPage