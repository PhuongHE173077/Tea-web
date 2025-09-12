const { StatusCodes } = require("http-status-codes");
const Joi = require("joi");
const { default: ApiError } = require("~/utils/ApiError");

// Schema cho social media object
const socialMediaSchema = Joi.object({
    url: Joi.string().uri().required().messages({
        'string.uri': 'URL phải là một đường dẫn hợp lệ',
        'any.required': 'URL là bắt buộc'
    }),
    name: Joi.string().min(1).max(100).required().messages({
        'string.min': 'Tên phải có ít nhất 1 ký tự',
        'string.max': 'Tên không được vượt quá 100 ký tự',
        'any.required': 'Tên là bắt buộc'
    }),
    isActive: Joi.boolean().default(true)
});

// Schema chính cho Company Info
const companyInfoSchema = Joi.object({
    company_name: Joi.string().min(2).max(200).required().messages({
        'string.min': 'Tên công ty phải có ít nhất 2 ký tự',
        'string.max': 'Tên công ty không được vượt quá 200 ký tự',
        'any.required': 'Tên công ty là bắt buộc'
    }),
    company_description: Joi.string().min(10).max(1000).required().messages({
        'string.min': 'Mô tả công ty phải có ít nhất 10 ký tự',
        'string.max': 'Mô tả công ty không được vượt quá 1000 ký tự',
        'any.required': 'Mô tả công ty là bắt buộc'
    }),
    company_address: Joi.string().min(10).max(500).required().messages({
        'string.min': 'Địa chỉ công ty phải có ít nhất 10 ký tự',
        'string.max': 'Địa chỉ công ty không được vượt quá 500 ký tự',
        'any.required': 'Địa chỉ công ty là bắt buộc'
    }),
    company_phone: Joi.string().pattern(/^[0-9+\-\s()]{10,15}$/).required().messages({
        'string.pattern.base': 'Số điện thoại không hợp lệ (10-15 số)',
        'any.required': 'Số điện thoại là bắt buộc'
    }),
    company_email: Joi.string().email().required().messages({
        'string.email': 'Email không hợp lệ',
        'any.required': 'Email là bắt buộc'
    }),
    company_facebook: socialMediaSchema.required().messages({
        'any.required': 'Thông tin Facebook là bắt buộc'
    }),
    company_instagram: socialMediaSchema.required().messages({
        'any.required': 'Thông tin Instagram là bắt buộc'
    }),
    company_youtube: socialMediaSchema.required().messages({
        'any.required': 'Thông tin YouTube là bắt buộc'
    }),
    company_tiktok: socialMediaSchema.required().messages({
        'any.required': 'Thông tin TikTok là bắt buộc'
    }),
    company_twitter: socialMediaSchema.required().messages({
        'any.required': 'Thông tin Twitter là bắt buộc'
    }),
    company_linkedin: socialMediaSchema.required().messages({
        'any.required': 'Thông tin LinkedIn là bắt buộc'
    }),
    company_shopee: socialMediaSchema.required().messages({
        'any.required': 'Thông tin Shopee là bắt buộc'
    }),
    company_zalo: socialMediaSchema.required().messages({
        'any.required': 'Thông tin Zalo là bắt buộc'
    })
});

// Schema cho update (tất cả field đều optional)
const updateCompanyInfoSchema = Joi.object({
    company_name: Joi.string().min(2).max(200).messages({
        'string.min': 'Tên công ty phải có ít nhất 2 ký tự',
        'string.max': 'Tên công ty không được vượt quá 200 ký tự'
    }),
    company_description: Joi.string().min(10).max(1000).messages({
        'string.min': 'Mô tả công ty phải có ít nhất 10 ký tự',
        'string.max': 'Mô tả công ty không được vượt quá 1000 ký tự'
    }),
    company_address: Joi.string().min(10).max(500).messages({
        'string.min': 'Địa chỉ công ty phải có ít nhất 10 ký tự',
        'string.max': 'Địa chỉ công ty không được vượt quá 500 ký tự'
    }),
    company_phone: Joi.string().pattern(/^[0-9+\-\s()]{10,15}$/).messages({
        'string.pattern.base': 'Số điện thoại không hợp lệ (10-15 số)'
    }),
    company_email: Joi.string().email().messages({
        'string.email': 'Email không hợp lệ'
    }),
    company_facebook: socialMediaSchema,
    company_instagram: socialMediaSchema,
    company_youtube: socialMediaSchema,
    company_tiktok: socialMediaSchema,
    company_twitter: socialMediaSchema,
    company_linkedin: socialMediaSchema,
    company_shopee: socialMediaSchema,
    company_zalo: socialMediaSchema
}).min(1).messages({
    'object.min': 'Phải có ít nhất một trường để cập nhật'
});

