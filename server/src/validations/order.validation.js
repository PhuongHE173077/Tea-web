import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { ORDER_STATUS, PAYMENT_STATUS } from '~/models/order.model'

const createOrder = async (req, res, next) => {
    try {
        const schema = Joi.object({
            customer_info: Joi.object({
                name: Joi.string()
                    .required()
                    .trim()
                    .min(2)
                    .max(100)
                    .messages({
                        'string.min': 'Name must be at least 2 characters long',
                        'string.max': 'Name must not exceed 100 characters',
                        'any.required': 'Name is required'
                    }),
                phone: Joi.string()
                    .required()
                    .pattern(/^[0-9]{10,11}$/)
                    .messages({
                        'string.pattern.base': 'Phone number must be 10-11 digits',
                        'any.required': 'Phone number is required'
                    }),
                email: Joi.string()
                    .required()
                    .email()
                    .messages({
                        'string.email': 'Please enter a valid email address',
                        'any.required': 'Email is required'
                    }),
                address: Joi.string()
                    .required()
                    .trim()
                    .min(10)
                    .max(500)
                    .messages({
                        'string.min': 'Address must be at least 10 characters long',
                        'string.max': 'Address must not exceed 500 characters',
                        'any.required': 'Address is required'
                    }),
                note: Joi.string()
                    .allow('', null)
                    .optional()
                    .max(1000)
                    .messages({
                        'string.max': 'Note must not exceed 1000 characters'
                    })
            }).required(),

            cart_items: Joi.array()
                .items(
                    Joi.object({
                        id: Joi.string()
                            .required()
                            .messages({
                                'any.required': 'Product ID is required'
                            }),
                        name: Joi.string()
                            .required()
                            .messages({
                                'any.required': 'Product name is required'
                            }),
                        slug: Joi.string()
                            .required()
                            .messages({
                                'any.required': 'Product slug is required'
                            }),
                        image: Joi.string()
                            .required()
                            .messages({
                                'any.required': 'Product image is required'
                            }),
                        price: Joi.number()
                            .required()
                            .positive()
                            .messages({
                                'number.positive': 'Product price must be greater than 0',
                                'any.required': 'Product price is required'
                            }),
                        quantity: Joi.number()
                            .required()
                            .integer()
                            .min(1)
                            .messages({
                                'number.min': 'Quantity must be at least 1',
                                'any.required': 'Quantity is required'
                            }),
                        attribute: Joi.object({
                            name: Joi.string().required(),
                            unit: Joi.string().required(),
                            price: Joi.number().required().positive()
                        }).optional()
                    })
                )
                .min(1)
                .required()
                .messages({
                    'array.min': 'Cart must contain at least 1 item',
                    'any.required': 'Cart items are required'
                }),

            discount_code: Joi.string()
                .optional()
                .trim()
                .min(3)
                .max(20)
                .messages({
                    'string.min': 'Discount code must be at least 3 characters long',
                    'string.max': 'Discount code must not exceed 20 characters'
                }),

            shipping_address: Joi.object({
                province: Joi.object({
                    code: Joi.string().required(),
                    name: Joi.string().required()
                }).optional(),
                district: Joi.object({
                    code: Joi.string().required(),
                    name: Joi.string().required()
                }).optional(),
                ward: Joi.object({
                    code: Joi.string().required(),
                    name: Joi.string().required()
                }).optional(),
                street: Joi.string().optional(),
                full_address: Joi.string().optional()
            }).optional(),

            payment_method: Joi.string()
                .valid('cod', 'bank_transfer', 'momo', 'vnpay')
                .default('cod')
                .messages({
                    'any.only': 'Payment method must be one of: cod, bank_transfer, momo, vnpay'
                })
        })

        await schema.validateAsync(req.body, { abortEarly: false })
        next()
    } catch (error) {
        next(new ApiError(StatusCodes.BAD_REQUEST, error.message))
    }
}

const updateOrderStatus = async (req, res, next) => {
    try {
        const schema = Joi.object({
            status: Joi.string()
                .required()
                .valid(...Object.values(ORDER_STATUS))
                .messages({
                    'any.only': `Status must be one of: ${Object.values(ORDER_STATUS).join(', ')}`,
                    'any.required': 'Status is required'
                }),
            note: Joi.string()
                .optional()
                .max(500)
                .messages({
                    'string.max': 'Note must not exceed 500 characters'
                })
        })

        await schema.validateAsync(req.body, { abortEarly: false })
        next()
    } catch (error) {
        next(new ApiError(StatusCodes.BAD_REQUEST, error.message))
    }
}

