import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import PropertieHeader from '../../components/properties/PropertieHeader'
import { getPropertyBySlug } from '../../apis/property_api'

const PropertyDetailsPage = () => {
    const { slug } = useParams()
    const location = useLocation()
    const navigate = useNavigate()
    const [property, setProperty] = useState(location.state?.property || null)
    const [loading, setLoading] = useState(!location.state?.property)

    useEffect(() => {
        const fetchProperty = async () => {
            if (!slug) return
            try {
                if (!location.state?.property) setLoading(true)
                const data = await getPropertyBySlug(slug)
                setProperty(data)
            } catch (error) {
                console.error('Error fetching property details:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchProperty()
    }, [slug, location.state?.property])

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    if (loading) {
        return (
            <div className='min-h-[60vh] flex flex-col items-center justify-center text-center text-gray-200 bg-[#080808] px-4'>
                <div className="w-12 h-12 border-4 border-[#BD9B5F]/20 border-t-[#BD9B5F] rounded-full animate-spin mb-4"></div>
                <p className='text-xl italic tracking-widest text-gray-500 uppercase'>Consulting our archives...</p>
            </div>
        )
    }

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