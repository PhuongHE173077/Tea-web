export interface ProductAdd {
    product_name: string,
    product_description: string,
    product_thumb: string,
    product_cover: string,
    product_basePrice: number
    product_images: string[],
    product_brewing: string[],
    product_attribute: {
        name: string,
        unit: string,
        price: number,
        image: string
    }[],
    tastes: string[],
    effects: string[],
    product_category: string;
    product_tea_category: string[];
    isPublished: boolean
}

