const { StatusCodes } = require("http-status-codes")
const Joi = require("joi")
const ApiError = require("~/utils/ApiError").default

const createShipConfig = async (req, res, next) => {
    try {
        const schema = Joi.object({
            freeShippingThreshold: Joi.number()
                .required()
                .min(0)
                .messages({
                    'number.min': 'Free shipping threshold must be greater than or equal to 0',
                    'any.required': 'Free shipping threshold is required'
                }),
            shippingFee: Joi.number()
                .required()
                .min(0)
                .messages({
                    'number.min': 'Shipping fee must be greater than or equal to 0',
                    'any.required': 'Shipping fee is required'
                }),
            isActive: Joi.boolean()
                .default(true),
            description: Joi.string()
                .max(500)
                .allow('')
                .default('')
                .messages({
                    'string.max': 'Description cannot exceed 500 characters'
                })
        })

        await schema.validateAsync(req.body, { abortEarly: false })
        next()
    } catch (error) {
        next(new ApiError(StatusCodes.BAD_REQUEST, error.message))
    }
}

const updateShipConfig = async (req, res, next) => {
    try {
        const schema = Joi.object({
            freeShippingThreshold: Joi.number()
                .min(0)
                .messages({
                    'number.min': 'Free shipping threshold must be greater than or equal to 0'
                }),
            shippingFee: Joi.number()
                .min(0)
                .messages({
                    'number.min': 'Shipping fee must be greater than or equal to 0'
                }),
            isActive: Joi.boolean(),
            description: Joi.string()
                .max(500)
                .allow('')
                .messages({
                    'string.max': 'Description cannot exceed 500 characters'
                })
        }).min(1).messages({
            'object.min': 'At least one field must be provided for update'
        })

        await schema.validateAsync(req.body, { abortEarly: false })
        next()
    } catch (error) {
        next(new ApiError(StatusCodes.BAD_REQUEST, error.message))
    }
}

const getShipConfigs = async (req, res, next) => {
    try {
        const schema = Joi.object({
            page: Joi.number().integer().min(1).default(1),
            limit: Joi.number().integer().min(1).max(100).default(10),
            isActive: Joi.string().valid('true', 'false'),
            search: Joi.string().max(100),
            sort_by: Joi.string().valid('createdAt', 'updatedAt', 'freeShippingThreshold', 'shippingFee').default('createdAt'),
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
                    'string.pattern.base': 'Invalid ship configuration ID format'
                })
        })

        await schema.validateAsync(req.params, { abortEarly: false })
        next()
    } catch (error) {
        next(new ApiError(StatusCodes.BAD_REQUEST, error.message))
    }
}

const calculateShippingFee = async (req, res, next) => {
    try {
        const schema = Joi.object({
            orderValue: Joi.number()
                .required()
                .min(0)
                .messages({
                    'number.min': 'Order value must be greater than or equal to 0',
                    'any.required': 'Order value is required'
                })
        })

        await schema.validateAsync(req.body, { abortEarly: false })
        next()
    } catch (error) {
        next(new ApiError(StatusCodes.BAD_REQUEST, error.message))
    }
}

export const shipValidation = {
    createShipConfig,
    updateShipConfig,
    getShipConfigs,
    validateObjectId,
    calculateShippingFee
}
