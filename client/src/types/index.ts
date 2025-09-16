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
        category_icon?: string
        category_image?: {
            url?: string
            isActive?: boolean
        }
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

    // Landing Page Types
    interface LandingPageHeader {
        title: string;
        detail: string;
        imageCover: string;
        attribute: any[];
        isActive: boolean;
    }

    interface LandingPageAboutAttribute {
        icon: string;
        title: string;
        detail: string;
    }

    interface LandingPageAboutSection {
        title: string;
        detail: string;
        attribute: LandingPageAboutAttribute[];
        isActive: boolean;
    }

    interface LandingPageVideo {
        url: string;
        isActive: boolean;
    }

    interface LandingPageMainSectionItem {
        title: string;
        detail: string;
        imageCover: string;
        isActive: boolean;
    }

    interface LandingPageEventSubSection {
        title: string;
        detail: string;
    }

    interface LandingPageEventSection {
        tag: string[];
        title: string;
        detail: string;
        imageCol1: string[];
        imageCol2: string[];
        subSection: LandingPageEventSubSection[];
        isActive: boolean;
    }

    interface LandingPageCarousel {
        title: string;
        detail: string;
        carouselList: {
            title: string;
            detail: string;
            imageCover: string;
            tab: string;
        }[];
        isActive: boolean;
    }

    interface LandingPage {
        _id: string;
        header: LandingPageHeader;
        aboutSection: LandingPageAboutSection;
        video: LandingPageVideo;
        mainSection: LandingPageMainSectionItem[];
        eventSection: LandingPageEventSection;
        carousel: LandingPageCarousel;
        createdAt: string;
        updatedAt: string;
    }

    interface LandingPageFormData {
        header?: Partial<LandingPageHeader>;
        aboutSection?: Partial<LandingPageAboutSection>;
        video?: Partial<LandingPageVideo>;
        mainSection?: LandingPageMainSectionItem[];
        eventSection?: Partial<LandingPageEventSection>;
        carousel?: Partial<LandingPageCarousel>;
    }

    // Company Info Types
    interface SocialMediaInfo {
        url: string;
        name: string;
        isActive: boolean;
    }

    interface CompanyInfo {
        _id: string;
        company_name: string;
        company_description: string;
        company_address: string;
        company_phone: string;
        company_email: string;
        company_facebook: SocialMediaInfo;
        company_instagram: SocialMediaInfo;
        company_youtube: SocialMediaInfo;
        company_tiktok: SocialMediaInfo;
        company_twitter: SocialMediaInfo;
        company_linkedin: SocialMediaInfo;
        company_shopee: SocialMediaInfo;
        company_zalo: SocialMediaInfo;
        createdAt: string;
        updatedAt: string;
    }

    interface CompanyInfoFormData {
        company_name: string;
        company_description: string;
        company_address: string;
        company_phone: string;
        company_email: string;
        company_facebook: SocialMediaInfo;
        company_instagram: SocialMediaInfo;
        company_youtube: SocialMediaInfo;
        company_tiktok: SocialMediaInfo;
        company_twitter: SocialMediaInfo;
        company_linkedin: SocialMediaInfo;
        company_shopee: SocialMediaInfo;
        company_zalo: SocialMediaInfo;
    }

    interface CompanyInfoUpdateData {
        company_name?: string;
        company_description?: string;
        company_address?: string;
        company_phone?: string;
        company_email?: string;
        company_facebook?: SocialMediaInfo;
        company_instagram?: SocialMediaInfo;
        company_youtube?: SocialMediaInfo;
        company_tiktok?: SocialMediaInfo;
        company_twitter?: SocialMediaInfo;
        company_linkedin?: SocialMediaInfo;
        company_shopee?: SocialMediaInfo;
        company_zalo?: SocialMediaInfo;
    }

    interface CompanyInfoQueryParams {
        page?: number;
        limit?: number;
        search?: string;
        sortBy?: 'company_name' | 'createdAt' | 'updatedAt';
        sortOrder?: 'asc' | 'desc';
    }

    interface CompanyInfoResponse {
        success: boolean;
        message: string;
        data: CompanyInfo[];
        pagination: {
            currentPage: number;
            totalPages: number;
            totalItems: number;
            itemsPerPage: number;
            hasNextPage: boolean;
            hasPrevPage: boolean;
        };
    }

    interface CompanyInfoSingleResponse {
        success: boolean;
        message: string;
        data: CompanyInfo;
    }

    interface CompanyInfoStats {
        total: number;
        activeCompanies: number;
        inactiveCompanies: number;
    }

    interface CompanyInfoStatsResponse {
        success: boolean;
        message: string;
        data: CompanyInfoStats;
    }

    interface SocialMediaStatusUpdate {
        platform: 'facebook' | 'instagram' | 'youtube' | 'tiktok' | 'twitter' | 'linkedin' | 'shopee' | 'zalo';
        isActive: boolean;
    }

    interface TeaCategory {
        _id: string;
        tea_category_name: string;
        tea_category_slug: string;
        tea_category_description: string;
        status: 'active' | 'inactive';
        createdAt: string;
        updatedAt: string;
    }

    // Blog Types
    interface BlogAuthor {
        _id: string;
        usr_name: string;
        usr_avatar?: string;
        usr_email: string;
    }

    interface BlogThumbnail {
        url?: string;
        alt?: string;
    }

    interface BlogMeta {
        title?: string;
        description?: string;
        keywords?: string[];
    }

    interface Blog {
        _id: string;
        blog_title: string;
        blog_slug: string;
        blog_content: string;
        blog_excerpt: string;
        blog_thumbnail?: BlogThumbnail;
        blog_author: BlogAuthor;
        blog_category?: Category;
        blog_tags: string[];
        blog_status: 'draft' | 'published' | 'archived';
        blog_published_at?: string;
        blog_views: number;
        blog_likes: number;
        blog_meta?: BlogMeta;
        blog_featured: boolean;
        blog_reading_time: number;
        createdAt: string;
        updatedAt: string;
    }

    interface BlogFormData {
        blog_title: string;
        blog_content: string;
        blog_excerpt: string;
        blog_thumbnail?: BlogThumbnail;
        blog_category?: string;
        blog_tags: string[];
        blog_status: 'draft' | 'published' | 'archived';
        blog_meta?: BlogMeta;
        blog_featured: boolean;
    }

    interface BlogFilters {
        page?: number;
        limit?: number;
        status?: 'draft' | 'published' | 'archived';
        category?: string;
        author?: string;
        featured?: boolean;
        search?: string;
        sortBy?: 'createdAt' | 'updatedAt' | 'blog_title' | 'blog_views' | 'blog_likes';
        sortOrder?: 'asc' | 'desc';
    }

    interface BlogResponse {
        success: boolean;
        message: string;
        data: Blog[];
        pagination: {
            currentPage: number;
            totalPages: number;
            totalItems: number;
            itemsPerPage: number;
            hasNextPage: boolean;
            hasPrevPage: boolean;
        };
    }

    interface BlogSingleResponse {
        success: boolean;
        message: string;
        data: Blog;
    }

}