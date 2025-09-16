// Order Management Types và Interfaces

export interface OrderItem {
    product_id: string
    product_name: string
    product_slug: string
    product_image: string
    product_price: number
    quantity: number
    total_price: number
    product_attribute?: {
        name: string
        unit: string
        price: number
    }
}

export interface OrderCustomer {
    name: string
    phone: string
    email: string
    address: string
    note?: string
}

export interface OrderShipping {
    province: {
        code: string
        name: string
    }
    district: {
        code: string
        name: string
    }
    ward: {
        code: string
        name: string
    }
    street: string
    full_address: string
}

export interface OrderPayment {
    method: 'cod' | 'bank_transfer' | 'momo' | 'vnpay'
    status: 'pending' | 'paid' | 'failed' | 'refunded'
}

export interface OrderCheckout {
    subtotal: number
    shipping_fee: number
    discount_amount: number
    total: number
}

export interface Order {
    _id: string
    order_userId?: string | null
    order_trackingNumber: string
    order_status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
    order_products?: OrderItem[]
    order_customer?: OrderCustomer
    order_shipping?: OrderShipping
    order_payment?: OrderPayment
    order_checkout?: OrderCheckout
    order_discount?: {
        discount_id: string | null
        discount_code: string
        discount_name: string
        discount_type: string | null
        discount_value: number
    }
    order_notes?: string
    status_history?: Array<{
        status: string
        timestamp: string
        note?: string
    }>
    estimated_delivery?: string | null
    actual_delivery?: string | null
    createdAt: string
    updatedAt?: string
    __v?: number
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

export interface OrderResponse {
    success: boolean
    message: string
    data: Order[]
    pagination: {
        current_page: number
        total_pages: number
        total_orders: number
        has_next: boolean
        has_prev: boolean
    }
}

export interface OrderSingleResponse {
    success: boolean
    message: string
    data: Order
}

export interface OrderStatusUpdate {
    status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
    note?: string
}

// Constants cho trạng thái đơn hàng - Đồng bộ với backend
export const ORDER_STATUS = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    PROCESSING: 'processing',
    SHIPPED: 'shipped',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled'
} as const

export const ORDER_STATUS_LABELS = {
    [ORDER_STATUS.PENDING]: 'Chờ xác nhận',
    [ORDER_STATUS.CONFIRMED]: 'Đã xác nhận',
    [ORDER_STATUS.PROCESSING]: 'Đang xử lý',
    [ORDER_STATUS.SHIPPED]: 'Đã gửi hàng',
    [ORDER_STATUS.DELIVERED]: 'Đã giao',
    [ORDER_STATUS.CANCELLED]: 'Đã hủy'
} as const

export const ORDER_STATUS_COLORS = {
    [ORDER_STATUS.PENDING]: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    [ORDER_STATUS.CONFIRMED]: 'bg-blue-100 text-blue-800 border-blue-200',
    [ORDER_STATUS.PROCESSING]: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    [ORDER_STATUS.SHIPPED]: 'bg-purple-100 text-purple-800 border-purple-200',
    [ORDER_STATUS.DELIVERED]: 'bg-green-100 text-green-800 border-green-200',
    [ORDER_STATUS.CANCELLED]: 'bg-red-100 text-red-800 border-red-200'
} as const

// Constants cho phương thức thanh toán
export const PAYMENT_METHOD_LABELS = {
    cod: 'Thanh toán khi nhận hàng',
    bank_transfer: 'Chuyển khoản ngân hàng',
    momo: 'Ví MoMo',
    vnpay: 'VNPay'
} as const

export const PAYMENT_STATUS_LABELS = {
    pending: 'Chờ thanh toán',
    paid: 'Đã thanh toán',
    failed: 'Thanh toán thất bại',
    refunded: 'Đã hoàn tiền'
} as const

export const PAYMENT_STATUS_COLORS = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    paid: 'bg-green-100 text-green-800 border-green-200',
    failed: 'bg-red-100 text-red-800 border-red-200',
    refunded: 'bg-gray-100 text-gray-800 border-gray-200'
} as const
