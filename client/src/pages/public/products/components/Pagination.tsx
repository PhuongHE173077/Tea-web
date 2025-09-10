interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    maxVisiblePages?: number;
}

const Pagination = ({ 
    currentPage, 
    totalPages, 
    onPageChange, 
    maxVisiblePages = 5 
}: PaginationProps) => {
    // Generate page numbers for pagination
    const getPageNumbers = () => {
        const pages = [];
        
        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            const start = Math.max(1, currentPage - 2);
            const end = Math.min(totalPages, start + maxVisiblePages - 1);
            
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }
        }
        
        return pages;
    };

    if (totalPages <= 1) return null;

    return (
        <div className="flex justify-center mt-16">
            <div className="flex items-center gap-3">
                {/* Previous Button */}
                <button 
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 border border-gray-200 rounded-xl shadow-sm font-semibold transition ${
                        currentPage === 1 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                            : 'bg-white hover:bg-green-50 hover:border-green-400 text-gray-700'
                    }`}
                >
                    Trước
                </button>

                {/* First page if not visible */}
                {getPageNumbers()[0] > 1 && (
                    <>
                        <button
                            onClick={() => onPageChange(1)}
                            className="px-4 py-2 border border-gray-200 bg-white hover:bg-green-50 hover:border-green-400 text-gray-700 rounded-xl shadow font-bold transition"
                        >
                            1
                        </button>
                        {getPageNumbers()[0] > 2 && (
                            <span className="px-2 text-gray-400">...</span>
                        )}
                    </>
                )}

                {/* Page Numbers */}
                {getPageNumbers().map((pageNum) => (
                    <button
                        key={pageNum}
                        onClick={() => onPageChange(pageNum)}
                        className={`px-4 py-2 rounded-xl shadow font-bold transition ${
                            pageNum === currentPage
                                ? 'bg-gradient-to-r from-green-500 to-green-400 text-white'
                                : 'border border-gray-200 bg-white hover:bg-green-50 hover:border-green-400 text-gray-700'
                        }`}
                    >
                        {pageNum}
                    </button>
                ))}

                {/* Last page if not visible */}
                {getPageNumbers()[getPageNumbers().length - 1] < totalPages && (
                    <>
                        {getPageNumbers()[getPageNumbers().length - 1] < totalPages - 1 && (
                            <span className="px-2 text-gray-400">...</span>
                        )}
                        <button
                            onClick={() => onPageChange(totalPages)}
                            className="px-4 py-2 border border-gray-200 bg-white hover:bg-green-50 hover:border-green-400 text-gray-700 rounded-xl shadow font-bold transition"
                        >
                            {totalPages}
                        </button>
                    </>
                )}

                {/* Next Button */}
                <button 
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 border border-gray-200 rounded-xl shadow-sm font-semibold transition ${
                        currentPage === totalPages 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                            : 'bg-white hover:bg-green-50 hover:border-green-400 text-gray-700'
                    }`}
                >
                    Sau
                </button>
            </div>
        </div>
    );
};

export default Pagination;
