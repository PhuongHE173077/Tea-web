const Discount = require("~/models/discount.model")
const { DISCOUNT_TYPE } = require("~/models/discount.model")
import ApiError from "~/utils/ApiError"
import { StatusCodes } from "http-status-codes"

const createDiscount = async (discountData) => {
    try {
        // Kiểm tra mã discount đã tồn tại chưa
        const existingDiscount = await Discount.findOne({ code: discountData.code.toUpperCase() })
        if (existingDiscount) {
            throw new ApiError(StatusCodes.CONFLICT, 'Discount code already exists')
        }

        // Validate dates
        const startDate = new Date(discountData.start_date)
        const endDate = new Date(discountData.end_date)
        const now = new Date()

        if (startDate >= endDate) {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Start date must be before end date')
        }

        if (endDate <= now) {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'End date must be in the future')
        }

        // Validate discount value based on type
        if (discountData.discount_type === DISCOUNT_TYPE.PERCENTAGE) {
            if (discountData.discount_value <= 0 || discountData.discount_value > 100) {
                throw new ApiError(StatusCodes.BAD_REQUEST, 'Percentage discount must be between 1 and 100')
            }
        } else if (discountData.discount_type === DISCOUNT_TYPE.FIXED_AMOUNT) {
            if (discountData.discount_value <= 0) {
                throw new ApiError(StatusCodes.BAD_REQUEST, 'Fixed amount discount must be greater than 0')
            }
        }

        const newDiscount = new Discount({
            ...discountData,
            code: discountData.code.toUpperCase()
        })

        const savedDiscount = await newDiscount.save()
        return savedDiscount
    } catch (error) {
        if (error instanceof ApiError) {
            throw error
        }
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
    }
}

const getDiscounts = async (query = {}) => {
    try {
        const {
            page = 1,
            limit = 10,
            is_active,
            discount_type,
            search,
            sort_by = 'createdAt',
            sort_order = 'desc'
        } = query

        const filter = {}

        if (is_active !== undefined) {
            filter.is_active = is_active === 'true'
        }

        if (discount_type) {
            filter.discount_type = discount_type
        }

        if (search) {
            filter.$or = [
                { code: { $regex: search, $options: 'i' } },
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ]
        }

        const sortOrder = sort_order === 'desc' ? -1 : 1
        const sortObj = { [sort_by]: sortOrder }

        const skip = (page - 1) * limit

        const [discounts, total] = await Promise.all([
            Discount.find(filter)
                .populate('created_by', 'usr_name usr_email')
                .sort(sortObj)
                .skip(skip)
                .limit(parseInt(limit)),
            Discount.countDocuments(filter)
        ])

        return {
            discounts,
            pagination: {
                current_page: parseInt(page),
                total_pages: Math.ceil(total / limit),
                total_items: total,
                items_per_page: parseInt(limit)
            }
        }
    } catch (error) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
    }
}

const getDiscountById = async (id) => {
    try {
        const discount = await Discount.findById(id)
            .populate('created_by', 'usr_name usr_email')
            .populate('users_used.user_id', 'usr_name usr_email usr_phone')

        if (!discount) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Discount not found')
        }

        return discount
    } catch (error) {
        if (error instanceof ApiError) {
            throw error
        }
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
    }
}

const updateDiscount = async (id, updateData) => {
    try {
        const discount = await Discount.findById(id)
        if (!discount) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Discount not found')
        }

        // Không cho phép cập nhật code nếu đã có người sử dụng
        if (updateData.code && discount.used_count > 0) {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Cannot update code for used discount')
        }

        // Kiểm tra code mới có trùng không
        if (updateData.code && updateData.code !== discount.code) {
            const existingDiscount = await Discount.findOne({
                code: updateData.code.toUpperCase(),
                _id: { $ne: id }
            })
            if (existingDiscount) {
                throw new ApiError(StatusCodes.CONFLICT, 'Discount code already exists')
            }
            updateData.code = updateData.code.toUpperCase()
        }

        // Validate dates nếu có cập nhật
        if (updateData.start_date || updateData.end_date) {
            const startDate = new Date(updateData.start_date || discount.start_date)
            const endDate = new Date(updateData.end_date || discount.end_date)

            if (startDate >= endDate) {
                throw new ApiError(StatusCodes.BAD_REQUEST, 'Start date must be before end date')
            }
        }

        const updatedDiscount = await Discount.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).populate('created_by', 'usr_name usr_email')

        return updatedDiscount
    } catch (error) {
        if (error instanceof ApiError) {
            throw error
        }
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
    }
}

