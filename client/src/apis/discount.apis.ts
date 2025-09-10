import axiosCustomize from "@/services/axios.customize"

// Lấy danh sách discount với phân trang và filter
export const fetchDiscountsAPIs = async (filters?: DiscountFilters) => {
    const params = new URLSearchParams()
    
    if (filters?.page) params.append('page', filters.page.toString())
    if (filters?.limit) params.append('limit', filters.limit.toString())
    if (filters?.is_active !== undefined) params.append('is_active', filters.is_active.toString())
    if (filters?.discount_type) params.append('discount_type', filters.discount_type)
    if (filters?.search) params.append('search', filters.search)
    if (filters?.sort_by) params.append('sort_by', filters.sort_by)
    if (filters?.sort_order) params.append('sort_order', filters.sort_order)
    
    const queryString = params.toString()
    return axiosCustomize.get(`/discount${queryString ? `?${queryString}` : ''}`)
}

// Lấy chi tiết discount theo ID
export const fetchDiscountByIdAPIs = async (id: string) => {
    return axiosCustomize.get(`/discount/${id}`)
}

// Tạo discount mới
export const createDiscountAPIs = async (discountData: DiscountFormData) => {
    return axiosCustomize.post("/discount", discountData)
}

// Cập nhật discount
export const updateDiscountAPIs = async (id: string, discountData: Partial<DiscountFormData>) => {
    return axiosCustomize.put(`/discount/${id}`, discountData)
}

// Xóa discount
export const deleteDiscountAPIs = async (id: string) => {
    return axiosCustomize.delete(`/discount/${id}`)
}

// Bật/tắt trạng thái discount
export const toggleDiscountStatusAPIs = async (id: string, is_active: boolean) => {
    return axiosCustomize.patch(`/discount/${id}/toggle`, { is_active })
}

// Lấy danh sách discount đang hoạt động (public)
export const fetchActiveDiscountsAPIs = async () => {
    return axiosCustomize.get("/discount/active")
}

// Kiểm tra tính hợp lệ của mã giảm giá
export const validateDiscountCodeAPIs = async (code: string, order_value: number, user_id?: string) => {
    return axiosCustomize.post("/discount/validate", {
        code,
        order_value,
        user_id
    })
}

// Lấy thống kê discount
export const fetchDiscountStatsAPIs = async () => {
    return axiosCustomize.get("/discount/stats")
}

// Sử dụng discount (khi tạo order)
export const useDiscountAPIs = async (discount_id: string, order_id: string) => {
    return axiosCustomize.post("/discount/use", {
        discount_id,
        order_id
    })
}
