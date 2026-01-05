import React, { useEffect, memo } from 'react'
import { IoClose, IoDownloadOutline } from 'react-icons/io5'
import { motion, AnimatePresence } from 'framer-motion'

const PdfModal = memo(({ isOpen, onClose, pdfUrl, title }) => {
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

    if (!pdfUrl) return null

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[10001] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 sm:p-8"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        className="relative w-full max-w-6xl h-[90vh] bg-[#0A0A0A] rounded-2xl overflow-hidden shadow-2xl border border-gray-800 flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-[#0F0F0F]">
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase tracking-widest text-[#BD9B5F] mb-0.5">Project Asset</span>
                                <h3 className="text-white text-sm sm:text-base font-medium truncate max-w-[200px] sm:max-w-md">
                                    {title}
                                </h3>
                            </div>

                            <div className="flex items-center gap-3">
                                <a
                                    href={pdfUrl}
                                    download
                                    className="p-2 text-gray-400 hover:text-[#BD9B5F] transition-colors"
                                    title="Download PDF"
                                >
                                    <IoDownloadOutline size={22} />
                                </a>
                                <button
                                    onClick={onClose}
                                    className="p-2 bg-gray-800/50 hover:bg-gray-800 text-white rounded-full transition-colors"
                                    aria-label="Close"
                                >
                                    <IoClose size={22} />
                                </button>
                            </div>
                        </div>

                        {/* PDF Viewer */}
                        <div className="flex-1 w-full bg-[#111] relative">
                            <iframe
                                src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                                className="w-full h-full border-none"
                                title={title}
                            />
                        </div>

                        {/* Status Bar */}
                        <div className="px-6 py-2 border-t border-gray-800 bg-[#0F0F0F] flex items-center justify-center">
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-light">
                                Grand Gate Properties • Exclusive Access
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
})

PdfModal.displayName = 'PdfModal'

export default PdfModal
