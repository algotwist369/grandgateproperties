import React from 'react';
import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';

const Pagination = ({ currentPage, totalPages, onPageChange, totalItems }) => {
    if (totalPages <= 1) return null;

    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
        // Show ellipsis logic for many pages (optional but good)
        if (
            i === 1 ||
            i === totalPages ||
            (i >= currentPage - 1 && i <= currentPage + 1)
        ) {
            pages.push(i);
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            pages.push('...');
        }
    }

    const uniquePages = [...new Set(pages)];

    return (
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-6 px-2">
            <div className="text-gray-500 text-xs font-medium uppercase tracking-widest">
                Showing <span className="text-[#BD9B5F]">{currentPage}</span> of <span className="text-white">{totalPages}</span> Pages
                {totalItems && <span className="ml-2 border-l border-[#333] pl-2">Total <span className="text-white">{totalItems}</span> Items</span>}
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 bg-[#1a1a1a] border border-[#333] rounded-xl text-gray-400 hover:text-[#BD9B5F] hover:border-[#BD9B5F]/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                    <RiArrowLeftSLine size={20} />
                </button>

                <div className="flex items-center gap-1">
                    {uniquePages.map((page, index) => (
                        <React.Fragment key={index}>
                            {page === '...' ? (
                                <span className="px-3 text-gray-600">...</span>
                            ) : (
                                <button
                                    onClick={() => onPageChange(page)}
                                    className={`w-10 h-10 rounded-xl text-xs font-bold transition-all border ${currentPage === page
                                            ? 'bg-[#BD9B5F] text-black border-[#BD9B5F] shadow-lg shadow-[#BD9B5F]/20'
                                            : 'bg-[#1a1a1a] text-gray-500 border-[#333] hover:border-[#BD9B5F]/30 hover:text-white'
                                        }`}
                                >
                                    {page}
                                </button>
                            )}
                        </React.Fragment>
                    ))}
                </div>

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 bg-[#1a1a1a] border border-[#333] rounded-xl text-gray-400 hover:text-[#BD9B5F] hover:border-[#BD9B5F]/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                    <RiArrowRightSLine size={20} />
                </button>
            </div>
        </div>
    );
};

export default Pagination;
