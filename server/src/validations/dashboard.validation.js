import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

/**
 * Validation cho dashboard stats
 */
const getDashboardStats = async (req, res, next) => {
    const correctCondition = Joi.object({
        period: Joi.string().valid('week', 'month', 'quarter', 'year').optional(),
        start_date: Joi.date().iso().optional(),
        end_date: Joi.date().iso().optional()
    })

    try {
        await correctCondition.validateAsync(req.query, { abortEarly: false })
        next()
    } catch (error) {
        const errorMessage = new Error(error).message
        const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage)
        next(customError)
    }
}

/**
 * Validation cho revenue chart data
 */
const getRevenueChartData = async (req, res, next) => {
    const correctCondition = Joi.object({
        period: Joi.string().valid('week', 'month', 'quarter', 'year').optional(),
        start_date: Joi.date().iso().optional(),
        end_date: Joi.date().iso().optional()
    })

    try {
        await correctCondition.validateAsync(req.query, { abortEarly: false })
        next()
    } catch (error) {
        const errorMessage = new Error(error).message
        const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage)
        next(customError)
    }
}

/**
 * Validation cho user growth chart data
 */
const getUserGrowthChartData = async (req, res, next) => {
    const correctCondition = Joi.object({
        period: Joi.string().valid('week', 'month', 'quarter', 'year').optional(),
        start_date: Joi.date().iso().optional(),
        end_date: Joi.date().iso().optional()
    })

    try {
        await correctCondition.validateAsync(req.query, { abortEarly: false })
        next()
    } catch (error) {
        const errorMessage = new Error(error).message
        const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage)
        next(customError)
    }
}

/**
 * Validation cho product category chart data
 */
const getProductCategoryChartData = async (req, res, next) => {
    const correctCondition = Joi.object({
        period: Joi.string().valid('week', 'month', 'quarter', 'year').optional(),
        start_date: Joi.date().iso().optional(),
        end_date: Joi.date().iso().optional()
    })

    try {
        await correctCondition.validateAsync(req.query, { abortEarly: false })
        next()
    } catch (error) {
        const errorMessage = new Error(error).message
        const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage)
        next(customError)
    }
}

/**
 * Validation cho recent orders
 */
const getRecentOrders = async (req, res, next) => {
    const correctCondition = Joi.object({
        limit: Joi.number().integer().min(1).max(50).optional()
    })

    try {
        await correctCondition.validateAsync(req.query, { abortEarly: false })
        next()
    } catch (error) {
        const errorMessage = new Error(error).message
        const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage)
        next(customError)
    }
}

/**
 * Validation cho top customers
 */
const getTopCustomers = async (req, res, next) => {
    const correctCondition = Joi.object({
        limit: Joi.number().integer().min(1).max(100).optional(),
        period: Joi.string().valid('week', 'month', 'quarter', 'year').optional()
    })

    try {
        await correctCondition.validateAsync(req.query, { abortEarly: false })
        next()
    } catch (error) {
        const errorMessage = new Error(error).message
        const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage)
        next(customError)
    }
}

/**
 * Validation cho top products
 */
const getTopProducts = async (req, res, next) => {
    const correctCondition = Joi.object({
        limit: Joi.number().integer().min(1).max(100).optional(),
        period: Joi.string().valid('week', 'month', 'quarter', 'year').optional()
    })

    try {
        await correctCondition.validateAsync(req.query, { abortEarly: false })
        next()
    } catch (error) {
        const errorMessage = new Error(error).message
        const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage)
        next(customError)
    }
}

const dashboardValidation = {
    getDashboardStats,
    getRevenueChartData,
    getUserGrowthChartData,
    getProductCategoryChartData,
    getRecentOrders,
    getTopCustomers,
    getTopProducts
}

export default dashboardValidation
