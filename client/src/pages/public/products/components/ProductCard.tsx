import { Eye, Heart, ShoppingCart, Star } from "lucide-react";
import { useState } from "react";



const ProductCard: React.FC<{ tea: Tea; index: number }> = ({ tea, index }) => {
    const [imageLoaded, setImageLoaded] = useState(false);

    return (
        <div
            className={`group relative bg-white backdrop-blur-lg rounded-xl border border-white/30 overflow-hidden shadow-md hover:shadow-xl transition-all duration-700 hover:-translate-y-2 hover:scale-[1.02] ${imageLoaded ? "animate-fade-in" : "opacity-0"
                }`}
            style={{ animationDelay: `${index * 100}ms` }}
        >
            {/* Hover gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 via-emerald-400/10 to-lime-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Image container */}
            <div className="relative aspect-square overflow-hidden">
                <img
                    src={tea.imageThumb}
                    alt={tea.name}
                    className="w-full h-full object-cover absolute inset-0 transition-all duration-700 group-hover:opacity-0 group-hover:scale-110 cursor-pointer"
                    onLoad={() => setImageLoaded(true)}
                    onError={() => setImageLoaded(true)}
                />

                <img
                    src={tea.imageCover}
                    alt={`${tea.name} cover`}
                    className="w-full h-full object-cover absolute inset-0 opacity-0 transition-all duration-700 group-hover:opacity-100 group-hover:scale-105 cursor-pointer"
                />

                {/* Action buttons */}
                <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 delay-100">
                    <button className="p-1.5 bg-white/90 backdrop-blur-md rounded-full hover:bg-white hover:scale-110 transition-all duration-200 shadow-sm">
                        <Heart className="w-3.5 h-3.5 text-gray-700 hover:text-red-500" />
                    </button>
                </div>

                {/* Discount badge */}
                <div className="absolute top-2 left-2">
                    <div className="px-2 py-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-full text-[10px] font-bold text-white shadow-lg">
                        -{tea.popularity}%
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-2">
                {/* Brand and rating */}
                <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600 font-medium uppercase tracking-wide">
                        {tea.brand}
                    </span>
                    <div className="flex items-center gap-1 bg-yellow-50 px-2 py-0.5 rounded-full">
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        <span className="text-xs text-gray-800 font-semibold">{tea.rating}</span>
                    </div>
                </div>

                {/* Product name */}
                <h3 className="font-bold text-sm text-gray-900 leading-tight line-clamp-1">
                    {tea.name}
                </h3>

                {/* Description - limited to 2 lines */}
                <p className="text-xs text-gray-600 leading-relaxed line-clamp-2 min-h-[2.5rem]">
                    {tea.description}
                </p>

                {/* Action buttons */}
                <div className="flex gap-2 pt-2">
                    <button className="flex-1 cursor-pointer py-2.5 px-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg text-xs font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-200 hover:shadow-lg hover:shadow-emerald-400/30 hover:scale-105 active:scale-95">
                        Mua ngay
                    </button>
                    <button className="p-2.5 cursor-pointer bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 hover:border-emerald-300 transition-all duration-200 hover:scale-105 active:scale-95 group/cart">
                        <ShoppingCart className="w-4 h-4 text-gray-600 group-hover/cart:text-emerald-500 transition-colors" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;