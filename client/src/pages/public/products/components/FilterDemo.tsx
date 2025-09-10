import { useState } from 'react';

interface FilterState {
    categories: string[];
    priceRange: [number, number];
    tastes: string[];
    effects: string[];
    sortBy: string;
}

// Demo component để test filter functionality
const FilterDemo = () => {
    const [filter, setFilter] = useState<FilterState>({
        categories: [],
        priceRange: [0, 7000000],
        tastes: [],
        effects: [],
        sortBy: ""
    });

    const handleFilterChange = (newFilter: Partial<FilterState>) => {
        setFilter(prev => ({ ...prev, ...newFilter }));
    };

    // Mock data
    const mockCategories = [
        { _id: '1', category_name: 'Trà Xanh', category_slug: 'tra-xanh', category_description: '', status: 'active' as const, createdAt: '', updatedAt: '' },
        { _id: '2', category_name: 'Trà Đen', category_slug: 'tra-den', category_description: '', status: 'active' as const, createdAt: '', updatedAt: '' },
        { _id: '3', category_name: 'Trà Ô Long', category_slug: 'tra-o-long', category_description: '', status: 'active' as const, createdAt: '', updatedAt: '' }
    ];

    const mockTastes = [
        { _id: '1', taste_name: 'Ngọt hậu', taste_slug: 'ngot-hau', taste_description: '' },
        { _id: '2', taste_name: 'Đậm đà', taste_slug: 'dam-da', taste_description: '' },
        { _id: '3', taste_name: 'Nhẹ nhàng', taste_slug: 'nhe-nhang', taste_description: '' }
    ];

    const mockEffects = [
        { _id: '1', effect_name: 'Thư giãn', effect_slug: 'thu-gian', effect_description: '' },
        { _id: '2', effect_name: 'Tăng tập trung', effect_slug: 'tang-tap-trung', effect_description: '' },
        { _id: '3', effect_name: 'Giải độc', effect_slug: 'giai-doc', effect_description: '' }
    ];

    const mockProducts = [
        {
            _id: '1',
            product_name: 'Trà Xanh Thái Nguyên',
            product_slug: 'tra-xanh-thai-nguyen',
            product_description: 'Trà xanh cao cấp từ Thái Nguyên',
            product_thumb: '/images/tea1.jpg',
            product_cover: '/images/tea1-cover.jpg',
            product_images: ['/images/tea1.jpg'],
            product_basePrice: 150000,
            product_attribute: [],
            product_category: mockCategories[0],
            product_ratingAverage: 4.5,
            isPublished: true,
            isDeleted: false,
            createdAt: '2024-01-01'
        },
        {
            _id: '2',
            product_name: 'Trà Đen Earl Grey',
            product_slug: 'tra-den-earl-grey',
            product_description: 'Trà đen Earl Grey thơm ngon',
            product_thumb: '/images/tea2.jpg',
            product_cover: '/images/tea2-cover.jpg',
            product_images: ['/images/tea2.jpg'],
            product_basePrice: 200000,
            product_attribute: [],
            product_category: mockCategories[1],
            product_ratingAverage: 4.8,
            isPublished: true,
            isDeleted: false,
            createdAt: '2024-01-02'
        }
    ];

    // Filter products based on current filter state
    const filteredProducts = mockProducts.filter(product => {
        // Category filter
        if (filter.categories.length > 0 && !filter.categories.includes(product.product_category.category_name)) {
            return false;
        }

        // Price filter
        if (product.product_basePrice < filter.priceRange[0] || product.product_basePrice > filter.priceRange[1]) {
            return false;
        }

        return true;
    });

    // Sort products
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        switch (filter.sortBy) {
            case 'price-asc':
                return a.product_basePrice - b.product_basePrice;
            case 'price-desc':
                return b.product_basePrice - a.product_basePrice;
            case 'name-asc':
                return a.product_name.localeCompare(b.product_name);
            case 'name-desc':
                return b.product_name.localeCompare(a.product_name);
            case 'rating-desc':
                return b.product_ratingAverage - a.product_ratingAverage;
            default:
                return 0;
        }
    });

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Filter Demo</h1>
            
            {/* Current Filter State */}
            <div className="bg-gray-100 p-4 rounded-lg mb-6">
                <h2 className="font-semibold mb-2">Current Filter State:</h2>
                <pre className="text-sm">{JSON.stringify(filter, null, 2)}</pre>
            </div>

            {/* Filter Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {/* Categories */}
                <div>
                    <h3 className="font-semibold mb-2">Categories:</h3>
                    {mockCategories.map(cat => (
                        <label key={cat._id} className="flex items-center space-x-2 mb-1">
                            <input
                                type="checkbox"
                                checked={filter.categories.includes(cat.category_name)}
                                onChange={(e) => {
                                    const newCategories = e.target.checked
                                        ? [...filter.categories, cat.category_name]
                                        : filter.categories.filter(c => c !== cat.category_name);
                                    handleFilterChange({ categories: newCategories });
                                }}
                            />
                            <span className="text-sm">{cat.category_name}</span>
                        </label>
                    ))}
                </div>

                {/* Price Range */}
                <div>
                    <h3 className="font-semibold mb-2">Price Range:</h3>
                    <input
                        type="range"
                        min="0"
                        max="1000000"
                        value={filter.priceRange[1]}
                        onChange={(e) => handleFilterChange({ priceRange: [0, Number(e.target.value)] })}
                        className="w-full"
                    />
                    <div className="text-sm text-gray-600">
                        0 - {filter.priceRange[1].toLocaleString()} VNĐ
                    </div>
                </div>

                {/* Sort */}
                <div>
                    <h3 className="font-semibold mb-2">Sort By:</h3>
                    <select
                        value={filter.sortBy}
                        onChange={(e) => handleFilterChange({ sortBy: e.target.value })}
                        className="w-full p-2 border rounded"
                    >
                        <option value="">Default</option>
                        <option value="name-asc">Name A-Z</option>
                        <option value="name-desc">Name Z-A</option>
                        <option value="price-asc">Price Low-High</option>
                        <option value="price-desc">Price High-Low</option>
                        <option value="rating-desc">Rating High-Low</option>
                    </select>
                </div>

                {/* Clear Filters */}
                <div>
                    <h3 className="font-semibold mb-2">Actions:</h3>
                    <button
                        onClick={() => setFilter({
                            categories: [],
                            priceRange: [0, 7000000],
                            tastes: [],
                            effects: [],
                            sortBy: ""
                        })}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                        Clear All
                    </button>
                </div>
            </div>

            {/* Results */}
            <div>
                <h2 className="font-semibold mb-4">
                    Results ({sortedProducts.length} products):
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {sortedProducts.map(product => (
                        <div key={product._id} className="border p-4 rounded-lg">
                            <h3 className="font-semibold">{product.product_name}</h3>
                            <p className="text-sm text-gray-600">{product.product_category.category_name}</p>
                            <p className="text-lg font-bold text-green-600">
                                {product.product_basePrice.toLocaleString()} VNĐ
                            </p>
                            <p className="text-sm">Rating: {product.product_ratingAverage}/5</p>
                        </div>
                    ))}
                </div>
                
                {sortedProducts.length === 0 && (
                    <p className="text-gray-500 text-center py-8">
                        No products found. Try adjusting your filters.
                    </p>
                )}
            </div>
        </div>
    );
};

export default FilterDemo;
