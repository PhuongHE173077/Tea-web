import Ship from "~/models/ship.model"
import ApiError from "~/utils/ApiError"
import { StatusCodes } from "http-status-codes"

const createShipConfig = async (shipData) => {
    try {
        // Nếu config mới được set active, deactivate tất cả config khác
        if (shipData.isActive) {
            await Ship.updateMany({}, { isActive: false })
        }

        const newShipConfig = new Ship(shipData)
        const savedShipConfig = await newShipConfig.save()
        
        // Populate thông tin user
        await savedShipConfig.populate('createdBy', 'usr_name usr_email')
        
        return savedShipConfig
    } catch (error) {
        if (error instanceof ApiError) {
            throw error
        }
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
    }
}

const getShipConfigs = async (query = {}) => {
    try {
        const {
            page = 1,
            limit = 10,
            isActive,
            search,
            sort_by = 'createdAt',
            sort_order = 'desc'
        } = query

        const filter = {}

        if (isActive !== undefined) {
            filter.isActive = isActive === 'true'
        }

        if (search) {
            filter.$or = [
                { description: { $regex: search, $options: 'i' } }
            ]
        }

        const sortOrder = sort_order === 'desc' ? -1 : 1
        const sortObj = { [sort_by]: sortOrder }

        const skip = (page - 1) * limit

        const [shipConfigs, total] = await Promise.all([
            Ship.find(filter)
                .populate('createdBy', 'usr_name usr_email')
                .populate('updatedBy', 'usr_name usr_email')
                .sort(sortObj)
                .skip(skip)
                .limit(parseInt(limit)),
            Ship.countDocuments(filter)
        ])

        return {
            shipConfigs,
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

const getShipConfigById = async (id) => {
    try {
        const shipConfig = await Ship.findById(id)
            .populate('createdBy', 'usr_name usr_email')
            .populate('updatedBy', 'usr_name usr_email')

        if (!shipConfig) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Ship configuration not found')
        }

        return shipConfig
    } catch (error) {
        if (error instanceof ApiError) {
            throw error
        }
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
    }
}

const updateShipConfig = async (id, updateData) => {
    try {
        const shipConfig = await Ship.findById(id)
        if (!shipConfig) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Ship configuration not found')
        }

        // Nếu config này được set active, deactivate tất cả config khác
        if (updateData.isActive === true) {
            await Ship.updateMany({ _id: { $ne: id } }, { isActive: false })
        }

        const updatedShipConfig = await Ship.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        )
            .populate('createdBy', 'usr_name usr_email')
            .populate('updatedBy', 'usr_name usr_email')

        return updatedShipConfig
    } catch (error) {
        if (error instanceof ApiError) {
            throw error
        }
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
    }
}

const deleteShipConfig = async (id) => {
    try {
        const shipConfig = await Ship.findById(id)
        if (!shipConfig) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Ship configuration not found')
        }

        // Không cho phép xóa config đang active nếu chỉ có 1 config
        if (shipConfig.isActive) {
            const totalConfigs = await Ship.countDocuments({})
            if (totalConfigs === 1) {
                throw new ApiError(StatusCodes.BAD_REQUEST, 'Cannot delete the only active shipping configuration')
            }
        }

        await Ship.findByIdAndDelete(id)
        return { message: 'Ship configuration deleted successfully' }
    } catch (error) {
        if (error instanceof ApiError) {
            throw error
        }
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
    }
}

const getActiveShipConfig = async () => {
    try {
        const activeConfig = await Ship.getActiveConfig()
        
        if (!activeConfig) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'No active shipping configuration found')
        }

        return activeConfig
    } catch (error) {
        if (error instanceof ApiError) {
            throw error
        }
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
    }
}

const calculateShippingFee = async (orderValue) => {
    try {
        const shippingFee = await Ship.calculateShippingFeeForOrder(orderValue)
        const activeConfig = await Ship.getActiveConfig()

        return {
            orderValue,
            shippingFee,
            freeShippingThreshold: activeConfig.freeShippingThreshold,
            isFreeShipping: shippingFee === 0,
            totalAmount: orderValue + shippingFee
        }
    } catch (error) {
        if (error instanceof ApiError) {
            throw error
        }
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
    }
}

export const shipService = {
    createShipConfig,
    getShipConfigs,
    getShipConfigById,
    updateShipConfig,
    deleteShipConfig,
    getActiveShipConfig,
    calculateShippingFee
}
