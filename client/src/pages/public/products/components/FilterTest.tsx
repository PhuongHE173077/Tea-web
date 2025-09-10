import { useState, useEffect } from 'react';
import { fetchProductsAPIs } from '@/apis/product.apis';
import { fetchCategoriesAPIs } from '@/apis/category.apis';
import { fetchEffect, fetchTaste } from '@/apis/attribute.apis';

// Component để test API filtering
const FilterTest = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [tastes, setTastes] = useState<Taste[]>([]);
    const [effects, setEffects] = useState<Effect[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');

    // Test filters
    const [testFilters, setTestFilters] = useState({
        categories: [] as string[],
        minPrice: '',
        maxPrice: '',
        tastes: [] as string[],
        effects: [] as string[],
        sortBy: ''
    });

    // Fetch initial data
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [categoriesRes, tastesRes, effectsRes] = await Promise.all([
                    fetchCategoriesAPIs(),
                    fetchTaste(),
                    fetchEffect()
                ]);

                setCategories(categoriesRes.data);
                setTastes(tastesRes.data);
                setEffects(effectsRes.data);
            } catch (err) {
                setError('Failed to fetch initial data');
                console.error(err);
            }
        };

        fetchInitialData();
    }, []);

    // Test API call
    const testAPI = async () => {
        setLoading(true);
        setError('');
        
        try {
            const params: any = {
                page: 1,
                size: 10,
                search: ""
            };

            // Add filters if they exist
            if (testFilters.categories.length > 0) {
                params.categories = testFilters.categories;
            }
            if (testFilters.minPrice) {
                params.minPrice = parseFloat(testFilters.minPrice);
            }
            if (testFilters.maxPrice) {
                params.maxPrice = parseFloat(testFilters.maxPrice);
            }
            if (testFilters.tastes.length > 0) {
                params.tastes = testFilters.tastes;
            }
            if (testFilters.effects.length > 0) {
                params.effects = testFilters.effects;
            }
            if (testFilters.sortBy) {
                params.sortBy = testFilters.sortBy;
            }

            console.log('API Params:', params);
            
            const response = await fetchProductsAPIs(params);
            setProducts(response.data);
            console.log('API Response:', response);
        } catch (err) {
            setError('API call failed: ' + (err as Error).message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryChange = (categoryName: string, checked: boolean) => {
        setTestFilters(prev => ({
            ...prev,
            categories: checked 
                ? [...prev.categories, categoryName]
                : prev.categories.filter(c => c !== categoryName)
        }));
    };

    const handleTasteChange = (tasteName: string, checked: boolean) => {
        setTestFilters(prev => ({
            ...prev,
            tastes: checked 
                ? [...prev.tastes, tasteName]
                : prev.tastes.filter(t => t !== tasteName)
        }));
    };

    const handleEffectChange = (effectName: string, checked: boolean) => {
        setTestFilters(prev => ({
            ...prev,
            effects: checked 
                ? [...prev.effects, effectName]
                : prev.effects.filter(e => e !== effectName)
        }));
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">API Filter Test</h1>
            
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Filter Controls */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h2 className="font-semibold mb-4">Test Filters</h2>
                        
                        {/* Categories */}
                        <div className="mb-4">
                            <h3 className="font-medium mb-2">Categories:</h3>
                            {categories.map(cat => (
                                <label key={cat._id} className="flex items-center space-x-2 mb-1">
                                    <input
                                        type="checkbox"
                                        checked={testFilters.categories.includes(cat.category_name)}
                                        onChange={(e) => handleCategoryChange(cat.category_name, e.target.checked)}
                                    />
                                    <span className="text-sm">{cat.category_name}</span>
                                </label>
                            ))}
                        </div>

                        {/* Price Range */}
                        <div className="mb-4">
                            <h3 className="font-medium mb-2">Price Range:</h3>
                            <div className="flex space-x-2">
                                <input
                                    type="number"
                                    placeholder="Min Price"
                                    value={testFilters.minPrice}
                                    onChange={(e) => setTestFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                                    className="w-full p-2 border rounded text-sm"
                                />
                                <input
                                    type="number"
                                    placeholder="Max Price"
                                    value={testFilters.maxPrice}
                                    onChange={(e) => setTestFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                                    className="w-full p-2 border rounded text-sm"
                                />
                            </div>
                        </div>

                        {/* Tastes */}
                        <div className="mb-4">
                            <h3 className="font-medium mb-2">Tastes:</h3>
                            {tastes.map(taste => (
                                <label key={taste._id} className="flex items-center space-x-2 mb-1">
                                    <input
                                        type="checkbox"
                                        checked={testFilters.tastes.includes(taste.taste_name)}
                                        onChange={(e) => handleTasteChange(taste.taste_name, e.target.checked)}
                                    />
                                    <span className="text-sm">{taste.taste_name}</span>
                                </label>
                            ))}
                        </div>

                        {/* Effects */}
                        <div className="mb-4">
                            <h3 className="font-medium mb-2">Effects:</h3>
                            {effects.map(effect => (
                                <label key={effect._id} className="flex items-center space-x-2 mb-1">
                                    <input
                                        type="checkbox"
                                        checked={testFilters.effects.includes(effect.effect_name)}
                                        onChange={(e) => handleEffectChange(effect.effect_name, e.target.checked)}
                                    />
                                    <span className="text-sm">{effect.effect_name}</span>
                                </label>
                            ))}
                        </div>

                        {/* Sort By */}
                        <div className="mb-4">
                            <h3 className="font-medium mb-2">Sort By:</h3>
                            <select
                                value={testFilters.sortBy}
                                onChange={(e) => setTestFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                                className="w-full p-2 border rounded text-sm"
                            >
                                <option value="">Default</option>
                                <option value="name-asc">Name A-Z</option>
                                <option value="name-desc">Name Z-A</option>
                                <option value="price-asc">Price Low-High</option>
                                <option value="price-desc">Price High-Low</option>
                                <option value="rating-desc">Rating High-Low</option>
                            </select>
                        </div>

                        <button
                            onClick={testAPI}
                            disabled={loading}
                            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
                        >
                            {loading ? 'Testing...' : 'Test API'}
                        </button>

                        <button
                            onClick={() => setTestFilters({
                                categories: [],
                                minPrice: '',
                                maxPrice: '',
                                tastes: [],
                                effects: [],
                                sortBy: ''
                            })}
                            className="w-full mt-2 bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>

                {/* Results */}
                <div className="lg:col-span-3">
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h2 className="font-semibold mb-4">Results ({products.length} products)</h2>
                        
                        {loading && (
                            <div className="flex justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {products.map(product => (
                                <div key={product._id} className="border p-4 rounded-lg">
                                    <h3 className="font-semibold text-sm mb-2">{product.product_name}</h3>
                                    <p className="text-xs text-gray-600 mb-1">
                                        Category: {product.product_category?.category_name || 'N/A'}
                                    </p>
                                    <p className="text-sm font-bold text-green-600 mb-1">
                                        {product.product_basePrice?.toLocaleString()} VNĐ
                                    </p>
                                    <p className="text-xs mb-1">Rating: {product.product_ratingAverage}/5</p>
                                    
                                    {/* Show tastes if available */}
                                    {product.product_taste && product.product_taste.length > 0 && (
                                        <p className="text-xs text-blue-600">
                                            Tastes: {product.product_taste.map((t: any) => t.taste_name).join(', ')}
                                        </p>
                                    )}
                                    
                                    {/* Show effects if available */}
                                    {product.product_effects && product.product_effects.length > 0 && (
                                        <p className="text-xs text-purple-600">
                                            Effects: {product.product_effects.map((e: any) => e.effect_name).join(', ')}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>

                        {products.length === 0 && !loading && (
                            <p className="text-gray-500 text-center py-8">
                                No products found. Try adjusting your filters or click "Test API" to fetch data.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilterTest;
