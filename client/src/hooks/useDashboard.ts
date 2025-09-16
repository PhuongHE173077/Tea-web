import { useState, useEffect, useCallback, useRef } from 'react'
import { 
  dashboardAPIs, 
  DashboardStats, 
  RevenueData, 
  UserGrowthData, 
  ProductCategoryData, 
  RecentOrder,
  DashboardFilters 
} from '@/apis/dashboard.apis'

interface UseDashboardReturn {
  // Data states
  stats: DashboardStats | null
  revenueData: RevenueData[]
  userGrowthData: UserGrowthData[]
  productCategoryData: ProductCategoryData[]
  recentOrders: RecentOrder[]
  
  // Loading states
  isLoadingStats: boolean
  isLoadingCharts: boolean
  isLoadingOrders: boolean
  
  // Error states
  statsError: string | null
  chartsError: string | null
  ordersError: string | null
  
  // Actions
  refreshStats: () => Promise<void>
  refreshCharts: () => Promise<void>
  refreshOrders: () => Promise<void>
  refreshAll: () => Promise<void>
  updateFilters: (filters: DashboardFilters) => void
  
  // Current filters
  filters: DashboardFilters
}

export const useDashboard = (initialFilters?: DashboardFilters): UseDashboardReturn => {
  // Mock data - sẽ được thay thế bằng API calls khi backend sẵn sàng
  const mockStats: DashboardStats = {
    totalRevenue: 95000000,
    totalOrders: 275,
    totalUsers: 3750,
    totalProducts: 156,
    revenueGrowth: 12.5,
    ordersGrowth: 8.3,
    usersGrowth: 15.2,
    productsGrowth: 5.1
  }

  const mockRevenueData: RevenueData[] = [
    { month: 'T1', revenue: 45000000, orders: 120 },
    { month: 'T2', revenue: 52000000, orders: 145 },
    { month: 'T3', revenue: 48000000, orders: 132 },
    { month: 'T4', revenue: 61000000, orders: 168 },
    { month: 'T5', revenue: 55000000, orders: 155 },
    { month: 'T6', revenue: 67000000, orders: 189 },
    { month: 'T7', revenue: 72000000, orders: 201 },
    { month: 'T8', revenue: 69000000, orders: 195 },
    { month: 'T9', revenue: 78000000, orders: 220 },
    { month: 'T10', revenue: 82000000, orders: 235 },
    { month: 'T11', revenue: 89000000, orders: 258 },
    { month: 'T12', revenue: 95000000, orders: 275 }
  ]

  const mockUserGrowthData: UserGrowthData[] = [
    { month: 'T1', users: 1200, newUsers: 150 },
    { month: 'T2', users: 1380, newUsers: 180 },
    { month: 'T3', users: 1520, newUsers: 140 },
    { month: 'T4', users: 1720, newUsers: 200 },
    { month: 'T5', users: 1890, newUsers: 170 },
    { month: 'T6', users: 2100, newUsers: 210 },
    { month: 'T7', users: 2350, newUsers: 250 },
    { month: 'T8', users: 2580, newUsers: 230 },
    { month: 'T9', users: 2850, newUsers: 270 },
    { month: 'T10', users: 3120, newUsers: 270 },
    { month: 'T11', users: 3420, newUsers: 300 },
    { month: 'T12', users: 3750, newUsers: 330 }
  ]

  const mockProductCategoryData: ProductCategoryData[] = [
    { name: 'Trà xanh', value: 35, color: '#22c55e' },
    { name: 'Trà đen', value: 28, color: '#3b82f6' },
    { name: 'Trà oolong', value: 20, color: '#f59e0b' },
    { name: 'Trà thảo mộc', value: 12, color: '#ef4444' },
    { name: 'Khác', value: 5, color: '#8b5cf6' }
  ]

  const mockRecentOrders: RecentOrder[] = [
    { id: 'ORD001', customer: 'Nguyễn Văn A', amount: 450000, status: 'delivered', date: '2024-01-15' },
    { id: 'ORD002', customer: 'Trần Thị B', amount: 320000, status: 'processing', date: '2024-01-15' },
    { id: 'ORD003', customer: 'Lê Văn C', amount: 680000, status: 'shipped', date: '2024-01-14' },
    { id: 'ORD004', customer: 'Phạm Thị D', amount: 290000, status: 'pending', date: '2024-01-14' },
    { id: 'ORD005', customer: 'Hoàng Văn E', amount: 520000, status: 'confirmed', date: '2024-01-13' }
  ]

  // States - khởi tạo với mock data
  const [stats, setStats] = useState<DashboardStats | null>(mockStats)
  const [revenueData, setRevenueData] = useState<RevenueData[]>(mockRevenueData)
  const [userGrowthData, setUserGrowthData] = useState<UserGrowthData[]>(mockUserGrowthData)
  const [productCategoryData, setProductCategoryData] = useState<ProductCategoryData[]>(mockProductCategoryData)
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>(mockRecentOrders)

  // Loading states - set false vì đang dùng mock data
  const [isLoadingStats, setIsLoadingStats] = useState(false)
  const [isLoadingCharts, setIsLoadingCharts] = useState(false)
  const [isLoadingOrders, setIsLoadingOrders] = useState(false)

  // Error states
  const [statsError, setStatsError] = useState<string | null>(null)
  const [chartsError, setChartsError] = useState<string | null>(null)
  const [ordersError, setOrdersError] = useState<string | null>(null)

  // Filters
  const [filters, setFilters] = useState<DashboardFilters>(
    initialFilters || { period: 'month' }
  )

  // Refs for debouncing
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isInitialLoadRef = useRef(true)

  // Fetch dashboard stats - kết nối với API thực
  const refreshStats = useCallback(async () => {
    console.log('🔄 refreshStats called with filters:', filters)
    setIsLoadingStats(true)
    setStatsError(null)

    try {
      const response = await dashboardAPIs.getDashboardStats(filters)
      setStats(response.data.data)
    } catch (error: any) {
      setStatsError(error.message || 'Không thể tải thống kê dashboard')
      console.error('Error fetching dashboard stats:', error)
      // Fallback to mock data if API fails
      setStats(mockStats)
    } finally {
      setIsLoadingStats(false)
    }
  }, [filters])

  // Fetch chart data - kết nối với API thực
  const refreshCharts = useCallback(async () => {
    console.log('📊 refreshCharts called with filters:', filters)
    setIsLoadingCharts(true)
    setChartsError(null)

    try {
      const [revenueResponse, userGrowthResponse, productCategoryResponse] = await Promise.all([
        dashboardAPIs.getRevenueChartData(filters),
        dashboardAPIs.getUserGrowthChartData(filters),
        dashboardAPIs.getProductCategoryChartData(filters)
      ])

      setRevenueData(revenueResponse.data.data)
      setUserGrowthData(userGrowthResponse.data.data)
      setProductCategoryData(productCategoryResponse.data.data)
    } catch (error: any) {
      setChartsError(error.message || 'Không thể tải dữ liệu biểu đồ')
      console.error('Error fetching chart data:', error)
      // Fallback to mock data if API fails
      setRevenueData(mockRevenueData)
      setUserGrowthData(mockUserGrowthData)
      setProductCategoryData(mockProductCategoryData)
    } finally {
      setIsLoadingCharts(false)
    }
  }, [filters])

  // Fetch recent orders - kết nối với API thực
  const refreshOrders = useCallback(async () => {
    setIsLoadingOrders(true)
    setOrdersError(null)

    try {
      const response = await dashboardAPIs.getRecentOrders(5)
      setRecentOrders(response.data.data)
    } catch (error: any) {
      setOrdersError(error.message || 'Không thể tải danh sách đơn hàng')
      console.error('Error fetching recent orders:', error)
      // Fallback to mock data if API fails
      setRecentOrders(mockRecentOrders)
    } finally {
      setIsLoadingOrders(false)
    }
  }, [])

  // Refresh all data
  const refreshAll = useCallback(async () => {
    await Promise.all([
      refreshStats(),
      refreshCharts(),
      refreshOrders()
    ])
  }, [refreshStats, refreshCharts, refreshOrders])

  // Update filters
  const updateFilters = useCallback((newFilters: DashboardFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }, [])

  // Initial data load - chỉ load một lần khi component mount
  useEffect(() => {
    if (isInitialLoadRef.current) {
      console.log('🚀 Initial dashboard load')
      refreshAll()
      isInitialLoadRef.current = false
    }
  }, []) // Empty dependency array để chỉ chạy một lần

  // Reload data when filters change - với debounce để tránh spam API
  useEffect(() => {
    if (!isInitialLoadRef.current) { // Không chạy trong lần load đầu tiên
      console.log('🔄 Filters changed, debouncing API calls...', filters)

      // Clear previous timeout
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }

      // Set new timeout
      debounceTimeoutRef.current = setTimeout(() => {
        console.log('⏰ Debounce timeout reached, calling APIs')
        refreshStats()
        refreshCharts()
      }, 500) // 500ms debounce
    }

    // Cleanup timeout on unmount
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }
    }
  }, [filters.period]) // Chỉ depend on filters.period để tránh infinite loop

  return {
    // Data
    stats,
    revenueData,
    userGrowthData,
    productCategoryData,
    recentOrders,
    
    // Loading states
    isLoadingStats,
    isLoadingCharts,
    isLoadingOrders,
    
    // Error states
    statsError,
    chartsError,
    ordersError,
    
    // Actions
    refreshStats,
    refreshCharts,
    refreshOrders,
    refreshAll,
    updateFilters,
    
    // Current filters
    filters
  }
}

export default useDashboard
