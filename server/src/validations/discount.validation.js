const { StatusCodes } = require("http-status-codes")
const Joi = require("joi")
const { default: ApiError } = require("~/utils/ApiError")
const { DISCOUNT_TYPE } = require("~/models/discount.model")

const createDiscount = async (req, res, next) => {
    try {
        const schema = Joi.object({
            code: Joi.string()
                .required()
                .min(3)
                .max(20)
                .pattern(/^[A-Z0-9]+$/)
                .messages({
                    'string.pattern.base': 'Discount code must contain only uppercase letters and numbers',
                    'string.min': 'Discount code must be at least 3 characters long',
                    'string.max': 'Discount code must not exceed 20 characters'
                }),
            name: Joi.string()
                .required()
                .min(3)
                .max(100)
                .trim()
                .messages({
                    'string.min': 'Discount name must be at least 3 characters long',
                    'string.max': 'Discount name must not exceed 100 characters'
                }),
            description: Joi.string()
                .required()
                .min(10)
                .max(500)
                .trim()
                .messages({
                    'string.min': 'Description must be at least 10 characters long',
                    'string.max': 'Description must not exceed 500 characters'
                }),
            discount_type: Joi.string()
                .required()
                .valid(...Object.values(DISCOUNT_TYPE))
                .messages({
                    'any.only': `Discount type must be one of: ${Object.values(DISCOUNT_TYPE).join(', ')}`
                }),
            discount_value: Joi.number()
                .required()
                .positive()
                .when('discount_type', {
                    is: DISCOUNT_TYPE.PERCENTAGE,
                    then: Joi.number().max(100).messages({
                        'number.max': 'Percentage discount cannot exceed 100%'
                    }),
                    otherwise: Joi.number().messages({
                        'number.positive': 'Fixed amount discount must be greater than 0'
                    })
                }),
            min_order_value: Joi.number()
                .min(0)
                .default(0)
                .messages({
                    'number.min': 'Minimum order value cannot be negative'
                }),
            max_discount_amount: Joi.number()
                .positive()
                .allow(null)
                .when('discount_type', {
                    is: DISCOUNT_TYPE.PERCENTAGE,
                    then: Joi.number().required().messages({
                        'any.required': 'Maximum discount amount is required for percentage discounts'
                    }),
                    otherwise: Joi.number().allow(null)
                }),
            start_date: Joi.date()
                .required()
                .iso()
                .messages({
                    'date.format': 'Start date must be in ISO format (YYYY-MM-DD)',
                    'any.required': 'Start date is required'
                }),
            end_date: Joi.date()
                .required()
                .iso()
                .greater(Joi.ref('start_date'))
                .messages({
                    'date.format': 'End date must be in ISO format (YYYY-MM-DD)',
                    'date.greater': 'End date must be after start date',
                    'any.required': 'End date is required'
                }),
            usage_limit: Joi.number()
                .required()
                .integer()
                .min(1)
                .messages({
                    'number.min': 'Usage limit must be at least 1',
                    'number.integer': 'Usage limit must be a whole number'
                }),
            is_active: Joi.boolean().default(true),
        })

        await schema.validateAsync(req.body, { abortEarly: false })
        next()
    } catch (error) {
        next(new ApiError(StatusCodes.BAD_REQUEST, error.message))
    }
}

