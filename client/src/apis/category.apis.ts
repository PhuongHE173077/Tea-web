import axiosCustomize from "@/services/axios.customize"

export const fetchCategoriesAPIs = async () => {
    return axiosCustomize.get("/categories")
}

export const createCategoryAPIs = async (categoryData: { category_name: string; category_description: string }) => {
    return axiosCustomize.post("/categories", categoryData)
}

export const updateCategoryAPIs = async (id: string, categoryData: { category_name?: string; category_description?: string, status?: "active" | "inactive" }) => {
    return axiosCustomize.post(`/categories/${id}`, categoryData)
}

export const deleteCategoryAPIs = async (id: string) => {
    return axiosCustomize.delete(`/categories/${id}`)
}