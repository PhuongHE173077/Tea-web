import express from 'express'
import { dashboardController } from '~/controllers/dashboard.controller'
import { authMiddlewares } from '~/middlewares/authMiddlewares'
import { adminMiddlewares } from '~/middlewares/adminMiddlewares'
import dashboardValidation from '~/validations/dashboard.validation'

const router = express.Router()

/**
 * @route GET /api/v1/dashboard/debug-orders
 * @desc Debug endpoint để kiểm tra dữ liệu orders (không cần auth)
 * @access Public (for debugging)
 */
router.get('/debug-orders',
    dashboardController.debugOrders
)

// Protected routes - cần authentication và admin privileges
router.use(authMiddlewares.isAuthorized)
router.use(adminMiddlewares.isAdminSimple)

/**
 * @route GET /api/v1/dashboard/stats
 * @desc Lấy thống kê tổng quan dashboard
 * @access Private (Admin only)
 * @query { period?, start_date?, end_date? }
 */
router.get('/stats',
    dashboardValidation.getDashboardStats,
    dashboardController.getDashboardStats
)

/**
 * @route GET /api/v1/dashboard/revenue-chart
 * @desc Lấy dữ liệu biểu đồ doanh thu
 * @access Private (Admin only)
 * @query { period?, start_date?, end_date? }
 */
router.get('/revenue-chart',
    dashboardValidation.getRevenueChartData,
    dashboardController.getRevenueChartData
)

/**
 * @route GET /api/v1/dashboard/user-growth-chart
 * @desc Lấy dữ liệu biểu đồ tăng trưởng người dùng
 * @access Private (Admin only)
 * @query { period?, start_date?, end_date? }
 */
router.get('/user-growth-chart',
    dashboardValidation.getUserGrowthChartData,
    dashboardController.getUserGrowthChartData
)

/**
 * @route GET /api/v1/dashboard/product-category-chart
 * @desc Lấy dữ liệu biểu đồ phân tích sản phẩm theo danh mục
 * @access Private (Admin only)
 * @query { period?, start_date?, end_date? }
 */
router.get('/product-category-chart',
    dashboardValidation.getProductCategoryChartData,
    dashboardController.getProductCategoryChartData
)

/**
 * @route GET /api/v1/dashboard/recent-orders
 * @desc Lấy danh sách đơn hàng gần đây
 * @access Private (Admin only)
 * @query { limit? }
 */
router.get('/recent-orders',
    dashboardValidation.getRecentOrders,
    dashboardController.getRecentOrders
)

/**
 * @route GET /api/v1/dashboard/realtime-stats
 * @desc Lấy thống kê theo thời gian thực
 * @access Private (Admin only)
 */
router.get('/realtime-stats',
    dashboardController.getRealTimeStats
)



export const dashboardRoutes = router
