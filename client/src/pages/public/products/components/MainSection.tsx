import { Eye, Heart, ShoppingCart, Star, ChevronDown, Filter } from "lucide-react";
import { useState } from "react";
import ProductCard from "./ProductCard";
import { teas } from "../mock-api";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger } from "@/components/ui/select";
import { SelectValue } from "@radix-ui/react-select";


const Sidebar = () => {
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

    const FilterSection = ({ title, items, sectionKey }: { title: string, items: string[], sectionKey: string }) => (
        <div className="border-b  pb-6">
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
                            <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500 shadow-sm" />
                            <span>{item}</span>
                        </label>
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <div className="p-6 h-fit sticky top-4 shadow-xl">
            <div className="flex items-center gap-3 mb-8 pb-6 border-b ">
                <Filter className="w-6 h-6 text-green-600" />
                <h2 className="font-bold text-gray-900 text-xl tracking-wide">Lọc theo danh mục</h2>
            </div>

            <div className="space-y-8">
                <FilterSection
                    title="Loại trà"
                    items={["Trà Xanh", "Trà Thảo Mộc", "Trà nổ hoa"]}
                    sectionKey="category"
                />

                <div className="border-b border-gray-100 pb-6">
                    <h3 className="font-semibold text-gray-900 mb-4 text-lg">Lọc trong khoảng giá</h3>
                    <div className="space-y-3">
                        <input
                            type="range"
                            min="0"
                            max="7000000"
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider shadow-sm"
                        />
                        <div className="flex justify-between text-base text-gray-700">
                            <span>0 VNĐ</span>
                            <span>6.999.000 VNĐ</span>
                        </div>
                    </div>
                </div>

                <FilterSection
                    title="Khẩu vị"
                    items={["Cây tre lâu năm", "Ngọt hậu", "Nhẹ nhàng", "Đậm đà", "Hương vị cần bằng", "Hương vị nhiều lớp", "Trà thơm", "Ngọt thơm thảo mộc"]}
                    sectionKey="taste"
                />

                <FilterSection
                    title="Tác dụng"
                    items={["Dễ ngủ", "Nâng cao tinh thần", "Tăng tập trung", "Thư giãn", "Tĩnh tâo"]}
                    sectionKey="usage"
                />
            </div>
        </div>
    );
};

const TeaProductsLayout = () => {
    return (
        <div className="min-h-screen ">
            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Sidebar - Hidden on mobile, shown on desktop */}
                    <div className="lg:w-80 xl:w-96">
                        <div className="lg:sticky lg:top-4">
                            <Sidebar />
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <p className="text-gray-700 text-sm">Hiển thị tất cả {teas.length} kết quả</p>
                            </div>
                            <Select >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Sắp xếp" />
                                </SelectTrigger>
                                <SelectContent >
                                    <SelectGroup>
                                        <SelectLabel>Fruits</SelectLabel>
                                        <SelectItem value="apple">Apple</SelectItem>
                                        <SelectItem value="banana">Banana</SelectItem>
                                        <SelectItem value="blueberry">Blueberry</SelectItem>
                                        <SelectItem value="grapes">Grapes</SelectItem>
                                        <SelectItem value="pineapple">Pineapple</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Products Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
                            {teas.length === 0 ? (
                                <div className="col-span-full text-center py-16">
                                    <p className="text-gray-400 text-xl">Không có sản phẩm nào được tìm thấy</p>
                                </div>
                            ) : (
                                teas.map((tea, index) => (
                                    <div className="animate-fade-in">
                                        <ProductCard key={tea._id} tea={tea} index={index} />
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Pagination */}
                        <div className="flex justify-center mt-16">
                            <div className="flex items-center gap-3">
                                <button className="px-4 py-2 border border-gray-200 rounded-xl bg-white shadow-sm hover:bg-green-50 hover:border-green-400 text-gray-700 font-semibold transition">Trước</button>
                                <button className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-400 text-white rounded-xl shadow font-bold">1</button>
                                <button className="px-4 py-2 border border-gray-200 rounded-xl bg-white shadow-sm hover:bg-green-50 hover:border-green-400 text-gray-700 font-semibold transition">2</button>
                                <button className="px-4 py-2 border border-gray-200 rounded-xl bg-white shadow-sm hover:bg-green-50 hover:border-green-400 text-gray-700 font-semibold transition">3</button>
                                <button className="px-4 py-2 border border-gray-200 rounded-xl bg-white shadow-sm hover:bg-green-50 hover:border-green-400 text-gray-700 font-semibold transition">Sau</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style >{`
                .slider::-webkit-slider-thumb {
                    appearance: none;
                    height: 22px;
                    width: 22px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #10b981 60%, #34d399 100%);
                    cursor: pointer;
                    border: 2px solid #ffffff;
                    box-shadow: 0 4px 12px rgba(16,185,129,0.15);
                    transition: background 0.3s;
                }

                .slider::-moz-range-thumb {
                    height: 22px;
                    width: 22px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #10b981 60%, #34d399 100%);
                    cursor: pointer;
                    border: 2px solid #ffffff;
                    box-shadow: 0 4px 12px rgba(16,185,129,0.15);
                    transition: background 0.3s;
                }

                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-fade-in {
                    animation: fade-in 0.6s cubic-bezier(.4,0,.2,1) forwards;
                }

                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>
        </div>
    );
};

export default TeaProductsLayout;