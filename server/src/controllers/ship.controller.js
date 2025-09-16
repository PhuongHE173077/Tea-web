import { StatusCodes } from "http-status-codes"
import { shipService } from "~/services/ship.service"

const createShipConfig = async (req, res, next) => {
    try {
        // Lấy user ID từ JWT token
        const userId = req.jwtDecoded?._id
        if (!userId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                message: 'User not authenticated'
            })
        }

        const shipData = {
            ...req.body,
            createdBy: userId
        }

        const newShipConfig = await shipService.createShipConfig(shipData)

        res.status(StatusCodes.CREATED).json({
            success: true,
            message: 'Ship configuration created successfully',
            data: newShipConfig
        })
    } catch (error) {
        next(error)
    }
}

const getShipConfigs = async (req, res, next) => {
    try {
        const result = await shipService.getShipConfigs(req.query)

        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Ship configurations retrieved successfully',
            data: result.shipConfigs,
            pagination: result.pagination
        })
    } catch (error) {
        next(error)
    }
}

const getShipConfigById = async (req, res, next) => {
    try {
        const { id } = req.params
        const shipConfig = await shipService.getShipConfigById(id)

        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Ship configuration retrieved successfully',
            data: shipConfig
        })
    } catch (error) {
        next(error)
    }
}

const updateShipConfig = async (req, res, next) => {
    try {
        const { id } = req.params
        const userId = req.jwtDecoded?._id

        if (!userId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                message: 'User not authenticated'
            })
        }

        const updateData = {
            ...req.body,
            updatedBy: userId
        }

        const updatedShipConfig = await shipService.updateShipConfig(id, updateData)

        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Ship configuration updated successfully',
            data: updatedShipConfig
        })
    } catch (error) {
        next(error)
    }
}

const deleteShipConfig = async (req, res, next) => {
    try {
        const { id } = req.params
        const result = await shipService.deleteShipConfig(id)

        res.status(StatusCodes.OK).json({
            success: true,
            message: result.message
        })
    } catch (error) {
        next(error)
    }
}

const getActiveShipConfig = async (req, res, next) => {
    try {
        const activeConfig = await shipService.getActiveShipConfig()

        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Active ship configuration retrieved successfully',
            data: activeConfig
        })
    } catch (error) {
        next(error)
    }
}

const calculateShippingFee = async (req, res, next) => {
    try {
        const { orderValue } = req.body
        const result = await shipService.calculateShippingFee(orderValue)

        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Shipping fee calculated successfully',
            data: result
        })
    } catch (error) {
        next(error)
    }
}

const toggleShipConfigStatus = async (req, res, next) => {
    try {
        const { id } = req.params
        const { isActive } = req.body
        const userId = req.jwtDecoded?._id

        if (!userId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                message: 'User not authenticated'
            })
        }

        const updateData = {
            isActive,
            updatedBy: userId
        }

        const updatedShipConfig = await shipService.updateShipConfig(id, updateData)

        res.status(StatusCodes.OK).json({
            success: true,
            message: `Ship configuration ${isActive ? 'activated' : 'deactivated'} successfully`,
            data: updatedShipConfig
        })
    } catch (error) {
        next(error)
    }
}

export const shipController = {
    createShipConfig,
    getShipConfigs,
    getShipConfigById,
    updateShipConfig,
    deleteShipConfig,
    getActiveShipConfig,
    calculateShippingFee,
    toggleShipConfigStatus
}
