import React, { useEffect, memo } from 'react'
import { IoClose } from 'react-icons/io5'
import { motion, AnimatePresence } from 'framer-motion'

const VideoModal = memo(({ isOpen, onClose, videoUrl }) => {
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

    if (!videoUrl) return null

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors backdrop-blur-md"
                            aria-label="Close video"
                        >
                            <IoClose size={24} />
                        </button>

                        {/* Video Player */}
                        <video
                            src={videoUrl}
                            className="w-full h-full object-contain"
                            controls
                            autoPlay
                            playsInline
                        >
                            Your browser does not support the video tag.
                        </video>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
})

VideoModal.displayName = 'VideoModal'

export default VideoModal
