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


}