const getOrders = async (req, res, next) => {
    try {
        const schema = Joi.object({
            page: Joi.number()
                .integer()
                .min(1)
                .default(1)
                .messages({
                    'number.min': 'Page must be at least 1'
                }),
            limit: Joi.number()
                .integer()
                .min(1)
                .max(100)
                .default(10)
                .messages({
                    'number.min': 'Limit must be at least 1',
                    'number.max': 'Limit must not exceed 100'
                }),
            status: Joi.string()
                .optional()
                .valid(...Object.values(ORDER_STATUS))
                .messages({
                    'any.only': `Status must be one of: ${Object.values(ORDER_STATUS).join(', ')}`
                }),
            search: Joi.string()
                .optional()
                .trim()
                .min(1)
                .messages({
                    'string.min': 'Search term must be at least 1 character long'
                }),
            start_date: Joi.date()
                .optional()
                .messages({
                    'date.base': 'Start date must be a valid date'
                }),
            end_date: Joi.date()
                .optional()
                .min(Joi.ref('start_date'))
                .messages({
                    'date.base': 'End date must be a valid date',
                    'date.min': 'End date must be after start date'
                }),
            sort_by: Joi.string()
                .optional()
                .valid('createdAt', 'order_status', 'order_checkout.total')
                .default('createdAt')
                .messages({
                    'any.only': 'Sort by must be one of: createdAt, order_status, order_checkout.total'
                }),
            sort_order: Joi.string()
                .optional()
                .valid('asc', 'desc')
                .default('desc')
                .messages({
                    'any.only': 'Sort order must be either asc or desc'
                })
        })

        const validated = await schema.validateAsync(req.query, { abortEarly: false })
        req.query = validated
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
                    'string.pattern.base': 'Invalid order ID format',
                    'any.required': 'Order ID is required'
                })
        })

        await schema.validateAsync(req.params, { abortEarly: false })
        next()
    } catch (error) {
        next(new ApiError(StatusCodes.BAD_REQUEST, error.message))
    }
}

const validateTrackingNumber = async (req, res, next) => {
    try {
        const schema = Joi.object({
            tracking_number: Joi.string()
                .required()
                .pattern(/^[0-9]+$/)
                .messages({
                    'string.pattern.base': 'Invalid tracking number format',
                    'any.required': 'Tracking number is required'
                })
        })

        await schema.validateAsync(req.params, { abortEarly: false })
        next()
    } catch (error) {
        next(new ApiError(StatusCodes.BAD_REQUEST, error.message))
    }
}

// Validation for track order API
const trackOrder = async (req, res, next) => {
    try {
        const schema = Joi.object({
            trackingNumber: Joi.string()
                .optional()
                .messages({
                    'string.base': 'Tracking number must be a string'
                }),
            phone: Joi.string()
                .optional()
                .pattern(/^[0-9]{10,11}$/)
                .messages({
                    'string.pattern.base': 'Phone number must be 10-11 digits'
                })
        }).or('trackingNumber', 'phone')
        .messages({
            'object.missing': 'Either tracking number or phone number is required'
        })

        await schema.validateAsync(req.body, { abortEarly: false })
        next()
    } catch (error) {
        next(new ApiError(StatusCodes.BAD_REQUEST, error.message))
    }
}

// Validation for get customers API
const getCustomers = async (req, res, next) => {
    try {
        const schema = Joi.object({
            page: Joi.number()
                .integer()
                .min(1)
                .default(1)
                .messages({
                    'number.min': 'Page must be at least 1'
                }),
            limit: Joi.number()
                .integer()
                .min(1)
                .max(100)
                .default(10)
                .messages({
                    'number.min': 'Limit must be at least 1',
                    'number.max': 'Limit must not exceed 100'
                }),
            search: Joi.string()
                .optional()
                .trim()
                .min(1)
                .messages({
                    'string.min': 'Search term must be at least 1 character long'
                }),
            sort_by: Joi.string()
                .optional()
                .valid('total_spent', 'total_orders', 'last_order_date', 'customer_name')
                .default('total_spent')
                .messages({
                    'any.only': 'Sort by must be one of: total_spent, total_orders, last_order_date, customer_name'
                }),
            sort_order: Joi.string()
                .optional()
                .valid('asc', 'desc')
                .default('desc')
                .messages({
                    'any.only': 'Sort order must be either asc or desc'
                })
        })

        await schema.validateAsync(req.query, { abortEarly: false })
        next()
    } catch (error) {
        next(new ApiError(StatusCodes.BAD_REQUEST, error.message))
    }
}

export const orderValidation = {
    createOrder,
    updateOrderStatus,
    getOrders,
    getCustomers,
    validateObjectId,
    validateTrackingNumber,
    trackOrder
}
