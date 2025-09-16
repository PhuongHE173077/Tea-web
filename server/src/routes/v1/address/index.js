import express from 'express'
import { addressController } from '~/controllers/address.controller'
import { adminMiddlewares } from '~/middlewares/adminMiddlewares'

const router = express.Router()

// Public routes - không cần authentication

/**
 * @route GET /api/v1/address/provinces
 * @desc Lấy danh sách tất cả tỉnh/thành phố
 * @access Public
 * @query { search?, is_active? }
 */
router.get('/provinces',
    addressController.getAllProvinces
)

/**
 * @route GET /api/v1/address/provinces/:code
 * @desc Lấy thông tin tỉnh/thành phố theo code
 * @access Public
 * @params { code }
 */
router.get('/provinces/:code',
    addressController.getProvinceByCode
)

/**
 * @route GET /api/v1/address/provinces/:province_code/districts
 * @desc Lấy danh sách quận/huyện theo tỉnh/thành phố
 * @access Public
 * @params { province_code }
 * @query { search? }
 */
router.get('/provinces/:province_code/districts',
    addressController.getDistrictsByProvinceCode
)

/**
 * @route GET /api/v1/address/districts/:code
 * @desc Lấy thông tin quận/huyện theo code
 * @access Public
 * @params { code }
 */
router.get('/districts/:code',
    addressController.getDistrictByCode
)

/**
 * @route GET /api/v1/address/districts/:district_code/wards
 * @desc Lấy danh sách phường/xã theo quận/huyện
 * @access Public
 * @params { district_code }
 * @query { search? }
 */
router.get('/districts/:district_code/wards',
    addressController.getWardsByDistrictCode
)

/**
 * @route GET /api/v1/address/wards/:code
 * @desc Lấy thông tin phường/xã theo code
 * @access Public
 * @params { code }
 */
router.get('/wards/:code',
    addressController.getWardByCode
)

/**
 * @route POST /api/v1/address/seed
 * @desc Seed dữ liệu địa chỉ ban đầu (temporary public for testing)
 * @access Public (for testing)
 */
router.post('/seed',
    addressController.seedAddressData
)

// Admin routes - cần admin privileges (commented out for testing)
// router.post('/seed',
//     adminMiddlewares.isAdminSimple,
//     addressController.seedAddressData
// )

export const addressRoutes = router