const updateDiscount = async (req, res, next) => {
    try {
        const schema = Joi.object({
            code: Joi.string()
                .min(3)
                .max(20)
                .pattern(/^[A-Z0-9]+$/)
                .messages({
                    'string.pattern.base': 'Discount code must contain only uppercase letters and numbers',
                    'string.min': 'Discount code must be at least 3 characters long',
                    'string.max': 'Discount code must not exceed 20 characters'
                }),
            name: Joi.string()
                .min(3)
                .max(100)
                .trim()
                .messages({
                    'string.min': 'Discount name must be at least 3 characters long',
                    'string.max': 'Discount name must not exceed 100 characters'
                }),
            description: Joi.string()
                .min(10)
                .max(500)
                .trim()
                .messages({
                    'string.min': 'Description must be at least 10 characters long',
                    'string.max': 'Description must not exceed 500 characters'
                }),
            discount_type: Joi.string()
                .valid(...Object.values(DISCOUNT_TYPE))
                .messages({
                    'any.only': `Discount type must be one of: ${Object.values(DISCOUNT_TYPE).join(', ')}`
                }),
            discount_value: Joi.number()
                .positive()
                .when('discount_type', {
                    is: DISCOUNT_TYPE.PERCENTAGE,
                    then: Joi.number().max(100).messages({
                        'number.max': 'Percentage discount cannot exceed 100%'
                    }),
                    otherwise: Joi.number().messages({
                        'number.positive': 'Fixed amount discount must be greater than 0'
                    })
                }),
            min_order_value: Joi.number()
                .min(0)
                .messages({
                    'number.min': 'Minimum order value cannot be negative'
                }),
            max_discount_amount: Joi.number()
                .positive()
                .allow(null),
            start_date: Joi.date()
                .iso()
                .messages({
                    'date.format': 'Start date must be in ISO format (YYYY-MM-DD)'
                }),
            end_date: Joi.date()
                .iso()
                .when('start_date', {
                    is: Joi.exist(),
                    then: Joi.date().greater(Joi.ref('start_date')).messages({
                        'date.greater': 'End date must be after start date'
                    }),
                    otherwise: Joi.date()
                })
                .messages({
                    'date.format': 'End date must be in ISO format (YYYY-MM-DD)'
                }),
            usage_limit: Joi.number()
                .integer()
                .min(1)
                .messages({
                    'number.min': 'Usage limit must be at least 1',
                    'number.integer': 'Usage limit must be a whole number'
                }),
            is_active: Joi.boolean()
        }).min(1).messages({
            'object.min': 'At least one field must be provided for update'
        })

        await schema.validateAsync(req.body, { abortEarly: false })
        next()
    } catch (error) {
        next(new ApiError(StatusCodes.BAD_REQUEST, error.message))
    }
}

const validateDiscountCode = async (req, res, next) => {
    try {
        const schema = Joi.object({
            code: Joi.string()
                .required()
                .min(3)
                .max(20)
                .messages({
                    'string.min': 'Discount code must be at least 3 characters long',
                    'string.max': 'Discount code must not exceed 20 characters'
                }),
            order_value: Joi.number()
                .required()
                .positive()
                .messages({
                    'number.positive': 'Order value must be greater than 0'
                }),
            user_id: Joi.string()
                .optional()
                .pattern(/^[0-9a-fA-F]{24}$/)
                .messages({
                    'string.pattern.base': 'User ID must be a valid ObjectId'
                })
        })

        await schema.validateAsync(req.body, { abortEarly: false })
        next()
    } catch (error) {
        next(new ApiError(StatusCodes.BAD_REQUEST, error.message))
    }
}

const getDiscounts = async (req, res, next) => {
    try {
        const schema = Joi.object({
            page: Joi.number().integer().min(1).default(1),
            limit: Joi.number().integer().min(1).max(100).default(10),
            is_active: Joi.string().valid('true', 'false'),
            discount_type: Joi.string().valid(...Object.values(DISCOUNT_TYPE)),
            search: Joi.string().max(100),
            sort_by: Joi.string().valid('createdAt', 'updatedAt', 'name', 'code', 'start_date', 'end_date').default('createdAt'),
            sort_order: Joi.string().valid('asc', 'desc').default('desc')
        })

        const { error, value } = schema.validate(req.query)
        if (error) {
            throw error
        }

        req.query = value
        next()
    } catch (error) {
        next(new ApiError(StatusCodes.BAD_REQUEST, error.message))
    }
}

const validateObjectId = async (req, res, next) => {
    try {
        const schema = Joi.object({
            id: Joi.string()
                .required()
                .pattern(/^[0-9a-fA-F]{24}$/)
                .messages({
                    'string.pattern.base': 'Invalid discount ID format'
                })
        })

        await schema.validateAsync(req.params, { abortEarly: false })
        next()
    } catch (error) {
        next(new ApiError(StatusCodes.BAD_REQUEST, error.message))
    }
}

export const discountValidation = {
    createDiscount,
    updateDiscount,
    validateDiscountCode,
    getDiscounts,
    validateObjectId
}
