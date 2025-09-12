import axiosCustomize from "@/services/axios.customize"

/**
 * Lấy danh sách thông tin công ty với phân trang và tìm kiếm
 */
export const fetchCompanyInfosAPIs = async (params?: CompanyInfoQueryParams): Promise<CompanyInfoResponse> => {
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const queryString = queryParams.toString();
    const url = queryString ? `/company-info?${queryString}` : '/company-info';

    return axiosCustomize.get(url);
}

/**
 * Lấy thông tin công ty duy nhất (single company info)
 */
export const fetchSingleCompanyInfoAPIs = async (): Promise<CompanyInfoSingleResponse> => {
    return (await axiosCustomize.get('/company-info/single')).data;
}

/**
 * Lấy thông tin chi tiết một công ty theo ID
 */
export const fetchCompanyInfoByIdAPIs = async (id: string): Promise<CompanyInfoSingleResponse> => {
    return (await axiosCustomize.get(`/company-info/${id}`)).data;
}

/**
 * Tạo mới thông tin công ty
 */
export const createCompanyInfoAPIs = async (data: CompanyInfoFormData): Promise<CompanyInfoSingleResponse> => {
    return axiosCustomize.post('/company-info', data);
}

/**
 * Cập nhật thông tin công ty
 */
export const updateCompanyInfoAPIs = async (id: string, data: CompanyInfoUpdateData): Promise<CompanyInfoSingleResponse> => {
    return axiosCustomize.put(`/company-info/${id}`, data);
}

/**
 * Xóa thông tin công ty
 */
export const deleteCompanyInfoAPIs = async (id: string): Promise<{ success: boolean; message: string; data: { deletedId: string } }> => {
    return axiosCustomize.delete(`/company-info/${id}`);
}

/**
 * Lấy thống kê tổng quan về company info
 */
export const fetchCompanyInfoStatsAPIs = async (): Promise<CompanyInfoStatsResponse> => {
    return axiosCustomize.get('/company-info/stats');
}

/**
 * Cập nhật trạng thái social media của công ty
 */
export const updateSocialMediaStatusAPIs = async (
    id: string,
    data: SocialMediaStatusUpdate
): Promise<CompanyInfoSingleResponse> => {
    return (await (axiosCustomize.patch(`/company-info/${id}/social-status`, data))).data;
}

/**
 * Tìm kiếm công ty theo từ khóa
 */
export const searchCompanyInfosAPIs = async (
    searchQuery: string,
    params?: Omit<CompanyInfoQueryParams, 'search'>
): Promise<CompanyInfoResponse> => {
    const queryParams = new URLSearchParams();

    queryParams.append('q', searchQuery);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    return axiosCustomize.get(`/company-info/search?${queryParams.toString()}`);
}

/**
 * Validate company info data before sending
 */
export const validateCompanyInfoData = (data: Partial<CompanyInfoFormData>): string[] => {
    const errors: string[] = [];

    if (data.company_name && data.company_name.trim().length < 2) {
        errors.push('Tên công ty phải có ít nhất 2 ký tự');
    }

    if (data.company_description && data.company_description.trim().length < 10) {
        errors.push('Mô tả công ty phải có ít nhất 10 ký tự');
    }

    if (data.company_address && data.company_address.trim().length < 10) {
        errors.push('Địa chỉ công ty phải có ít nhất 10 ký tự');
    }

    if (data.company_phone && !/^[0-9+\-\s()]{10,15}$/.test(data.company_phone)) {
        errors.push('Số điện thoại không hợp lệ');
    }

    if (data.company_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.company_email)) {
        errors.push('Email không hợp lệ');
    }

    return errors;
}

/**
 * Helper function to validate URL
 */
export const isValidUrl = (url: string): boolean => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

/**
 * Format company info data for display
 */
export const formatCompanyInfoForDisplay = (companyInfo: CompanyInfo) => {
    return {
        ...companyInfo,
        createdAt: new Date(companyInfo.createdAt).toLocaleDateString('vi-VN'),
        updatedAt: new Date(companyInfo.updatedAt).toLocaleDateString('vi-VN'),
        socialMediaCount: [
            companyInfo.company_facebook,
            companyInfo.company_instagram,
            companyInfo.company_youtube,
            companyInfo.company_tiktok,
            companyInfo.company_twitter,
            companyInfo.company_linkedin,
            companyInfo.company_shopee,
            companyInfo.company_zalo
        ].filter(social => social.isActive).length
    };
}

/**
 * Get social media platform config
 */
export const getSocialMediaConfig = (platform: string) => {
    const configs = {
        facebook: { color: '#1877F2', icon: "/icon/facebook.png", name: 'Facebook' },
        instagram: { color: '#E4405F', icon: "/icon/instagram.png", name: 'Instagram' },
        youtube: { color: '#FF0000', icon: "/icon/youtube.png", name: 'YouTube' },
        tiktok: { color: '#000000', icon: "/icon/tik-tok.png", name: 'TikTok' },
        twitter: { color: '#1DA1F2', icon: "/icon/twitter.png", name: 'Twitter' },
        linkedin: { color: '#0A66C2', icon: "/icon/linkedin.png", name: 'LinkedIn' },
        shopee: { color: '#EE4D2D', icon: "/icon/shopee.png", name: 'Shopee' },
        zalo: { color: '#0068FF', icon: "/images/icon/zalo-icon.svg", name: 'Zalo' }
    };

    return configs[platform as keyof typeof configs] || { color: '#666666', icon: '🌐', name: platform };
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};
