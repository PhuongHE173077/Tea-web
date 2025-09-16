import axiosCustomize from "@/services/axios.customize"

// Dashboard statistics interfaces
export interface DashboardStats {
  totalRevenue: number
  totalOrders: number
  totalUsers: number
  totalProducts: number
  revenueGrowth: number
  ordersGrowth: number
  usersGrowth: number
  productsGrowth: number
}

export interface RevenueData {
  month: string
  revenue: number
  orders: number
}

export interface UserGrowthData {
  month: string
  users: number
  newUsers: number
}

export interface ProductCategoryData {
  name: string
  value: number
  color: string
}

export interface RecentOrder {
  id: string
  customer: string
  amount: number
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  date: string
}

export interface DashboardFilters {
  period?: 'week' | 'month' | 'quarter' | 'year'
  startDate?: string
  endDate?: string
}

// API functions

// Lấy thống kê tổng quan dashboard
export const getDashboardStatsAPIs = async (filters?: DashboardFilters) => {
  const params = new URLSearchParams()
  if (filters?.period) params.append('period', filters.period)
  if (filters?.startDate) params.append('start_date', filters.startDate)
  if (filters?.endDate) params.append('end_date', filters.endDate)
  
  return axiosCustomize.get(`/dashboard/stats?${params.toString()}`)
}

// Lấy dữ liệu biểu đồ doanh thu
export const getRevenueChartDataAPIs = async (filters?: DashboardFilters) => {
  const params = new URLSearchParams()
  if (filters?.period) params.append('period', filters.period)
  if (filters?.startDate) params.append('start_date', filters.startDate)
  if (filters?.endDate) params.append('end_date', filters.endDate)
  
  return axiosCustomize.get(`/dashboard/revenue-chart?${params.toString()}`)
}

// Lấy dữ liệu biểu đồ tăng trưởng người dùng
export const getUserGrowthChartDataAPIs = async (filters?: DashboardFilters) => {
  const params = new URLSearchParams()
  if (filters?.period) params.append('period', filters.period)
  if (filters?.startDate) params.append('start_date', filters.startDate)
  if (filters?.endDate) params.append('end_date', filters.endDate)
  
  return axiosCustomize.get(`/dashboard/user-growth-chart?${params.toString()}`)
}

// Lấy dữ liệu biểu đồ phân tích sản phẩm theo danh mục
export const getProductCategoryChartDataAPIs = async (filters?: DashboardFilters) => {
  const params = new URLSearchParams()
  if (filters?.period) params.append('period', filters.period)
  if (filters?.startDate) params.append('start_date', filters.startDate)
  if (filters?.endDate) params.append('end_date', filters.endDate)
  
  return axiosCustomize.get(`/dashboard/product-category-chart?${params.toString()}`)
}

// Lấy danh sách đơn hàng gần đây
export const getRecentOrdersAPIs = async (limit: number = 5) => {
  return axiosCustomize.get(`/dashboard/recent-orders?limit=${limit}`)
}

// Lấy thống kê khách hàng hàng đầu
export const getTopCustomersAPIs = async (limit: number = 10) => {
  return axiosCustomize.get(`/dashboard/top-customers?limit=${limit}`)
}

// Lấy thống kê sản phẩm bán chạy
export const getTopProductsAPIs = async (limit: number = 10) => {
  return axiosCustomize.get(`/dashboard/top-products?limit=${limit}`)
}

// Lấy thống kê tổng quan theo thời gian thực
export const getRealTimeStatsAPIs = async () => {
  return axiosCustomize.get('/dashboard/realtime-stats')
}

// Export tất cả để sử dụng
export const dashboardAPIs = {
  getDashboardStats: getDashboardStatsAPIs,
  getRevenueChartData: getRevenueChartDataAPIs,
  getUserGrowthChartData: getUserGrowthChartDataAPIs,
  getProductCategoryChartData: getProductCategoryChartDataAPIs,
  getRecentOrders: getRecentOrdersAPIs,
  getTopCustomers: getTopCustomersAPIs,
  getTopProducts: getTopProductsAPIs,
  getRealTimeStats: getRealTimeStatsAPIs
}
