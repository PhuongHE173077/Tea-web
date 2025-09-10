import express from 'express'
import { discountController } from '~/controllers/discount.controller'
import { discountValidation } from '~/validations/discount.validation'
import { authMiddlewares } from '~/middlewares/authMiddlewares'

const router = express.Router()

// Public routes - không cần authentication
router.get('/active', discountController.getActiveDiscounts)

// Routes cần authentication
router.use(authMiddlewares.isAuthorized)

// GET /api/v1/discount - Lấy danh sách tất cả discount (có phân trang)
router.get('/',
    discountValidation.getDiscounts,
    discountController.getDiscounts
)

// POST /api/v1/discount - Tạo discount mới
router.post('/',
    discountValidation.createDiscount,
    discountController.createDiscount
)

// POST /api/v1/discount/validate - Kiểm tra tính hợp lệ của mã giảm giá
router.post('/validate',
    discountValidation.validateDiscountCode,
    discountController.validateDiscountCode
)

// GET /api/v1/discount/stats - Lấy thống kê discount
router.get('/stats', discountController.getDiscountStats)

// GET /api/v1/discount/:id - Lấy thông tin chi tiết một discount
router.get('/:id',
    discountValidation.validateObjectId,
    discountController.getDiscountById
)

// PUT /api/v1/discount/:id - Cập nhật discount
router.put('/:id',
    discountValidation.validateObjectId,
    discountValidation.updateDiscount,
    discountController.updateDiscount
)

// DELETE /api/v1/discount/:id - Xóa discount
router.delete('/:id',
    discountValidation.validateObjectId,
    discountController.deleteDiscount
)

// PATCH /api/v1/discount/:id/toggle - Bật/tắt trạng thái discount
router.patch('/:id/toggle',
    discountValidation.validateObjectId,
    discountController.toggleDiscountStatus
)

// POST /api/v1/discount/use - Sử dụng discount (được gọi khi tạo order)
router.post('/use', discountController.useDiscount)

export const discountRoutes = router