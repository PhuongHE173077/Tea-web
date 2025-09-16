import express from 'express'
import { shipController } from '~/controllers/ship.controller'
import { authMiddlewares } from '~/middlewares/authMiddlewares'
import { adminMiddlewares } from '~/middlewares/adminMiddlewares'
import { shipValidation } from '~/validations/ship.validation'

const router = express.Router()

// Public routes - không cần authentication
/**
 * @route GET /api/v1/ship/active
 * @desc Lấy cấu hình ship đang active (public)
 * @access Public
 */
router.get('/active', shipController.getActiveShipConfig)

/**
 * @route POST /api/v1/ship/calculate-fee
 * @desc Tính phí ship cho đơn hàng (public)
 * @access Public
 * @body { orderValue: number }
 */
router.post('/calculate-fee',
    shipValidation.calculateShippingFee,
    shipController.calculateShippingFee
)

// Protected routes - cần authentication và admin privileges
router.use(authMiddlewares.isAuthorized)
router.use(adminMiddlewares.isAdminSimple)

/**
 * @route GET /api/v1/ship
 * @desc Lấy danh sách tất cả cấu hình ship (có phân trang)
 * @access Private (Admin only)
 * @query { page?, limit?, isActive?, search?, sort_by?, sort_order? }
 */
router.get('/',
    shipValidation.getShipConfigs,
    shipController.getShipConfigs
)

/**
 * @route POST /api/v1/ship
 * @desc Tạo cấu hình ship mới
 * @access Private (Admin only)
 * @body { freeShippingThreshold: number, shippingFee: number, isActive?: boolean, description?: string }
 */
router.post('/',
    shipValidation.createShipConfig,
    shipController.createShipConfig
)

/**
 * @route GET /api/v1/ship/:id
 * @desc Lấy chi tiết cấu hình ship theo ID
 * @access Private (Admin only)
 * @param {string} id - Ship configuration ID
 */
router.get('/:id',
    shipValidation.validateObjectId,
    shipController.getShipConfigById
)

/**
 * @route PUT /api/v1/ship/:id
 * @desc Cập nhật cấu hình ship
 * @access Private (Admin only)
 * @param {string} id - Ship configuration ID
 * @body { freeShippingThreshold?, shippingFee?, isActive?, description? }
 */
router.put('/:id',
    shipValidation.validateObjectId,
    shipValidation.updateShipConfig,
    shipController.updateShipConfig
)

/**
 * @route DELETE /api/v1/ship/:id
 * @desc Xóa cấu hình ship
 * @access Private (Admin only)
 * @param {string} id - Ship configuration ID
 */
router.delete('/:id',
    shipValidation.validateObjectId,
    shipController.deleteShipConfig
)

/**
 * @route PATCH /api/v1/ship/:id/toggle-status
 * @desc Bật/tắt trạng thái cấu hình ship
 * @access Private (Admin only)
 * @param {string} id - Ship configuration ID
 * @body { isActive: boolean }
 */
router.patch('/:id/toggle-status',
    shipValidation.validateObjectId,
    shipController.toggleShipConfigStatus
)

export const shipRoutes = router
