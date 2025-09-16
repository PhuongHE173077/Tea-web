// Customer Management Types và Interfaces

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
    order_statuses?: string[] // Array of all order statuses for this customer
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

// Constants for sorting options
export const CUSTOMER_SORT_OPTIONS = {
    TOTAL_SPENT: 'total_spent',
    TOTAL_ORDERS: 'total_orders',
    LAST_ORDER_DATE: 'last_order_date',
    CUSTOMER_NAME: 'customer_name'
} as const

export const CUSTOMER_SORT_LABELS = {
    [CUSTOMER_SORT_OPTIONS.TOTAL_SPENT]: 'Tổng chi tiêu',
    [CUSTOMER_SORT_OPTIONS.TOTAL_ORDERS]: 'Số đơn hàng',
    [CUSTOMER_SORT_OPTIONS.LAST_ORDER_DATE]: 'Đơn hàng gần nhất',
    [CUSTOMER_SORT_OPTIONS.CUSTOMER_NAME]: 'Tên khách hàng'
} as const

// Customer statistics interface for summary cards
export interface CustomerStats {
    total_customers: number
    total_revenue: number
    average_order_value: number
    repeat_customers: number
}
