const Order = require('~/models/order.model')
import User from '~/models/user.model'
import SPU from '~/models/spu.model'
import Category from '~/models/category.model'
import { StatusCodes } from 'http-status-codes'

/**
 * Lấy thống kê tổng quan dashboard
 * @param {Object} filters - Bộ lọc thời gian
 * @returns {Object} Thống kê tổng quan
 */
const getDashboardStats = async (filters = {}) => {
    try {
        const { period = 'month', startDate, endDate } = filters
        
        // Tính toán khoảng thời gian
        const now = new Date()
        let currentPeriodStart, previousPeriodStart, previousPeriodEnd
        
        switch (period) {
            case 'week':
                currentPeriodStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7)
                previousPeriodStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 14)
                previousPeriodEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7)
                break
            case 'quarter':
                const currentQuarter = Math.floor(now.getMonth() / 3)
                currentPeriodStart = new Date(now.getFullYear(), currentQuarter * 3, 1)
                previousPeriodStart = new Date(now.getFullYear(), (currentQuarter - 1) * 3, 1)
                previousPeriodEnd = new Date(now.getFullYear(), currentQuarter * 3, 1)
                break
            case 'year':
                currentPeriodStart = new Date(now.getFullYear(), 0, 1)
                previousPeriodStart = new Date(now.getFullYear() - 1, 0, 1)
                previousPeriodEnd = new Date(now.getFullYear(), 0, 1)
                break
            default: // month
                currentPeriodStart = new Date(now.getFullYear(), now.getMonth(), 1)
                previousPeriodStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
                previousPeriodEnd = new Date(now.getFullYear(), now.getMonth(), 1)
        }

        // Nếu có startDate và endDate custom
        if (startDate && endDate) {
            currentPeriodStart = new Date(startDate)
            const daysDiff = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24))
            previousPeriodStart = new Date(currentPeriodStart.getTime() - (daysDiff * 24 * 60 * 60 * 1000))
            previousPeriodEnd = currentPeriodStart
        }

        // Thống kê hiện tại
        const [currentStats, previousStats] = await Promise.all([
            // Current period stats
            Promise.all([
                // Total revenue - chỉ tính từ đơn hàng đã giao (delivered)
                Order.aggregate([
                    {
                        $match: {
                            createdAt: { $gte: currentPeriodStart },
                            order_status: 'delivered' // Chỉ tính đơn hàng đã giao
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            totalRevenue: { $sum: '$order_checkout.total' },
                            totalOrders: { $sum: 1 }
                        }
                    }
                ]),
                // Total users
                User.countDocuments({
                    createdAt: { $gte: currentPeriodStart },
                    usr_status: 'active'
                }),
                // Total products
                SPU.countDocuments({
                    createdAt: { $gte: currentPeriodStart },
                    isPublished: true,
                    isDeleted: false
                })
            ]),
            // Previous period stats
            Promise.all([
                // Previous revenue - chỉ tính từ đơn hàng đã giao (delivered)
                Order.aggregate([
                    {
                        $match: {
                            createdAt: { $gte: previousPeriodStart, $lt: previousPeriodEnd },
                            order_status: 'delivered' // Chỉ tính đơn hàng đã giao
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            totalRevenue: { $sum: '$order_checkout.total' },
                            totalOrders: { $sum: 1 }
                        }
                    }
                ]),
                // Previous users
                User.countDocuments({
                    createdAt: { $gte: previousPeriodStart, $lt: previousPeriodEnd },
                    usr_status: 'active'
                }),
                // Previous products
                SPU.countDocuments({
                    createdAt: { $gte: previousPeriodStart, $lt: previousPeriodEnd },
                    isPublished: true,
                    isDeleted: false
                })
            ])
        ])

        // Parse current stats
        const currentRevenue = currentStats[0][0]?.totalRevenue || 0
        const currentOrders = currentStats[0][0]?.totalOrders || 0
        const currentUsers = currentStats[1] || 0
        const currentProducts = currentStats[2] || 0

        // Parse previous stats
        const previousRevenue = previousStats[0][0]?.totalRevenue || 0
        const previousOrders = previousStats[0][0]?.totalOrders || 0
        const previousUsers = previousStats[1] || 0
        const previousProducts = previousStats[2] || 0

        // Calculate growth percentages
        const calculateGrowth = (current, previous) => {
            if (previous === 0) return current > 0 ? 100 : 0
            return Math.round(((current - previous) / previous) * 100 * 10) / 10
        }

        // Get total counts (all time) - chỉ tính từ đơn hàng đã giao
        const [totalUsers, totalProducts, totalRevenue, totalOrders] = await Promise.all([
            User.countDocuments({ usr_status: 'active' }),
            SPU.countDocuments({ isPublished: true, isDeleted: false }),
            Order.aggregate([
                {
                    $match: {
                        order_status: 'delivered' // Chỉ tính đơn hàng đã giao
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalRevenue: { $sum: '$order_checkout.total' },
                        totalOrders: { $sum: 1 }
                    }
                }
            ]).then(result => result[0] || { totalRevenue: 0, totalOrders: 0 })
        ])

        return {
            totalRevenue: totalRevenue.totalRevenue || 0,
            totalOrders: totalRevenue.totalOrders || 0,
            totalUsers: totalUsers || 0,
            totalProducts: totalProducts || 0,
            revenueGrowth: calculateGrowth(currentRevenue, previousRevenue),
            ordersGrowth: calculateGrowth(currentOrders, previousOrders),
            usersGrowth: calculateGrowth(currentUsers, previousUsers),
            productsGrowth: calculateGrowth(currentProducts, previousProducts)
        }
    } catch (error) {
        console.error('Error in getDashboardStats:', error)
        throw error
    }
}