const deleteDiscount = async (id) => {
    try {
        const discount = await Discount.findById(id)
        if (!discount) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Discount not found')
        }

        // Không cho phép xóa discount đã được sử dụng
        if (discount.used_count > 0) {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Cannot delete used discount')
        }

        await Discount.findByIdAndDelete(id)
        return { message: 'Discount deleted successfully' }
    } catch (error) {
        if (error instanceof ApiError) {
            throw error
        }
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
    }
}

const validateDiscountCode = async (code, userId, orderValue) => {
    try {
        const discount = await Discount.findOne({
            code: code.toUpperCase(),
            is_active: true
        })

        if (!discount) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Invalid discount code')
        }

        const now = new Date()

        // Kiểm tra thời gian hiệu lực
        if (discount.start_date > now) {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Discount is not yet active')
        }

        if (discount.end_date < now) {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Discount has expired')
        }

        // Kiểm tra số lần sử dụng
        if (discount.used_count >= discount.usage_limit) {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Discount usage limit reached')
        }

        // Kiểm tra user đã sử dụng chưa (chỉ khi có userId)
        if (userId && discount.isUsedByUser(userId)) {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'You have already used this discount')
        }

        // Kiểm tra giá trị đơn hàng tối thiểu
        if (orderValue < discount.min_order_value) {
            throw new ApiError(
                StatusCodes.BAD_REQUEST,
                `Minimum order value is ${discount.min_order_value.toLocaleString('vi-VN')} VND`
            )
        }

        // Tính toán số tiền giảm
        const discountAmount = discount.applyDiscount(orderValue)

        return {
            valid: true,
            discount: {
                id: discount._id,
                code: discount.code,
                name: discount.name,
                discount_type: discount.discount_type,
                discount_value: discount.discount_value,
                discount_amount: discountAmount,
                min_order_value: discount.min_order_value,
                max_discount_amount: discount.max_discount_amount
            }
        }
    } catch (error) {
        if (error instanceof ApiError) {
            throw error
        }
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
    }
}

const getActiveDiscounts = async () => {
    try {
        const now = new Date()
        const activeDiscounts = await Discount.find({
            is_active: true,
            start_date: { $lte: now },
            end_date: { $gte: now },
            $expr: { $lt: ['$used_count', '$usage_limit'] }
        })
            .select('code name description discount_type discount_value min_order_value max_discount_amount start_date end_date')
            .sort({ createdAt: -1 })

        return activeDiscounts
    } catch (error) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
    }
}

const useDiscount = async (discountId, userId, orderId) => {
    try {
        const discount = await Discount.findById(discountId)
        if (!discount) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Discount not found')
        }

        // Cập nhật thông tin sử dụng
        discount.used_count += 1
        discount.users_used.push({
            user_id: userId,
            order_id: orderId,
            used_at: new Date()
        })

        await discount.save()
        return discount
    } catch (error) {
        if (error instanceof ApiError) {
            throw error
        }
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
    }
}

const getDiscountStats = async (userId) => {
    try {
        const now = new Date()

        // Thống kê tổng quan
        const totalDiscounts = await Discount.countDocuments({ created_by: userId })
        const activeDiscounts = await Discount.countDocuments({
            created_by: userId,
            is_active: true,
            start_date: { $lte: now },
            end_date: { $gte: now }
        })
        const expiredDiscounts = await Discount.countDocuments({
            created_by: userId,
            end_date: { $lt: now }
        })
        const usedDiscounts = await Discount.countDocuments({
            created_by: userId,
            used_count: { $gt: 0 }
        })

        // Thống kê sử dụng
        const totalUsage = await Discount.aggregate([
            { $match: { created_by: userId } },
            { $group: { _id: null, total: { $sum: '$used_count' } } }
        ])

        // Top 5 discount được sử dụng nhiều nhất
        const topUsedDiscounts = await Discount.find({ created_by: userId })
            .sort({ used_count: -1 })
            .limit(5)
            .select('code name used_count usage_limit')

        return {
            overview: {
                total_discounts: totalDiscounts,
                active_discounts: activeDiscounts,
                expired_discounts: expiredDiscounts,
                used_discounts: usedDiscounts,
                total_usage: totalUsage[0]?.total || 0
            },
            top_used_discounts: topUsedDiscounts
        }
    } catch (error) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
    }
}

export const discountService = {
    createDiscount,
    getDiscounts,
    getDiscountById,
    updateDiscount,
    deleteDiscount,
    validateDiscountCode,
    getActiveDiscounts,
    useDiscount,
    getDiscountStats
}
