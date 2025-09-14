import axiosCustomize from "@/services/axios.customize"

export const fetchCategoriesAPIs = async () => {
    return axiosCustomize.get("/categories")
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