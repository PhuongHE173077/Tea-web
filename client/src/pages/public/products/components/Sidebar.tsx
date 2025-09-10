import { ChevronDown, Filter } from "lucide-react";
import { useState } from "react";

interface FilterState {
    categories: string[];
    priceRange: [number, number];
    tastes: string[];
    effects: string[];
    sortBy: string;
}

interface SidebarFilterProps {
    categories: Category[];
    effects: Effect[];
    tastes: Taste[];
    filter: FilterState;
    onFilterChange: (newFilter: Partial<FilterState>) => void;
}

const SidebarFilter = ({
    categories,
    effects,
    tastes,
    filter,
    onFilterChange
}: SidebarFilterProps) => {
    const [openSections, setOpenSections] = useState({
        category: true,
        price: true,
        taste: true,
        usage: true
    });

    const toggleSection = (section: string) => {
        setOpenSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    // Handle category filter change
    const handleCategoryChange = (categoryName: string, checked: boolean) => {
        const newCategories = checked
            ? [...filter.categories, categoryName]
            : filter.categories.filter(cat => cat !== categoryName);
        onFilterChange({ categories: newCategories });
    };

    // Handle taste filter change
    const handleTasteChange = (tasteName: string, checked: boolean) => {
        const newTastes = checked
            ? [...filter.tastes, tasteName]
            : filter.tastes.filter(taste => taste !== tasteName);
        onFilterChange({ tastes: newTastes });
    };

    // Handle effect filter change
    const handleEffectChange = (effectName: string, checked: boolean) => {
        const newEffects = checked
            ? [...filter.effects, effectName]
            : filter.effects.filter(effect => effect !== effectName);
        onFilterChange({ effects: newEffects });
    };

    // Handle price range change
    const handlePriceChange = (value: number) => {
        onFilterChange({ priceRange: [filter.priceRange[0], value] });
    };

    const FilterSection = ({
        title,
        items,
        sectionKey,
        selectedItems = [],
        onItemChange
    }: {
        title: string,
        items: string[],
        sectionKey: string,
        selectedItems?: string[],
        onItemChange?: (item: string, checked: boolean) => void
    }) => (
        <div className="border-b pb-6">
            <button
                onClick={() => toggleSection(sectionKey)}
                className="flex items-center justify-between w-full text-left font-semibold text-gray-900 hover:text-green-700 transition-colors text-lg"
            >
                {title}
                <ChevronDown className={`w-5 h-5 transition-transform ${openSections[sectionKey] ? 'rotate-180' : ''}`} />
            </button>
            {openSections[sectionKey] && (
                <div className="mt-4 space-y-3">
                    {items.map((item, index) => (
                        <label key={index} className="flex items-center space-x-3 text-base text-gray-700 hover:text-green-700 cursor-pointer transition-colors">
                            <input
                                type="checkbox"
                                className="rounded border-gray-300 text-green-600 focus:ring-green-500 shadow-sm"
                                checked={selectedItems.includes(item)}
                                onChange={(e) => onItemChange?.(item, e.target.checked)}
                            />
                            <span>{item}</span>
                        </label>
                    ))}
                </div>
            )}
        </div>
    );

    // Format price for display
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN').format(price) + ' VNĐ';
    };

    return (
        <div className="p-6 h-fit sticky top-4 shadow-xl">
            <div className="flex items-center gap-3 mb-8 pb-6 border-b">
                <Filter className="w-6 h-6 text-green-600" />
                <h2 className="font-bold text-gray-900 text-xl tracking-wide">Lọc theo danh mục</h2>
            </div>

            <div className="space-y-8">
                {/* Categories Filter */}
                <FilterSection
                    title="Loại trà"
                    items={categories.map(cat => cat.category_name)}
                    sectionKey="category"
                    selectedItems={filter.categories}
                    onItemChange={handleCategoryChange}
                />

                {/* Price Range Filter */}
                <div className="border-b border-gray-100 pb-6">
                    <button
                        onClick={() => toggleSection('price')}
                        className="flex items-center justify-between w-full text-left font-semibold text-gray-900 hover:text-green-700 transition-colors text-lg mb-4"
                    >
                        Lọc trong khoảng giá
                        <ChevronDown className={`w-5 h-5 transition-transform ${openSections.price ? 'rotate-180' : ''}`} />
                    </button>
                    {openSections.price && (
                        <div className="space-y-3">
                            <input
                                type="range"
                                min="0"
                                max="7000000"
                                value={filter.priceRange[1]}
                                onChange={(e) => handlePriceChange(Number(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider shadow-sm"
                            />
                            <div className="flex justify-between text-base text-gray-700">
                                <span>{formatPrice(filter.priceRange[0])}</span>
                                <span>{formatPrice(filter.priceRange[1])}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Tastes Filter */}
                <FilterSection
                    title="Khẩu vị"
                    items={tastes.map(taste => taste.taste_name)}
                    sectionKey="taste"
                    selectedItems={filter.tastes}
                    onItemChange={handleTasteChange}
                />

                {/* Effects Filter */}
                <FilterSection
                    title="Tác dụng"
                    items={effects.map(effect => effect.effect_name)}
                    sectionKey="usage"
                    selectedItems={filter.effects}
                    onItemChange={handleEffectChange}
                />

                {/* Clear Filters Button */}
                {(filter.categories.length > 0 || filter.tastes.length > 0 || filter.effects.length > 0 || filter.priceRange[1] < 7000000) && (
                    <div className="pt-4">
                        <button
                            onClick={() => onFilterChange({
                                categories: [],
                                tastes: [],
                                effects: [],
                                priceRange: [0, 7000000]
                            })}
                            className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                        >
                            Xóa tất cả bộ lọc
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SidebarFilter;