/**
 * Lấy dữ liệu biểu đồ doanh thu theo thời gian
 * @param {Object} filters - Bộ lọc thời gian
 * @returns {Array} Dữ liệu biểu đồ doanh thu
 */
const getRevenueChartData = async (filters = {}) => {
    try {
        const { period = 'month' } = filters
        
        let groupBy, dateFormat, periods
        const now = new Date()
        
        switch (period) {
            case 'week':
                // Last 7 days
                groupBy = { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }
                periods = Array.from({ length: 7 }, (_, i) => {
                    const date = new Date(now)
                    date.setDate(date.getDate() - (6 - i))
                    return date.toISOString().split('T')[0]
                })
                break
            case 'quarter':
                // Last 3 months
                groupBy = { $dateToString: { format: "%Y-%m", date: "$createdAt" } }
                periods = Array.from({ length: 3 }, (_, i) => {
                    const date = new Date(now.getFullYear(), now.getMonth() - (2 - i), 1)
                    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
                })
                break
            case 'year':
                // Last 12 months
                groupBy = { $dateToString: { format: "%Y-%m", date: "$createdAt" } }
                periods = Array.from({ length: 12 }, (_, i) => {
                    const date = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1)
                    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
                })
                break
            default: // month
                // Last 12 months
                groupBy = { $dateToString: { format: "%Y-%m", date: "$createdAt" } }
                periods = Array.from({ length: 12 }, (_, i) => {
                    const date = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1)
                    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
                })
        }

        const revenueData = await Order.aggregate([
            {
                $match: {
                    order_status: 'delivered' // Chỉ tính doanh thu từ đơn hàng đã giao
                }
            },
            {
                $group: {
                    _id: groupBy,
                    revenue: { $sum: '$order_checkout.total' },
                    orders: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ])

        // Create complete dataset with all periods
        const result = periods.map(period => {
            const data = revenueData.find(item => item._id === period)
            let month = period
            
            if (period.includes('-')) {
                const [year, monthNum] = period.split('-')
                month = `T${parseInt(monthNum)}`
            }
            
            return {
                month,
                revenue: data?.revenue || 0,
                orders: data?.orders || 0
            }
        })

        return result
    } catch (error) {
        console.error('Error in getRevenueChartData:', error)
        throw error
    }
}

/**
 * Lấy dữ liệu biểu đồ tăng trưởng người dùng
 * @param {Object} filters - Bộ lọc thời gian
 * @returns {Array} Dữ liệu biểu đồ tăng trưởng người dùng
 */