// Schema cho query parameters
const querySchema = Joi.object({
    page: Joi.number().integer().min(1).default(1).messages({
        'number.min': 'Số trang phải lớn hơn 0'
    }),
    limit: Joi.number().integer().min(1).max(100).default(10).messages({
        'number.min': 'Số lượng item phải lớn hơn 0',
        'number.max': 'Số lượng item không được vượt quá 100'
    }),
    search: Joi.string().max(200).allow('').messages({
        'string.max': 'Từ khóa tìm kiếm không được vượt quá 200 ký tự'
    }),
    sortBy: Joi.string().valid('company_name', 'createdAt', 'updatedAt').default('createdAt').messages({
        'any.only': 'Trường sắp xếp phải là company_name, createdAt hoặc updatedAt'
    }),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc').messages({
        'any.only': 'Thứ tự sắp xếp phải là asc hoặc desc'
    })
});

// Schema cho ID parameter
const idSchema = Joi.object({
    id: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required().messages({
        'string.pattern.base': 'ID không hợp lệ',
        'any.required': 'ID là bắt buộc'
    })
});

/**
 * Middleware validation cho tạo mới company info
 */
const createCompanyInfo = async (req, res, next) => {
    try {
        await companyInfoSchema.validateAsync(req.body, { abortEarly: false });
        next();
    } catch (error) {
        const errorMessage = error.details.map(detail => detail.message).join(', ');
        next(new ApiError(StatusCodes.BAD_REQUEST, errorMessage));
    }
};

/**
 * Middleware validation cho cập nhật company info
 */
const updateCompanyInfo = async (req, res, next) => {
    try {
        // Validate params
        await idSchema.validateAsync(req.params, { abortEarly: false });
        // Validate body
        await updateCompanyInfoSchema.validateAsync(req.body, { abortEarly: false });
        next();
    } catch (error) {
        const errorMessage = error.details.map(detail => detail.message).join(', ');
        next(new ApiError(StatusCodes.BAD_REQUEST, errorMessage));
    }
};

/**
 * Middleware validation cho lấy company info theo ID
 */
const getCompanyInfoById = async (req, res, next) => {
    try {
        await idSchema.validateAsync(req.params, { abortEarly: false });
        next();
    } catch (error) {
        const errorMessage = error.details.map(detail => detail.message).join(', ');
        next(new ApiError(StatusCodes.BAD_REQUEST, errorMessage));
    }
};

/**
 * Middleware validation cho xóa company info
 */
const deleteCompanyInfo = async (req, res, next) => {
    try {
        await idSchema.validateAsync(req.params, { abortEarly: false });
        next();
    } catch (error) {
        const errorMessage = error.details.map(detail => detail.message).join(', ');
        next(new ApiError(StatusCodes.BAD_REQUEST, errorMessage));
    }
};

/**
 * Middleware validation cho query parameters
 */
const validateQuery = async (req, res, next) => {
    try {
        const validatedQuery = await querySchema.validateAsync(req.query, { abortEarly: false });
        req.query = validatedQuery; // Gán lại query đã được validate và có default values
        next();
    } catch (error) {
        const errorMessage = error.details.map(detail => detail.message).join(', ');
        next(new ApiError(StatusCodes.BAD_REQUEST, errorMessage));
    }
};

module.exports = {
    createCompanyInfo,
    updateCompanyInfo,
    getCompanyInfoById,
    deleteCompanyInfo,
    validateQuery
};
