import axiosCustomize from "@/services/axios.customize"

// Order interfaces
export interface CustomerInfo {
    name: string
    phone: string
    email: string
    address: string
    note?: string
}

export interface CartItemForOrder {
    id: string
    name: string
    slug: string
    image: string
    price: number
    quantity: number
    attribute?: {
        name: string
        unit: string
        price: number
    }
}

export interface AddressComponent {
    code: string
    name: string
}

export interface ShippingAddress {
    province: AddressComponent
    district: AddressComponent
    ward: AddressComponent
    street: string
    full_address: string
}

export interface CreateOrderData {
    customer_info: CustomerInfo
    cart_items: CartItemForOrder[]
    discount_code?: string
    shipping_address?: ShippingAddress
    payment_method?: 'cod' | 'bank_transfer' | 'momo' | 'vnpay'
}

export interface OrderFilters {
    page?: number
    limit?: number
    status?: string
    search?: string
    start_date?: string
    end_date?: string
    sort_by?: string
    sort_order?: 'asc' | 'desc'
}

// Tạo đơn hàng mới (public - guest checkout)
export const createOrderAPIs = async (orderData: CreateOrderData) => {
    return axiosCustomize.post("/orders", orderData)
}

// Tra cứu đơn hàng theo mã tracking (public)
export const getOrderByTrackingAPIs = async (trackingNumber: string) => {
    return axiosCustomize.get(`/orders/tracking/${trackingNumber}`)
}

// Lấy danh sách đơn hàng của user hiện tại (protected)
export const getUserOrdersAPIs = async (filters?: OrderFilters) => {
    const params = new URLSearchParams()
    
    if (filters?.page) params.append('page', filters.page.toString())
    if (filters?.limit) params.append('limit', filters.limit.toString())
    if (filters?.status) params.append('status', filters.status)
    
    const queryString = params.toString()
    return axiosCustomize.get(`/orders/my-orders${queryString ? `?${queryString}` : ''}`)
}

// Lấy chi tiết đơn hàng theo ID (protected)
export const getOrderByIdAPIs = async (orderId: string) => {
    return axiosCustomize.get(`/orders/${orderId}`)
}

// Lấy thống kê đơn hàng của user (protected)
export const getOrderStatsAPIs = async () => {
    return axiosCustomize.get("/orders/stats")
}

// Admin APIs - Lấy tất cả đơn hàng (admin only)
export const getAllOrdersAPIs = async (filters?: OrderFilters) => {
    const params = new URLSearchParams()
    
    if (filters?.page) params.append('page', filters.page.toString())
    if (filters?.limit) params.append('limit', filters.limit.toString())
    if (filters?.status) params.append('status', filters.status)
    if (filters?.search) params.append('search', filters.search)
    if (filters?.start_date) params.append('start_date', filters.start_date)
    if (filters?.end_date) params.append('end_date', filters.end_date)
    if (filters?.sort_by) params.append('sort_by', filters.sort_by)
    if (filters?.sort_order) params.append('sort_order', filters.sort_order)
    
    const queryString = params.toString()
    return axiosCustomize.get(`/orders${queryString ? `?${queryString}` : ''}`)
}

// Admin APIs - Cập nhật trạng thái đơn hàng (admin only)
export const updateOrderStatusAPIs = async (orderId: string, status: string, note?: string) => {
    return axiosCustomize.put(`/orders/${orderId}/status`, {
        status,
        note
    })
}

// Public APIs - Tra cứu đơn hàng (không cần đăng nhập)
export interface OrderTrackingRequest {
    trackingNumber?: string
    phone?: string
}

export interface OrderData {
    order_id: string
    order_trackingNumber: string
    order_status: string
    order_checkout: {
        subtotal: number
        shipping_fee: number
        discount_amount: number
        total: number
    }
    customer_info: {
        name: string
        phone: string
        email: string
        address: string
        note?: string
    }
    order_shipping: {
        province: { code: string, name: string }
        district: { code: string, name: string }
        ward: { code: string, name: string }
        street: string
        full_address: string
    }
    order_payment: {
        method: string
        status: string
    }
    order_items?: Array<{
        product_id: string
        name: string
        price: number
        quantity: number
        total: number
    }>
    createdAt: string
}

export interface OrderTrackingResponse {
    success: boolean
    message: string
    data?: {
        // Single order response (tracking number search)
        order?: OrderData
        // Multiple orders response (phone search)
        orders?: OrderData[]
        isMultiple: boolean
        total?: number
    }
}

export const trackOrderAPIs = async (data: OrderTrackingRequest) => {
    return axiosCustomize.post<OrderTrackingResponse>('/orders/track', data)
}