const getUserGrowthChartData = async (filters = {}) => {
    try {
        const { period = 'month' } = filters

        let groupBy, periods
        const now = new Date()

        switch (period) {
            case 'week':
                groupBy = { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }
                periods = Array.from({ length: 7 }, (_, i) => {
                    const date = new Date(now)
                    date.setDate(date.getDate() - (6 - i))
                    return date.toISOString().split('T')[0]
                })
                break
            case 'quarter':
                groupBy = { $dateToString: { format: "%Y-%m", date: "$createdAt" } }
                periods = Array.from({ length: 3 }, (_, i) => {
                    const date = new Date(now.getFullYear(), now.getMonth() - (2 - i), 1)
                    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
                })
                break
            case 'year':
                groupBy = { $dateToString: { format: "%Y-%m", date: "$createdAt" } }
                periods = Array.from({ length: 12 }, (_, i) => {
                    const date = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1)
                    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
                })
                break
            default: // month
                groupBy = { $dateToString: { format: "%Y-%m", date: "$createdAt" } }
                periods = Array.from({ length: 12 }, (_, i) => {
                    const date = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1)
                    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
                })
        }

        // Get new users by period
        const newUsersData = await User.aggregate([
            {
                $match: {
                    usr_status: 'active'
                }
            },
            {
                $group: {
                    _id: groupBy,
                    newUsers: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ])

        // Calculate cumulative users
        let cumulativeUsers = await User.countDocuments({
            usr_status: 'active',
            createdAt: { $lt: new Date(periods[0]) }
        })

        const result = periods.map(period => {
            const newUserData = newUsersData.find(item => item._id === period)
            const newUsers = newUserData?.newUsers || 0
            cumulativeUsers += newUsers

            let month = period
            if (period.includes('-')) {
                const [year, monthNum] = period.split('-')
                month = `T${parseInt(monthNum)}`
            }

            return {
                month,
                users: cumulativeUsers,
                newUsers
            }
        })

        return result
    } catch (error) {
        console.error('Error in getUserGrowthChartData:', error)
        throw error
    }
}

/**
 * Lấy dữ liệu biểu đồ phân tích sản phẩm theo danh mục
 * @param {Object} filters - Bộ lọc thời gian
 * @returns {Array} Dữ liệu biểu đồ phân tích sản phẩm
 */
const getProductCategoryChartData = async (filters = {}) => {
    try {
        // Get product count by category
        const categoryData = await SPU.aggregate([
            {
                $match: {
                    isPublished: true,
                    isDeleted: false
                }
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'product_category',
                    foreignField: '_id',
                    as: 'category'
                }
            },
            {
                $unwind: {
                    path: '$category',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $group: {
                    _id: '$category.cate_name',
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            }
        ])

        const totalProducts = categoryData.reduce((sum, item) => sum + item.count, 0)

        // Define colors for categories
        const colors = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316']

        const result = categoryData.map((item, index) => ({
            name: item._id || 'Chưa phân loại',
            value: Math.round((item.count / totalProducts) * 100 * 10) / 10,
            color: colors[index % colors.length]
        }))

        return result
    } catch (error) {
        console.error('Error in getProductCategoryChartData:', error)
        throw error
    }
}

/**
 * Lấy danh sách đơn hàng gần đây
 * @param {number} limit - Số lượng đơn hàng cần lấy
 * @returns {Array} Danh sách đơn hàng gần đây
 */
const getRecentOrders = async (limit = 5) => {
    try {
        const orders = await Order.find({})
            .sort({ createdAt: -1 })
            .limit(limit)
            .select('order_trackingNumber order_customer order_checkout order_status createdAt')
            .lean()

        console.log('📦 Recent Orders raw data:', orders.map(o => ({
            id: o.order_trackingNumber,
            checkout: o.order_checkout,
            customer: o.order_customer
        })))

        return orders.map(order => ({
            id: order.order_trackingNumber,
            customer: order.order_customer?.name || 'Khách hàng',
            amount: order.order_checkout?.total || 0, // Sửa từ totalPrice thành total
            status: order.order_status,
            date: order.createdAt
        }))
    } catch (error) {
        console.error('Error in getRecentOrders:', error)
        throw error
    }
}

export const dashboardService = {
    getDashboardStats,
    getRevenueChartData,
    getUserGrowthChartData,
    getProductCategoryChartData,
    getRecentOrders
}
