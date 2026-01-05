import React, { useEffect, memo } from 'react'
import { IoClose } from 'react-icons/io5'
import { motion, AnimatePresence } from 'framer-motion'
import PropertyCard from './PropertyCard'

const FeaturedPropertyModal = memo(({ isOpen, onClose, property }) => {
    // Lock body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    // Handle Escape key
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose()
        }
        window.addEventListener('keydown', handleEsc)
        return () => window.removeEventListener('keydown', handleEsc)
    }, [onClose])

    if (!property) return null

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[10002] flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 30 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.85, opacity: 0, y: 30 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-[450px]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Featured Badge */}
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-10">
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="bg-[#BD9B5F] text-black text-[11px] font-bold uppercase tracking-[0.3em] px-6 py-2 rounded-full shadow-2xl"
                            >
                                New Exclusive Reveal
                            </motion.div>
                        </div>

                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute -top-10 -right-2 z-10 p-2 text-gray-400 hover:text-white transition-all hover:rotate-90 duration-300"
                            aria-label="Close"
                        >
                            <IoClose size={32} />
                        </button>

                        <div className="shadow-[0_0_50px_rgba(189,155,95,0.15)] rounded-2xl">
                            <PropertyCard property={property} />
                        </div>

                        {/* Bottom Label */}
                        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-full text-center">
                            <p className="text-[10px] text-gray-500 uppercase tracking-[0.25em] font-medium">
                                Explore Premium Dubai Living
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
})

FeaturedPropertyModal.displayName = 'FeaturedPropertyModal'

export default FeaturedPropertyModal
