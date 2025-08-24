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

    interface Review {
        _id: string;
        username: string;
        rating: number;
        comment: string;
        date: string;
    }
}