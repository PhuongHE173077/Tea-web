declare global {
    interface Tea {
        _id: string;
        name: string;
        brand?: string;
        images: string[];
        price: number;
        imageThumb?: string;
        imageCover?: string;
        description: string;
        descriptionDetail: string;
        brewing: string[];
        category: string;
        popularity?: number;
        reviews: Review[];
        rating: number;
    }

    interface Taste {
        _id: string;
        taste_name: string;
        taste_slug: string;
        taste_description: string;
    }

    interface Effect {
        _id: string;
        effect_name: string;
        effect_slug: string;
        effect_description: string;
    }

    interface Review {
        _id: string;
        username: string;
        rating: number;
        comment: string;
        date: string;
    }

    interface Category {
        _id: string
        category_name: string
        category_slug: string
        category_description: string
        status: "active" | "inactive"
        createdAt: string
        updatedAt: string
    }

    interface Product {
        _id: string,
        product_name: string,
        product_slug: string,
        product_description: string,
        product_thumb: string,
        product_cover: string,
        product_images: string[],
        product_brewing?: string[],
        product_basePrice: number,
        product_attribute: {
            name: string,
            price: string,
            unit: string,
            image?: string
        }[],
        product_category: Category,
        product_ratingAverage: number,
        isPublished: boolean,
        isDeleted: boolean,
        createdAt: string,
    }

    interface Sku {
        _id: string,
        sku_tier_idx: string[],
        sku_slug: string,
        sku_price: number,
        sku_sale_price: number,
        image_thumbnail: string,
        sku_stock: number,
        sku_default: boolean,
        sku_sort: number,
        product_id: string,
        createdAt: string,
    }

    interface Discount {
        _id: string;
        code: string;
        name: string;
        description: string;
        discount_type: "percentage" | "fixed_amount";
        discount_value: number;
        min_order_value: number;
        max_discount_amount?: number;
        start_date: string;
        end_date: string;
        usage_limit: number;
        used_count: number;
        is_active: boolean;
        users_used: {
            user_id: string;
            used_at: string;
            order_id: string;
        }[];
        created_by: string;
        createdAt: string;
        updatedAt: string;
    }

    interface DiscountFormData {
        code: string;
        name: string;
        description: string;
        discount_type: "percentage" | "fixed_amount";
        discount_value: number;
        min_order_value: number;
        max_discount_amount?: number;
        start_date: string;
        end_date: string;
        usage_limit: number;
        is_active: boolean;
    }

    interface DiscountFilters {
        page?: number;
        limit?: number;
        is_active?: boolean;
        discount_type?: "percentage" | "fixed_amount";
        search?: string;
        sort_by?: string;
        sort_order?: "asc" | "desc";
    }

    interface DiscountStats {
        overview: {
            total_discounts: number;
            active_discounts: number;
            expired_discounts: number;
            used_discounts: number;
            total_usage: number;
        };
        top_used_discounts: {
            _id: string;
            code: string;
            name: string;
            used_count: number;
            usage_limit: number;
        }[];
    }


}