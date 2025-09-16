import { StatusCodes } from "http-status-codes"
import User from "~/models/user.model"
import ApiError from "~/utils/ApiError"

// Middleware kiểm tra quyền admin
const isAdmin = async (req, res, next) => {
    try {
        // Kiểm tra user đã được authenticate chưa
        if (!req.jwtDecoded || !req.jwtDecoded._id) {
            return next(new ApiError(StatusCodes.UNAUTHORIZED, 'User not authenticated'))
        }

        // Lấy thông tin user từ database để kiểm tra role
        const user = await User.findById(req.jwtDecoded._id)
            .populate('usr_role', 'rol_name')
            .lean()

        if (!user) {
            return next(new ApiError(StatusCodes.UNAUTHORIZED, 'User not found'))
        }

        // Kiểm tra user có role admin không
        if (!user.usr_role || user.usr_role.rol_name !== 'admin') {
            return next(new ApiError(StatusCodes.FORBIDDEN, 'Access denied. Admin privileges required.'))
        }

        // Kiểm tra trạng thái user
        if (user.usr_status !== 'active') {
            return next(new ApiError(StatusCodes.FORBIDDEN, 'User account is not active'))
        }

        // Lưu thông tin user vào request để sử dụng sau
        req.user = user
        next()
    } catch (error) {
        next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message))
    }
}

// Middleware kiểm tra quyền admin đơn giản hơn (dựa trên JWT token)
const isAdminSimple = async (req, res, next) => {
    try {
        // Kiểm tra user đã được authenticate chưa
        if (!req.jwtDecoded || !req.jwtDecoded._id) {
            return next(new ApiError(StatusCodes.UNAUTHORIZED, 'User not authenticated'))
        }

        // Kiểm tra role trong JWT token
        if (!req.jwtDecoded.role || (typeof req.jwtDecoded.role === 'object' && req.jwtDecoded.role.rol_name !== 'admin') || (typeof req.jwtDecoded.role === 'string' && req.jwtDecoded.role !== 'admin')) {
            return next(new ApiError(StatusCodes.FORBIDDEN, 'Access denied. Admin privileges required.'))
        }

        next()
    } catch (error) {
        next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message))
    }
}

export const adminMiddlewares = {
    isAdmin,
    isAdminSimple
}
