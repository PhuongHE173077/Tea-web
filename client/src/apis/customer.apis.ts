import axiosCustomize from "@/services/axios.customize"

// Customer interfaces
export interface Customer {
    _id: string // phone number used as ID
    customer_name: string
    customer_phone: string
    customer_email: string
    customer_address: string
    total_orders: number
    total_spent: number
    average_order_value: number
    completed_orders: number
    last_order_date: string
    first_order_date: string
}

export interface CustomerFilters {
    page?: number
    limit?: number
    search?: string
    sort_by?: 'total_spent' | 'total_orders' | 'last_order_date' | 'customer_name'
    sort_order?: 'asc' | 'desc'
}

export interface CustomerResponse {
    success: boolean
    message: string
    data: Customer[]
    pagination: {
        current_page: number
        total_pages: number
        total_customers: number
        has_next: boolean
        has_prev: boolean
        limit: number
    }
}

// Admin API - Lấy danh sách khách hàng với thống kê chi tiêu (admin only)
export const getCustomersAPIs = async (filters?: CustomerFilters) => {
    const params = new URLSearchParams()
    
    if (filters?.page) params.append('page', filters.page.toString())
    if (filters?.limit) params.append('limit', filters.limit.toString())
    if (filters?.search) params.append('search', filters.search)
    if (filters?.sort_by) params.append('sort_by', filters.sort_by)
    if (filters?.sort_order) params.append('sort_order', filters.sort_order)
    
    const queryString = params.toString()
    return axiosCustomize.get(`/orders/customers${queryString ? `?${queryString}` : ''}`)
}
