import { StatusCodes } from "http-status-codes"
import { discountService } from "~/services/discount.service"

const createDiscount = async (req, res, next) => {
    try {
        // Lấy user ID từ JWT token
        const userId = req.jwtDecoded?._id
        console.log("🚀 ~ createDiscount ~ userId:", userId)
        if (!userId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                message: 'User not authenticated'
            })
        }

        const discountData = {
            ...req.body,
            created_by: userId
        }

        const newDiscount = await discountService.createDiscount(discountData)

        res.status(StatusCodes.CREATED).json({
            success: true,
            message: 'Discount created successfully',
            data: newDiscount
        })
    } catch (error) {
        next(error)
    }
}

const getDiscounts = async (req, res, next) => {
    try {
        const result = await discountService.getDiscounts(req.query)

        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Discounts retrieved successfully',
            data: result.discounts,
            pagination: result.pagination
        })
    } catch (error) {
        next(error)
    }
}

const getDiscountById = async (req, res, next) => {
    try {
        const { id } = req.params
        const discount = await discountService.getDiscountById(id)

        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Discount retrieved successfully',
            data: discount
        })
    } catch (error) {
        next(error)
    }
}

const updateDiscount = async (req, res, next) => {
    try {
        const { id } = req.params
        const updatedDiscount = await discountService.updateDiscount(id, req.body)

        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Discount updated successfully',
            data: updatedDiscount
        })
    } catch (error) {
        next(error)
    }
}

const deleteDiscount = async (req, res, next) => {
    try {
        const { id } = req.params
        const result = await discountService.deleteDiscount(id)

        res.status(StatusCodes.OK).json({
            success: true,
            message: result.message
        })
    } catch (error) {
        next(error)
    }
}

const validateDiscountCode = async (req, res, next) => {
    try {
        const { code, order_value, user_id } = req.body

        // Nếu không có user_id trong body, lấy từ JWT token (nếu có)
        // Cho phép validation mà không cần authentication
        const userId = user_id || req.jwtDecoded?.userId || req.jwtDecoded?._id

        const result = await discountService.validateDiscountCode(code, userId, order_value)

        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Discount code is valid',
            data: result
        })
    } catch (error) {
        next(error)
    }
}

const getActiveDiscounts = async (req, res, next) => {
    try {
        const activeDiscounts = await discountService.getActiveDiscounts()

        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Active discounts retrieved successfully',
            data: activeDiscounts
        })
    } catch (error) {
        next(error)
    }
}

const useDiscount = async (req, res, next) => {
    try {
        const { discount_id, order_id } = req.body
        const userId = req.jwtDecoded?._id

        if (!userId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                message: 'User not authenticated'
            })
        }

        const result = await discountService.useDiscount(discount_id, userId, order_id)

        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Discount used successfully',
            data: result
        })
    } catch (error) {
        next(error)
    }
}

const getDiscountStats = async (req, res, next) => {
    try {
        const userId = req.jwtDecoded?._id
        if (!userId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                message: 'User not authenticated'
            })
        }

        // Lấy thống kê discount của user hiện tại
        const stats = await discountService.getDiscountStats(userId)

        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Discount statistics retrieved successfully',
            data: stats
        })
    } catch (error) {
        next(error)
    }
}

const toggleDiscountStatus = async (req, res, next) => {
    try {
        const { id } = req.params
        const { is_active } = req.body

        const updatedDiscount = await discountService.updateDiscount(id, { is_active })

        res.status(StatusCodes.OK).json({
            success: true,
            message: `Discount ${is_active ? 'activated' : 'deactivated'} successfully`,
            data: updatedDiscount
        })
    } catch (error) {
        next(error)
    }
}

export const discountController = {
    createDiscount,
    getDiscounts,
    getDiscountById,
    updateDiscount,
    deleteDiscount,
    validateDiscountCode,
    getActiveDiscounts,
    useDiscount,
    getDiscountStats,
    toggleDiscountStatus
}
