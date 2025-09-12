const express = require('express');
const companyInfoController = require('~/controllers/company.info.controller');
const companyInfoValidation = require('~/validations/company.info.validation');
// Import authentication middleware nếu cần
// const { authMiddleware } = require('~/middlewares/authMiddlewares');
// const { rbacMiddleware } = require('~/middlewares/rbacMiddlewares');

const Router = express.Router();

/**
 * @route GET /api/v1/company-info/stats
 * @desc Lấy thống kê tổng quan về company info
 * @access Public (hoặc Private tùy yêu cầu)
 */
Router.get('/stats', companyInfoController.getCompanyInfoStats);

/**
 * @route GET /api/v1/company-info/single
 * @desc Lấy thông tin công ty duy nhất (single company info)
 * @access Public
 */
Router.get('/single', companyInfoController.getSingleCompanyInfo);

/**
 * @route GET /api/v1/company-info/search
 * @desc Tìm kiếm công ty theo từ khóa
 * @access Public
 */
Router.get('/search',
    companyInfoValidation.validateQuery,
    companyInfoController.searchCompanyInfos
);

/**
 * @route GET /api/v1/company-info/active-social
 * @desc Lấy danh sách công ty có social media active
 * @access Public
 */
Router.get('/active-social',
    companyInfoValidation.validateQuery,
    companyInfoController.getCompaniesWithActiveSocial
);

/**
 * @route GET /api/v1/company-info
 * @desc Lấy danh sách thông tin công ty với phân trang và tìm kiếm
 * @access Public
 */
Router.get('/',
    companyInfoValidation.validateQuery,
    companyInfoController.getAllCompanyInfos
);

/**
 * @route GET /api/v1/company-info/:id
 * @desc Lấy thông tin chi tiết một công ty theo ID
 * @access Public
 */
Router.get('/:id',
    companyInfoValidation.getCompanyInfoById,
    companyInfoController.getCompanyInfoById
);

/**
 * @route POST /api/v1/company-info
 * @desc Tạo mới thông tin công ty
 * @access Private (Admin only)
 */
Router.post('/',
    // authMiddleware, // Uncomment nếu cần authentication
    // rbacMiddleware(['admin']), // Uncomment nếu cần role-based access control
    companyInfoValidation.createCompanyInfo,
    companyInfoController.createCompanyInfo
);

/**
 * @route PUT /api/v1/company-info/:id
 * @desc Cập nhật thông tin công ty
 * @access Private (Admin only)
 */
Router.put('/:id',
    // authMiddleware, // Uncomment nếu cần authentication
    // rbacMiddleware(['admin']), // Uncomment nếu cần role-based access control
    companyInfoValidation.updateCompanyInfo,
    companyInfoController.updateCompanyInfo
);

/**
 * @route PATCH /api/v1/company-info/:id/social-status
 * @desc Cập nhật trạng thái social media của công ty
 * @access Private (Admin only)
 */
Router.patch('/:id/social-status',
    // authMiddleware, // Uncomment nếu cần authentication
    // rbacMiddleware(['admin']), // Uncomment nếu cần role-based access control
    companyInfoValidation.getCompanyInfoById, // Validate ID parameter
    companyInfoController.updateSocialMediaStatus
);

/**
 * @route DELETE /api/v1/company-info/:id
 * @desc Xóa thông tin công ty
 * @access Private (Admin only)
 */
Router.delete('/:id',
    // authMiddleware, // Uncomment nếu cần authentication
    // rbacMiddleware(['admin']), // Uncomment nếu cần role-based access control
    companyInfoValidation.deleteCompanyInfo,
    companyInfoController.deleteCompanyInfo
);

module.exports = { companyInfoRoutes: Router };
