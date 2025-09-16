import axiosCustomize from "@/services/axios.customize"

export const fetchCategoriesAPIs = async () => {
    return axiosCustomize.get("/categories")
}

// Get all categories with filters
export const getAllCategories = async (filters?: { status?: string; page?: number; limit?: number }): Promise<{ data: Category[] }> => {
    const params = new URLSearchParams();

    if (filters?.status) params.append('status', filters.status);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const url = `/categories?${params.toString()}`;
    console.log('Categories API URL:', url);
    const response = await axiosCustomize.get(url);
    console.log('Categories API Response:', response);
    console.log('Categories API Response.data:', response.data);
    return response.data;
}

export const fetchCategoryBySlugAPIs = async (slug: string) => {
    return axiosCustomize.get(`/categories/slug/${slug}`)
}

export const createCategoryAPIs = async (categoryData: {
    category_name: string;
    category_description: string;
    category_icon?: string;
    category_image?: {
        url?: string;
        isActive?: boolean;
    };
    status?: "active" | "inactive";
}) => {
    return axiosCustomize.post("/categories", categoryData)
}

export const updateCategoryAPIs = async (id: string, categoryData: {
    category_name?: string;
    category_description?: string;
    category_icon?: string;
    category_image?: {
        url?: string;
        isActive?: boolean;
    };
    status?: "active" | "inactive";
}) => {
    return axiosCustomize.post(`/categories/${id}`, categoryData)
}

export const deleteCategoryAPIs = async (id: string) => {
    return axiosCustomize.delete(`/categories/${id}`)
}

// Upload image APIs
export const uploadImageAPI = async (file: File) => {
    const formData = new FormData()
    formData.append('image', file)

    return axiosCustomize.post('/images/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}