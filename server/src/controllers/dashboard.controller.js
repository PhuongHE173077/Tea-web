import { StatusCodes } from 'http-status-codes'
import { dashboardService } from '~/services/dashboard.service'

/**
 * Lấy thống kê tổng quan dashboard
 * GET /api/v1/dashboard/stats
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware
 */
const getDashboardStats = async (req, res, next) => {
    try {

        const filters = {
            period: req.query.period || 'month',
            startDate: req.query.start_date,
            endDate: req.query.end_date
        }


        const stats = await dashboardService.getDashboardStats(filters)


        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Dashboard statistics retrieved successfully',
            data: stats
        })
    } catch (error) {
        console.error('🔍 Dashboard Stats Controller - Error:', error)
        next(error)
    }
}

/**
 * Lấy dữ liệu biểu đồ doanh thu
 * GET /api/v1/dashboard/revenue-chart
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware
 */
const getRevenueChartData = async (req, res, next) => {
    try {

        const filters = {
            period: req.query.period || 'month',
            startDate: req.query.start_date,
            endDate: req.query.end_date
        }

        const chartData = await dashboardService.getRevenueChartData(filters)


        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Revenue chart data retrieved successfully',
            data: chartData
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Lấy dữ liệu biểu đồ tăng trưởng người dùng
 * GET /api/v1/dashboard/user-growth-chart
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware
 */
const getUserGrowthChartData = async (req, res, next) => {
    try {

        const filters = {
            period: req.query.period || 'month',
            startDate: req.query.start_date,
            endDate: req.query.end_date
        }

        const chartData = await dashboardService.getUserGrowthChartData(filters)


        res.status(StatusCodes.OK).json({
            success: true,
            message: 'User growth chart data retrieved successfully',
            data: chartData
        })
    } catch (error) {
        console.error('👥 User Growth Chart Controller - Error:', error)
        next(error)
    }
}

/**
 * Lấy dữ liệu biểu đồ phân tích sản phẩm theo danh mục
 * GET /api/v1/dashboard/product-category-chart
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware
 */
const getProductCategoryChartData = async (req, res, next) => {
    try {

        const filters = {
            period: req.query.period || 'month',
            startDate: req.query.start_date,
            endDate: req.query.end_date
        }

        const chartData = await dashboardService.getProductCategoryChartData(filters)


        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Product category chart data retrieved successfully',
            data: chartData
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Lấy danh sách đơn hàng gần đây
 * GET /api/v1/dashboard/recent-orders
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware
 */
const getRecentOrders = async (req, res, next) => {
    try {
        console.log('📦 Recent Orders Controller - Query params:', req.query)

        const limit = parseInt(req.query.limit) || 5

        const orders = await dashboardService.getRecentOrders(limit)

        console.log('📦 Recent Orders Controller - Orders count:', orders.length)

        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Recent orders retrieved successfully',
            data: orders
        })
    } catch (error) {
        console.error('📦 Recent Orders Controller - Error:', error)
        next(error)
    }
}

/**
 * Lấy thống kê theo thời gian thực (real-time)
 * GET /api/v1/dashboard/realtime-stats
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware
 */
const getRealTimeStats = async (req, res, next) => {
    try {

        // Get today's stats
        const todayStats = await dashboardService.getDashboardStats({
            period: 'week',
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date().toISOString().split('T')[0]
        })

        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Real-time statistics retrieved successfully',
            data: {
                ...todayStats,
                lastUpdated: new Date().toISOString()
            }
        })
    } catch (error) {
        console.error('⚡ Real-time Stats Controller - Error:', error)
        next(error)
    }
}

/**
 * Debug endpoint để kiểm tra dữ liệu orders
 * GET /api/v1/dashboard/debug-orders
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware
 */
const debugOrders = async (req, res, next) => {
    try {
        console.log('🐛 Debug Orders Controller')

        const Order = require('~/models/order.model')

        // Get sample orders
        const orders = await Order.find({})
            .limit(3)
            .select('order_trackingNumber order_customer order_checkout order_status createdAt')
            .lean()

        console.log('🐛 Sample orders from DB:', JSON.stringify(orders, null, 2))

        // Get total count
        const totalOrders = await Order.countDocuments({})

        // Get revenue stats - chỉ từ đơn hàng delivered
        const revenueStats = await Order.aggregate([
            {
                $match: {
                    order_status: 'delivered' // Chỉ tính đơn hàng đã giao
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$order_checkout.total' },
                    totalOrders: { $sum: 1 },
                    avgOrderValue: { $avg: '$order_checkout.total' }
                }
            }
        ])

        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Debug data retrieved successfully',
            data: {
                totalOrdersInDB: totalOrders,
                sampleOrders: orders,
                revenueStats: revenueStats[0] || { totalRevenue: 0, totalOrders: 0, avgOrderValue: 0 }
            }
        })
    } catch (error) {
        console.error('🐛 Debug Orders Controller - Error:', error)
        next(error)
    }
}

export const dashboardController = {
    getDashboardStats,
    getRevenueChartData,
    getUserGrowthChartData,
    getProductCategoryChartData,
    getRecentOrders,
    getRealTimeStats,
    debugOrders
}
